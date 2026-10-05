import { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Square, 
  Download, 
  Printer, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Droplets, 
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

interface ChecklistItem {
  id: string;
  category: 'daily' | 'quarterly' | 'annual' | 'multiyear';
  systemType: 'all' | 'conventional' | 'aerobic';
  title: string;
  description: string;
  importance: 'High' | 'Critical' | 'Medium';
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'wipes-grease',
    category: 'daily',
    systemType: 'all',
    title: 'Zero "Flushable" Wipes, Paper Towels, or Grease',
    description: 'Even wipes labeled "septic-safe" do not break down in anaerobic bacteria. Scrape cooled grease, oils, and bacon fat into the trash.',
    importance: 'Critical',
  },
  {
    id: 'laundry-spacing',
    category: 'daily',
    systemType: 'all',
    title: 'Spread Heavy Water Usage Across the Week',
    description: 'Do not run 5 loads of laundry on Saturday. Flooding the septic tank with 200+ gallons at once churns settled sludge into the drainfield lines.',
    importance: 'High',
  },
  {
    id: 'bleach-moderation',
    category: 'daily',
    systemType: 'all',
    title: 'Use Septic-Safe Household Cleaners in Moderation',
    description: 'Excessive bleach, drain drano acid, or antibacterial soaps wipe out beneficial anaerobic digesting bacteria inside the tank.',
    importance: 'Medium',
  },
  {
    id: 'drainfield-protection',
    category: 'quarterly',
    systemType: 'all',
    title: 'Keep Heavy Vehicles & Structures Off Drainfield',
    description: 'Never park trucks, trailers, or build sheds/pools over absorption trenches or septic tanks. Soil compaction crushes lateral pipes.',
    importance: 'Critical',
  },
  {
    id: 'visual-pooling-check',
    category: 'quarterly',
    systemType: 'all',
    title: 'Inspect Lawn for Sogginess or Sewage Odors',
    description: 'Walk the perimeter of the tank lids and absorption field. Lush dark green grass stripes or spongy damp soil indicates an overloaded system.',
    importance: 'High',
  },
  {
    id: 'effluent-filter-rinse',
    category: 'quarterly',
    systemType: 'all',
    title: 'Inspect & Rinse Effluent Filter Cartridge',
    description: 'If your tank has an outlet sanitary tee filter, pull it out and hose it down over the inlet chamber to prevent back-ups into the house.',
    importance: 'High',
  },
  {
    id: 'aerobic-compressor-check',
    category: 'quarterly',
    systemType: 'aerobic',
    title: 'Verify Aerobic Air Compressor & Spray Heads',
    description: 'Listen for steady hum from the linear diaphragm compressor. Ensure sprinkler timer fires during approved night hours without pooling.',
    importance: 'Critical',
  },
  {
    id: 'chlorine-tablet-check',
    category: 'quarterly',
    systemType: 'aerobic',
    title: 'Replenish NSF-Approved Calcium Hypochlorite Tablets',
    description: 'Never use swimming pool chlorine in aerobic septic systems. Pool tablets generate explosive gas. Use only septic-approved chlorine.',
    importance: 'Critical',
  },
  {
    id: 'alarm-testing',
    category: 'annual',
    systemType: 'all',
    title: 'Test High-Water Float Alarm & Electrical Box',
    description: 'Lift the alarm test toggle on your outdoor control panel to ensure buzzer and red beacon strobe activate properly before an emergency occurs.',
    importance: 'High',
  },
  {
    id: 'riser-gasket-inspection',
    category: 'annual',
    systemType: 'all',
    title: 'Check Tank Riser Lids for Water Tightness',
    description: 'Ensure bolts are secure and rubber gaskets prevent surface rainwater runoff from intruding into the tank during heavy Houston rainstorms.',
    importance: 'Medium',
  },
  {
    id: 'pumping-interval',
    category: 'multiyear',
    systemType: 'all',
    title: 'Schedule Complete Vacuum Pumping (Every 2–3 Years)',
    description: 'TCEQ recommends professional pump-out every 24–36 months for a standard 3-4 bedroom home. Removes bottom sludge before it overflows to soil.',
    importance: 'Critical',
  },
  {
    id: 'tceq-manifest-log',
    category: 'multiyear',
    systemType: 'all',
    title: 'Maintain Written Manifest & Pumping Records',
    description: 'Keep signed trip tickets from your licensed pumper in your home binder. Required by Texas real estate closing inspectors when selling.',
    importance: 'High',
  },
];

interface MaintenanceChecklistProps {
  className?: string;
  defaultSystemType?: 'all' | 'conventional' | 'aerobic';
}

