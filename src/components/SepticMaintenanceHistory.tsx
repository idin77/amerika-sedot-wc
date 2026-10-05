import { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  History, 
  PlusCircle, 
  Printer, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Droplet, 
  Wrench, 
  FileText, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Trash2, 
  Phone, 
  ArrowRight,
  Download,
  CalendarCheck,
  Building
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

export interface MaintenanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  serviceType: 'Pumping' | 'Aerobic Service' | 'Inspection' | 'Filter Clean' | 'Repair';
  provider: string;
  gallonsPumped?: number;
  sludgeDepth?: string;
  cost?: number;
  tankCondition: 'Optimal' | 'Satisfactory' | 'Needs Attention';
  notes: string;
  nextDueDate: string; // YYYY-MM-DD
}

const DEFAULT_RECORDS: MaintenanceRecord[] = [
  {
    id: 'rec-1',
    date: '2026-04-12',
    serviceType: 'Pumping',
    provider: 'SepticProDirect Partner Crew (Katy Dispatch)',
    gallonsPumped: 1500,
    sludgeDepth: '18 inches (35% tank volume)',
    cost: 495,
    tankCondition: 'Optimal',
    notes: 'Full pump-out and vacuum scrub of dual compartments. Inspected outlet baffle Tee—good condition. Reset biological digestion with starter enzyme.',
    nextDueDate: '2029-04-12',
  },
  {
    id: 'rec-2',
    date: '2025-10-18',
    serviceType: 'Aerobic Service',
    provider: 'TCEQ Licensed Maintenance Provider',
    gallonsPumped: 0,
    sludgeDepth: '6 inches',
    cost: 185,
    tankCondition: 'Optimal',
    notes: 'Semi-annual 3-point aerobic inspection. Cleaned compressor air intake filter, tested high-water alarm horn, and replenished chlorine tablets.',
    nextDueDate: '2026-10-18',
  },
  {
    id: 'rec-3',
    date: '2025-03-05',
    serviceType: 'Inspection',
    provider: 'Harris County OSSF Site Specialist',
    cost: 250,
    tankCondition: 'Satisfactory',
    notes: 'Pre-purchase hydraulic load dye test for real estate closing. Verified zero surface pooling over drainfield lateral trenches.',
    nextDueDate: '2027-03-05',
  },
];

const UPCOMING_REMINDER_TEMPLATES = [
  {
    title: 'Aerobic ATU Air Filter & Chlorine Check',
    intervalMonths: 6,
    type: 'Aerobic Service',
    description: 'Rinse washable compressor air intake filter and refill chlorine sanitizer tube to prevent foul odors.',
  },
  {
    title: 'Reusable Effluent Filter Scrub',
    intervalMonths: 6,
    type: 'Filter Clean',
    description: 'Remove and hose down the nylon/bristle filter in your outlet baffle to maintain proper gravity drainage.',
  },
  {
    title: 'Annual Sludge & Scum Layer Depth Check',
    intervalMonths: 12,
    type: 'Inspection',
    description: 'Use a Sludge Judge core sampler to gauge scum depth. Pump if solids exceed 30% of total liquid depth.',
  },
  {
    title: 'Comprehensive Tank Pump-Out & TCEQ Sludge Manifest',
    intervalMonths: 36,
    type: 'Pumping',
    description: 'Full vacuum truck pumping by licensed TCEQ sludge transporters to protect drainfield soil absorption.',
  },
];

interface SepticMaintenanceHistoryProps {
  onNavigate?: (path: string) => void;
  className?: string;
  sectionId?: string;
}

