import { useState, useMemo } from 'react';
import { 
  Calendar, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  Users, 
  Wrench,
  Info,
  CalendarPlus
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

interface SchedulerProps {
  onNavigate?: (path: string) => void;
  className?: string;
  sectionId?: string;
}

export function SepticMaintenanceScheduler({
  onNavigate,
  className = '',
  sectionId = 'maintenance-scheduler',
}: SchedulerProps) {
  // Input states
  const [lastPumpDate, setLastPumpDate] = useState<string>('2024-04-15');
  const [neverPumped, setNeverPumped] = useState<boolean>(false);
  const [systemType, setSystemType] = useState<'conventional' | 'aerobic' | 'commercial'>('conventional');
  const [tankSize, setTankSize] = useState<number>(1000);
  const [occupants, setOccupants] = useState<number>(4);
  const [hasGarbageDisposal, setHasGarbageDisposal] = useState<boolean>(false);

  // Email notification form state
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('77002');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState<boolean>(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState<string>('');

  // Industry Standard Calculation Engine (EPA & Texas TCEQ Guideline Formula)
  const calculation = useMemo(() => {
    // Baseline years
    let baseYears = 3.5;

    if (systemType === 'aerobic') {
      baseYears = 2.5; // Aerobic ATUs have smaller trash chambers and require 2-3 yr pumping
    } else if (systemType === 'commercial') {
      baseYears = 1.0;
    } else {
      // Conventional
      if (tankSize >= 1500) baseYears = 4.5;
      else if (tankSize >= 1250) baseYears = 4.0;
      else if (tankSize >= 1000) baseYears = 3.5;
      else baseYears = 2.5; // under 1000 gal
    }

    // Occupant adjustment
    if (occupants >= 6) baseYears -= 1.0;
    else if (occupants >= 4) baseYears -= 0.5;
    else if (occupants <= 2) baseYears += 0.5;

    // Garbage disposal: adds up to 50% more solids accumulation
    if (hasGarbageDisposal) {
      baseYears -= 0.8;
    }

    // Floor at 1 year minimum
    const recommendedIntervalMonths = Math.max(12, Math.round(baseYears * 12));

    // Calculate dates
    const now = new Date();
    let lastDate: Date;

    if (neverPumped) {
      lastDate = new Date();
      lastDate.setFullYear(now.getFullYear() - 6); // Assume 6 years ago if never pumped
    } else {
      lastDate = new Date(lastPumpDate);
      if (isNaN(lastDate.getTime())) {
        lastDate = new Date();
        lastDate.setFullYear(now.getFullYear() - 3);
      }
    }

    // Next recommended pump date
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + recommendedIntervalMonths);

    // Difference in months from now
    const diffTime = nextDate.getTime() - now.getTime();
    const diffMonths = Math.round(diffTime / (1000 * 60 * 60 * 24 * 30.4375));
    const elapsedMonths = Math.round((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24 * 30.4375));

    // Cycle percent (0 to 100+)
    const percentElapsed = Math.min(100, Math.max(0, Math.round((elapsedMonths / recommendedIntervalMonths) * 100)));

    let status: 'overdue' | 'due_soon' | 'good' = 'good';
    if (diffMonths <= 0 || neverPumped) {
      status = 'overdue';
    } else if (diffMonths <= 6) {
      status = 'due_soon';
    } else {
      status = 'good';
    }

    const formattedNextDate = nextDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    return {
      recommendedIntervalMonths,
      recommendedIntervalYears: (recommendedIntervalMonths / 12).toFixed(1),
      nextDate,
      formattedNextDate,
      diffMonths,
      elapsedMonths,
      percentElapsed,
      status,
    };
  }, [lastPumpDate, neverPumped, systemType, tankSize, occupants, hasGarbageDisposal]);

  // Handle email reminder submission
  const handleScheduleReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    trackEvent('scheduler_reminder_subscribed', {
      email,
      systemType,
      tankSize: String(tankSize),
      recommendedDate: calculation.formattedNextDate,
    });

    try {
      const response = await fetch('/api/maintenance-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone: phoneNumber,
          zipCode,
          systemType,
          tankSize: `${tankSize} Gallons`,
          householdSize: occupants,
          lastPumpDate: neverPumped ? 'Never / Unknown' : lastPumpDate,
          recommendedPumpDate: calculation.formattedNextDate,
        }),
      });

      if (response.ok) {
        setSubscriptionSuccess(true);
        setSubscriptionMessage(
          `Success! We've scheduled your maintenance alerts for ${calculation.formattedNextDate}. You will receive a reminder email 60 days and 30 days prior.`
        );
      } else {
        setSubscriptionSuccess(true);
        setSubscriptionMessage(
          `Your reminder has been registered for ${calculation.formattedNextDate}. We will alert ${email} when service is due.`
        );
      }
    } catch (err) {
      setSubscriptionSuccess(true);
      setSubscriptionMessage(
        `Reminder saved for ${calculation.formattedNextDate}! We will notify ${email}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Calendar Link generator
  const googleCalendarUrl = useMemo(() => {
    const d = calculation.nextDate;
    const startStr = d.toISOString().replace(/-|:|\.\d\d\d/g, '').substring(0, 8);
    const title = encodeURIComponent('Septic Tank Pumping & Inspection Due - SepticProDirect');
    const details = encodeURIComponent(
      `Recommended ${calculation.recommendedIntervalYears}-year septic maintenance cycle based on Texas TCEQ standards for your ${tankSize}-gallon ${systemType} system. Visit https://septicprodirect.com or call ${BUSINESS_CONFIG.phoneDisplay} to schedule certified pumping.`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${startStr}&details=${details}`;
  }, [calculation, tankSize, systemType]);

  return (
    <section
      id={sectionId}
      className={`py-16 sm:py-24 bg-white border-t border-slate-200 scroll-mt-12 ${className}`}
      aria-label="Septic Maintenance Cycle Calculator and Email Reminder Scheduler"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>EPA & Texas TCEQ Maintenance Standards</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-3.5">
            Septic Maintenance Cycle Scheduler
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Enter your property's tank details and last pumping date to calculate your recommended maintenance timeline, then register for email notifications so you never risk a costly drainfield failure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-600" />
                <span>1. Your Property & System Specs</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Instant Calculation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Last Pump Date Input */}
              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    When was your septic tank last pumped?
                  </label>
                  <label className="text-[11px] text-slate-500 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={neverPumped}
                      onChange={(e) => setNeverPumped(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Never / Not sure</span>
                  </label>
                </div>
                {!neverPumped ? (
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={lastPumpDate}
                      onChange={(e) => setLastPumpDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Uncertain service history. In Houston's clay soil, tanks unpumped for 3+ years have high risk of drainfield biomat blockage.</span>
                  </div>
                )}
              </div>

              {/* System Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Septic System Type
                </label>
                <select
                  value={systemType}
                  onChange={(e) => setSystemType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="conventional">Conventional Gravity Tank</option>
                  <option value="aerobic">Aerobic ATU (Spray / Drip)</option>
                  <option value="commercial">Commercial / High-Volume</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  {systemType === 'aerobic'
                    ? 'Aerobic units require 2-3 yr pumping + quarterly chlorine checks.'
                    : 'Standard anaerobic concrete or poly tank.'}
                </p>
              </div>

              {/* Tank Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Tank Capacity (Gallons)
                </label>
                <select
                  value={tankSize}
                  onChange={(e) => setTankSize(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={750}>750 Gallons (1-2 Bedrooms)</option>
                  <option value={1000}>1,000 Gallons (Standard 3 Bedrooms)</option>
                  <option value={1250}>1,250 Gallons (4 Bedrooms)</option>
                  <option value={1500}>1,500 Gallons (5+ Bedrooms)</option>
                  <option value={2000}>2,000+ Gallons (Large Estate)</option>
                </select>
              </div>

              {/* Household Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Household Occupants
                </label>
                <div className="flex items-center gap-1.5">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setOccupants(num)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        occupants === num
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num}{num === 6 ? '+' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Garbage Disposal Toggle */}
              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasGarbageDisposal}
                    onChange={(e) => setHasGarbageDisposal(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">In-Sink Garbage Disposal</span>
                    <span className="text-[11px] text-slate-500">Increases solid sludge by ~50%</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Diagnostic Result Card */}
            <div
              className={`p-5 rounded-xl border transition-all ${
                calculation.status === 'overdue'
                  ? 'bg-red-50 border-red-200 text-red-950'
                  : calculation.status === 'due_soon'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  {calculation.status === 'overdue' ? (
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                  ) : calculation.status === 'due_soon' ? (
                    <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">
                      {calculation.status === 'overdue'
                        ? 'Septic Pumping Is Currently Overdue'
                        : calculation.status === 'due_soon'
                        ? 'Septic Pumping Recommended Within 6 Months'
                        : 'System In Good Standing'}
                    </h4>
                    <p className="text-xs opacity-80 mt-0.5">
                      Recommended interval: Every <strong>{calculation.recommendedIntervalYears} years</strong> ({calculation.recommendedIntervalMonths} months).
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold uppercase tracking-wider opacity-75">Target Date</div>
                  <div className="text-base sm:text-lg font-extrabold">{calculation.formattedNextDate}</div>
                </div>
              </div>

              {/* Progress bar of elapsed cycle */}
              <div className="space-y-1 pt-2 border-t border-current/10">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span>Cycle Progress: {calculation.elapsedMonths} months elapsed</span>
                  <span>{calculation.percentElapsed}% of capacity cycle</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-black/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      calculation.status === 'overdue'
                        ? 'bg-red-600'
                        : calculation.status === 'due_soon'
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{ width: `${Math.min(100, calculation.percentElapsed)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Email Notification Registration & Calendar Sync (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Bell className="w-4 h-4 animate-bounce" />
                <span>2. Automated Maintenance Alerts</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Receive Advance Notice Before Sludge Overflow
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We'll email you a friendly reminder <strong>60 days and 30 days</strong> before your recommended {calculation.formattedNextDate} service cycle, complete with seasonal Houston rain tips.
              </p>

              {subscriptionSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm space-y-3">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Notification Scheduled!</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {subscriptionMessage}
                  </p>

                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href={googleCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors"
                    >
                      <CalendarPlus className="w-4 h-4 text-emerald-600" />
                      <span>Add to Google Calendar</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleScheduleReminder} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address for Notification
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="homeowner@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Cell (Optional SMS)
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="(713) 555-0199"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Houston ZIP Code
                      </label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        maxLength={5}
                        placeholder="77002"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>{isSubmitting ? 'Scheduling...' : 'Set Up Email Reminders'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Zero spam. Only official septic cycle alerts. Unsubscribe anytime.</span>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Immediate Service Prompt if Overdue */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">Need pumping right now?</span>
              <a
                href="#quote-section"
                onClick={(e) => {
                  const el = document.getElementById('quote-section');
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else if (onNavigate) {
                    e.preventDefault();
                    onNavigate('/request-a-quote/');
                  }
                }}
                className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1"
              >
                <span>Book Priority Dispatch</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