export function MaintenanceChecklist({
  className = '',
  defaultSystemType = 'all',
}: MaintenanceChecklistProps) {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({
    'wipes-grease': true,
    'laundry-spacing': true,
    'drainfield-protection': true,
  });

  const [activeTab, setActiveTab] = useState<'all' | 'conventional' | 'aerobic'>(defaultSystemType);

  // Filter items based on active system tab
  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return CHECKLIST_ITEMS;
    return CHECKLIST_ITEMS.filter(
      (item) => item.systemType === 'all' || item.systemType === activeTab
    );
  }, [activeTab]);

  // Compute progress score
  const totalCount = filteredItems.length;
  const completedCount = filteredItems.filter((i) => checkedIds[i.id]).length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const next = !prev[id];
      trackEvent('checklist_item_toggled', { itemId: id, checked: next });
      return { ...prev, [id]: next };
    });
  };

  const resetChecklist = () => {
    setCheckedIds({});
    trackEvent('checklist_reset', { systemType: activeTab });
  };

  const handlePrintOrDownload = () => {
    trackEvent('checklist_downloaded', {
      systemType: activeTab,
      completionRate: `${completionPercentage}%`,
    });
    window.print();
  };

  const getHealthBadge = (score: number) => {
    if (score >= 80) {
      return {
        text: 'Optimal Septic Health (Protected)',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'bg-emerald-500',
      };
    }
    if (score >= 50) {
      return {
        text: 'Moderate Upkeep (Review Items Below)',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        barColor: 'bg-amber-500',
      };
    }
    return {
      text: 'Action Needed (High Risk of Clogs / Fines)',
      color: 'text-red-700 bg-red-50 border-red-200',
      barColor: 'bg-red-500',
    };
  };

  const health = getHealthBadge(completionPercentage);

  return (
    <section
      className={`py-12 sm:py-16 bg-slate-50 border-t border-slate-200 ${className}`}
      id="maintenance-checklist-section"
      aria-label="Homeowner Septic Maintenance Checklist"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Printable Version Header (Visible ONLY during window.print()) */}
        <div className="hidden print:block mb-8 text-slate-900 border-b pb-4">
          <div className="text-xl font-bold">{BUSINESS_CONFIG.brandName} – Homeowner Septic Upkeep Guide</div>
          <div className="text-xs text-slate-600">Texas Commission on Environmental Quality (TCEQ) Best Practices & Log</div>
          <div className="text-xs text-slate-600 mt-1">24/7 Houston Pumping Dispatch: {BUSINESS_CONFIG.phoneDisplay} · Web: {BUSINESS_CONFIG.domain}</div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2 print:hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Interactive Homeowner Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Septic System Health Checklist & PDF Guide
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Follow this Texas TCEQ-compliant preventative maintenance routine to prevent emergency backups, extend your drainfield life by 15+ years, and keep service records ready.
          </p>
        </div>

        {/* Interactive Controls & Progress Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8 print:border-none print:shadow-none print:p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 print:hidden">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>System:</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                All Systems ({CHECKLIST_ITEMS.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('conventional')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'conventional'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Conventional Gravity
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('aerobic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'aerobic'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Aerobic ATU & Sprinklers
              </button>
            </div>

            {/* Print / Download CTA */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={resetChecklist}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Reset all checkboxes"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                type="button"
                onClick={handlePrintOrDownload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save as PDF / Print Guide</span>
              </button>
            </div>
          </div>

          {/* Progress Bar & Health Rating */}
          <div className="pt-6 pb-2 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Your Upkeep Score: {completedCount} of {totalCount} Items Done ({completionPercentage}%)
                </span>
              </div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${health.color}`}>
                {health.text}
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${health.barColor}`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Checklist Items Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredItems.map((item) => {
              const isChecked = !!checkedIds[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-emerald-50/40 border-emerald-200 text-slate-900 ring-1 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50/80 text-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 text-emerald-600 focus:outline-none"
                    aria-label={`Mark ${item.title} as ${isChecked ? 'incomplete' : 'complete'}`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-bold ${
                          isChecked ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.importance === 'Critical' && (
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                          Critical
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Homeowner Service Log Section (Great for PDF / Printouts) */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Texas OSSF Service & Pumping History Log</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 print:mb-2">
              Keep this physical record near your electrical panel. Fill in every time a vacuum truck services your tank:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                    <th className="p-2.5 border-r border-slate-300">Service Date</th>
                    <th className="p-2.5 border-r border-slate-300">Contractor / Technician Name</th>
                    <th className="p-2.5 border-r border-slate-300">TCEQ Reg #</th>
                    <th className="p-2.5 border-r border-slate-300">Gallons Pumped</th>
                    <th className="p-2.5">Notes / Filter Cleaned?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr className="h-9">
                    <td className="p-2 border-r border-slate-200 font-mono text-[11px]">____ / ____ / 202__</td>
                    <td className="p-2 border-r border-slate-200">________________________</td>
                    <td className="p-2 border-r border-slate-200">___________</td>
                    <td className="p-2 border-r border-slate-200">_______ Gal</td>
                    <td className="p-2">________________________</td>
                  </tr>
                  <tr className="h-9 bg-slate-50/50">
                    <td className="p-2 border-r border-slate-200 font-mono text-[11px]">____ / ____ / 202__</td>
                    <td className="p-2 border-r border-slate-200">________________________</td>
                    <td className="p-2 border-r border-slate-200">___________</td>
                    <td className="p-2 border-r border-slate-200">_______ Gal</td>
                    <td className="p-2">________________________</td>
                  </tr>
                  <tr className="h-9">
                    <td className="p-2 border-r border-slate-200 font-mono text-[11px]">____ / ____ / 202__</td>
                    <td className="p-2 border-r border-slate-200">________________________</td>
                    <td className="p-2 border-r border-slate-200">___________</td>
                    <td className="p-2 border-r border-slate-200">_______ Gal</td>
                    <td className="p-2">________________________</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Tips Footer Card */}
        <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Houston Pro Tip</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Overdue for your 24–36 month pump-out?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Don't wait for showers to gurgle or sewage to surface on your lawn. Pumping on schedule protects your $12,000+ drainfield from irreversible biological clogging.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href="#quote-form"
              onClick={(e) => {
                const el = document.getElementById('quote-form') || document.querySelector('form');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Schedule Next Pumping</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