export function SepticMaintenanceHistory({
  onNavigate,
  className = '',
  sectionId = 'maintenance-history',
}: SepticMaintenanceHistoryProps) {
  const [records, setRecords] = useState<MaintenanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('septic_maintenance_history_records_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore error
    }
    return DEFAULT_RECORDS;
  });

  const [viewMode, setViewMode] = useState<'records' | 'calendar'>('records');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Record Form State
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formType, setFormType] = useState<MaintenanceRecord['serviceType']>('Pumping');
  const [formProvider, setFormProvider] = useState<string>('SepticProDirect Partner Crew');
  const [formGallons, setFormGallons] = useState<string>('1500');
  const [formCost, setFormCost] = useState<string>('475');
  const [formCondition, setFormCondition] = useState<MaintenanceRecord['tankCondition']>('Optimal');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formNextDueDate, setFormNextDueDate] = useState<string>(() => {
    const next = new Date();
    next.setFullYear(next.getFullYear() + 3);
    return next.toISOString().split('T')[0];
  });

  // Calendar Month Navigation
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(() => new Date());

  // Save records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('septic_maintenance_history_records_v1', JSON.stringify(records));
    } catch {
      // Ignore quota error
    }
  }, [records]);

  // Handle Add Record
  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: MaintenanceRecord = {
      id: `rec-${Date.now()}`,
      date: formDate,
      serviceType: formType,
      provider: formProvider || 'Licensed Septic Specialist',
      gallonsPumped: formGallons ? Number(formGallons) : undefined,
      cost: formCost ? Number(formCost) : undefined,
      tankCondition: formCondition,
      notes: formNotes || `${formType} service completed for residential property.`,
      nextDueDate: formNextDueDate,
    };

    setRecords((prev) => [newRecord, ...prev]);
    setShowAddModal(false);
    setFormNotes('');

    trackEvent('maintenance_record_added', {
      service: formType,
      source: 'maintenance_history_tracker',
    });
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Find nearest upcoming service reminder
  const nextUpcomingService = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const futureDue = records
      .map((r) => ({
        dueDate: r.nextDueDate,
        serviceType: r.serviceType,
        provider: r.provider,
        id: r.id,
      }))
      .filter((r) => r.dueDate >= today)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    return futureDue[0] || null;
  }, [records]);

  // Calendar rendering calculations
  const calendarYear = currentCalendarDate.getFullYear();
  const calendarMonth = currentCalendarDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();

  // Find reminders / records in currently displayed calendar month
  const currentMonthEvents = useMemo(() => {
    const prefix = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}`;
    const pastInMonth = records.filter((r) => r.date.startsWith(prefix));
    const dueInMonth = records.filter((r) => r.nextDueDate && r.nextDueDate.startsWith(prefix));

    return { pastInMonth, dueInMonth };
  }, [records, calendarYear, calendarMonth]);

  const handlePrintLog = () => {
    trackEvent('maintenance_log_exported', { count: records.length });
    window.print();
  };

  return (
    <section
      id={sectionId}
      className={`py-16 sm:py-24 bg-slate-900 text-white scroll-mt-12 relative overflow-hidden border-t border-slate-800 ${className}`}
      aria-label="Houston Septic Maintenance History and Upcoming Service Calendar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 text-xs font-semibold mb-3">
            <History className="w-3.5 h-3.5" />
            <span>Digital Homeowner Maintenance Passport</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3">
            Septic Service History & Reminders
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Keep an audit-proof log of past pump-outs, aerobic inspections, and repairs. View upcoming maintenance cycles to protect your drainfield and satisfy Texas Real Estate Seller's Disclosure requirements.
          </p>
        </div>

        {/* Top Control Bar: Active Upcoming Alert, View Switcher & Action Buttons */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Next Due Alert Banner */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Next Recommended Service
              </span>
              {nextUpcomingService ? (
                <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="text-emerald-400">{nextUpcomingService.serviceType} Due:</span>
                  <span>{new Date(nextUpcomingService.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              ) : (
                <div className="text-xs text-slate-300">
                  All systems currently up to date. Schedule your 3-year pump-out.
                </div>
              )}
            </div>
          </div>

          {/* View Toggles & Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2 w-full lg:w-auto">
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setViewMode('records');
                  trackEvent('maintenance_calendar_viewed', { mode: 'records' });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'records'
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Service Log ({records.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('calendar');
                  trackEvent('maintenance_calendar_viewed', { mode: 'calendar' });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'calendar'
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Calendar View</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Past Service</span>
            </button>

            <button
              type="button"
              onClick={handlePrintLog}
              title="Print Official Service Log for Real Estate or Insurance"
              className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View 1: Service Log Records Cards */}
        {viewMode === 'records' && (
          <div className="space-y-4">
            {records.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-3">
                <FileText className="w-8 h-8 text-slate-500 mx-auto" />
                <h3 className="font-bold text-white text-base">No Maintenance Records Logged Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click the "Log Past Service" button above to track your previous pumping receipts, aerobic maintenance visits, or county inspections.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add First Record</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {records.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-600 transition-all shadow-sm group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2 border-b border-slate-700/80 pb-3">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 uppercase">
                            {rec.serviceType}
                          </span>
                          <h3 className="text-sm font-bold text-white mt-1.5">
                            {new Date(rec.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            rec.tankCondition === 'Optimal'
                              ? 'bg-emerald-900/60 text-emerald-300'
                              : rec.tankCondition === 'Satisfactory'
                              ? 'bg-amber-900/60 text-amber-300'
                              : 'bg-red-900/60 text-red-300'
                          }`}>
                            {rec.tankCondition}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleDeleteRecord(rec.id)}
                            title="Delete this record"
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Provider & Key Metrics */}
                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Service Provider:</span>
                          <strong className="text-white text-right truncate max-w-[180px]">{rec.provider}</strong>
                        </div>

                        {rec.gallonsPumped ? (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Volume Pumped:</span>
                            <span className="text-emerald-400 font-bold">{rec.gallonsPumped} Gallons</span>
                          </div>
                        ) : null}

                        {rec.cost ? (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Total Investment:</span>
                            <span className="text-slate-200 font-bold">${rec.cost}</span>
                          </div>
                        ) : null}

                        {rec.sludgeDepth ? (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Sludge Depth:</span>
                            <span className="text-slate-300">{rec.sludgeDepth}</span>
                          </div>
                        ) : null}
                      </div>

                      {/* Notes Box */}
                      {rec.notes && (
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-[11px] text-slate-300 leading-relaxed">
                          {rec.notes}
                        </div>
                      )}
                    </div>

                    {/* Next Due Strip */}
                    <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>Next Due:</span>
                      </span>
                      <strong className="text-emerald-400">
                        {new Date(rec.nextDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 2: Interactive Upcoming Service Calendar View */}
        {viewMode === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Monthly Calendar Grid (7 cols) */}
            <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
              {/* Calendar Month Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Maintenance Calendar
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    {monthNames[calendarMonth]} {calendarYear}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentCalendarDate(new Date(calendarYear, calendarMonth - 1, 1))}
                    className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentCalendarDate(new Date())}
                    className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Today
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentCalendarDate(new Date(calendarYear, calendarMonth + 1, 1))}
                    className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 border-b border-slate-700/80 pb-2">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Calendar Grid Days */}
              <div className="grid grid-cols-7 gap-1.5">
                {/* Empty prefix cells */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-16 rounded-xl bg-slate-900/30 opacity-20" />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  
                  const hasDue = records.some((r) => r.nextDueDate === dateStr);
                  const hasPast = records.some((r) => r.date === dateStr);

                  return (
                    <div
                      key={dateStr}
                      className={`h-16 rounded-xl p-1.5 flex flex-col justify-between border transition-all text-xs ${
                        hasDue
                          ? 'bg-emerald-950/80 border-emerald-500/80 ring-2 ring-emerald-500/40'
                          : hasPast
                          ? 'bg-slate-800 border-slate-600'
                          : 'bg-slate-900/60 border-slate-700/50'
                      }`}
                    >
                      <span className="font-bold text-slate-300">{dayNum}</span>

                      {hasDue && (
                        <div className="text-[9px] font-bold px-1 py-0.5 rounded bg-emerald-500 text-slate-950 truncate">
                          Due
                        </div>
                      )}

                      {hasPast && !hasDue && (
                        <div className="text-[9px] font-bold px-1 py-0.5 rounded bg-slate-700 text-slate-300 truncate">
                          Pumped
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-700/80">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Scheduled Service Due</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <span>Logged Past Maintenance</span>
                </span>
              </div>
            </div>

            {/* Right: Recommended Houston Maintenance Checklist & Dispatch (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Recommended Maintenance Timeline
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Greater Houston Best Practice Intervals
                  </h3>
                </div>

                <div className="space-y-3">
                  {UPCOMING_REMINDER_TEMPLATES.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-white">
                        <span>{item.title}</span>
                        <span className="text-emerald-400 text-[11px]">Every {item.intervalMonths} Mos</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Quick Booking CTA */}
                <div className="pt-2">
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
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                  >
                    <span>Schedule Upcoming Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Past Service Record */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-base">Log Septic Service Record</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleAddRecord} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Service Date *</label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Service Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Pumping">Tank Pumping</option>
                      <option value="Aerobic Service">Aerobic ATU Service</option>
                      <option value="Inspection">TCEQ Inspection</option>
                      <option value="Filter Clean">Effluent Filter Clean</option>
                      <option value="Repair">Riser / Pipe Repair</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Contractor / Provider</label>
                    <input
                      type="text"
                      value={formProvider}
                      onChange={(e) => setFormProvider(e.target.value)}
                      placeholder="e.g. SepticProDirect Partner"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Gallons Pumped</label>
                    <input
                      type="number"
                      value={formGallons}
                      onChange={(e) => setFormGallons(e.target.value)}
                      placeholder="e.g. 1500"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Cost Paid ($)</label>
                    <input
                      type="number"
                      value={formCost}
                      onChange={(e) => setFormCost(e.target.value)}
                      placeholder="e.g. 495"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Tank Condition</label>
                    <select
                      value={formCondition}
                      onChange={(e) => setFormCondition(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Optimal">Optimal (No Issues)</option>
                      <option value="Satisfactory">Satisfactory (Minor Wear)</option>
                      <option value="Needs Attention">Needs Attention (Root/Crack)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Next Service Due Date</label>
                  <input
                    type="date"
                    required
                    value={formNextDueDate}
                    onChange={(e) => setFormNextDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Technician Notes</label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="e.g. Dual compartments cleaned. Baffles checked. Tank resealed."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors cursor-pointer"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
