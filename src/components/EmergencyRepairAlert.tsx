import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CloudRain, 
  Phone, 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  Square, 
  CheckSquare, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Zap, 
  Droplet, 
  ArrowRight,
  Flame,
  LifeBuoy
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

interface EmergencyActionStep {
  id: string;
  title: string;
  instruction: string;
  urgency: 'Immediate' | 'Safety Warning' | 'Preventative';
  icon: any;
}

const EMERGENCY_STEPS: EmergencyActionStep[] = [
  {
    id: 'stop-water',
    title: 'Cease All Indoor Heavy Water Usage Immediately',
    instruction: 'Do NOT run laundry washing machines, dishwashers, or long showers. Saturated drainfields cannot absorb new water, pushing greywater back up into floor drains and bathtubs.',
    urgency: 'Immediate',
    icon: Droplet,
  },
  {
    id: 'exterior-cleanout',
    title: 'Locate & Release the Exterior Plumbing Cleanout Plug',
    instruction: 'If drains are gurgling or water is rising in ground-floor toilets, carefully unscrew the white PVC cleanout cap in your yard. This relieves pipe pressure and diverts sewage outside rather than ruining interior hardwood or carpets.',
    urgency: 'Immediate',
    icon: ShieldAlert,
  },
  {
    id: 'aerobic-breaker',
    title: 'Silence Alarm & Protect Aerobic Compressor Breakers',
    instruction: 'If your ATU control box alarm is blaring or floodwater threatens the linear air compressor, flip the exterior control panel toggle to "Silence" or switch the breaker off to prevent motor short-circuits.',
    urgency: 'Safety Warning',
    icon: Zap,
  },
  {
    id: 'no-submerged-pump',
    title: 'CRITICAL: Never Vacuum Pump a Completely Submerged Tank',
    instruction: 'Texas TCEQ Safety Rule: An empty septic tank in waterlogged clay acts like a boat. Pumping it while yard water is standing causes upward hydrostatic buoyancy that pops the tank out of the ground, rupturing foundation lines. Wait until standing surface water recedes.',
    urgency: 'Safety Warning',
    icon: AlertTriangle,
  },
];

interface EmergencyRepairAlertProps {
  onNavigate?: (path: string) => void;
  className?: string;
  initialMode?: 'rainy' | 'high_volume';
}

export function EmergencyRepairAlert({
  onNavigate,
  className = '',
  initialMode = 'rainy',
}: EmergencyRepairAlertProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [mode, setMode] = useState<'rainy' | 'high_volume'>(initialMode);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    trackEvent('emergency_alert_viewed', {
      source: 'homepage_alert',
      mode,
    });
  }, [mode]);

  const toggleStep = (stepId: string) => {
    setCheckedSteps((prev) => {
      const next = !prev[stepId];
      trackEvent('emergency_alert_action_clicked', {
        service: stepId,
        source: next ? 'step_completed' : 'step_uncompleted',
      });
      return { ...prev, [stepId]: next };
    });
  };

  const completedCount = Object.values(checkedSteps).filter(Boolean).length;

  const handlePhoneEmergency = () => {
    trackEvent('phone_click', {
      source: 'emergency_repair_alert_banner',
      phoneNumber: BUSINESS_CONFIG.phoneRaw,
    });
  };

  const handlePriorityBooking = () => {
    trackEvent('emergency_alert_action_clicked', {
      service: 'Emergency Septic Pumping',
      source: 'alert_priority_button',
    });

    const quoteSection = document.getElementById('quote-section') || document.querySelector('form');
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigate) {
      onNavigate('/request-a-quote/');
    }
  };

  if (isDismissed) {
    return (
      <div className="fixed bottom-5 right-5 z-40 animate-in fade-in slide-in-from-bottom-2">
        <button
          type="button"
          onClick={() => {
            setIsDismissed(false);
            setIsOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer ring-4 ring-red-500/20"
        >
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span>Houston Storm Advisory ({completedCount}/4 Steps)</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="High Volume and Rainy Season Septic Emergency Alert"
      className={`bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-b border-red-500/40 text-white relative z-30 transition-all ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top Summary Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0 text-red-400 mt-0.5 sm:mt-0">
              {mode === 'rainy' ? (
                <CloudRain className="w-4 h-4 animate-pulse" />
              ) : (
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white shadow-xs">
                  {mode === 'rainy' ? 'Weather Alert' : 'High-Volume Period'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white">
                  {mode === 'rainy'
                    ? 'Houston Rainy Season & Saturated Clay Advisory'
                    : 'Peak Weekend & Holiday Emergency Dispatch Mode'}
                </span>
                <span className="hidden lg:inline text-[11px] text-red-200">
                  Heavy rainfall causes rapid drainfield hydro-lock across Greater Houston.
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Mode switcher tabs */}
            <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-[10px]">
              <button
                type="button"
                onClick={() => setMode('rainy')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  mode === 'rainy' ? 'bg-red-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Rainstorm
              </button>
              <button
                type="button"
                onClick={() => setMode('high_volume')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  mode === 'high_volume' ? 'bg-amber-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                High Demand
              </button>
            </div>

            {/* Expand / Collapse Action Guide */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <span>{isOpen ? 'Hide Checklist' : 'Action Steps'}</span>
              {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Direct Emergency Call */}
            <a
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              onClick={handlePhoneEmergency}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{BUSINESS_CONFIG.phoneDisplay}</span>
            </a>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Dismiss alert"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Actionable Steps Drawer */}
        {isOpen && (
          <div className="mt-4 pt-4 border-t border-red-500/30 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-red-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-200">
                  First 60-Minute Homeowner Emergency Protocol
                </h3>
              </div>
              <div className="text-[11px] text-slate-300">
                Steps Completed: <strong className="text-emerald-400">{completedCount} of 4</strong>
              </div>
            </div>

            {/* 4 Interactive Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {EMERGENCY_STEPS.map((step) => {
                const isChecked = !!checkedSteps[step.id];
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left select-none flex flex-col justify-between ${
                      isChecked
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100 ring-1 ring-emerald-500/20'
                        : 'bg-slate-800/80 border-slate-700/80 hover:border-red-400/60 text-slate-200'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                            step.urgency === 'Immediate'
                              ? 'bg-red-950 text-red-300 border-red-700'
                              : 'bg-amber-950 text-amber-300 border-amber-700'
                          }`}
                        >
                          {step.urgency}
                        </span>

                        <button
                          type="button"
                          className="text-current focus:outline-none"
                          aria-label={`Toggle ${step.title}`}
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-start gap-2">
                        <Icon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <h4 className={`text-xs font-bold leading-snug ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                          {step.title}
                        </h4>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {step.instruction}
                      </p>
                    </div>

                    <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-700/50 mt-2">
                      {isChecked ? '✓ Step verified' : 'Click card once completed'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Dispatch Bottom Strip */}
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-200">
                  Active wet-weather technician routes in Harris, Fort Bend, Montgomery, and Brazoria counties.
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePriorityBooking}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Dispatch Priority Vacuum Truck</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
