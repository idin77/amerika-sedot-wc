import { useState } from 'react';
import { 
  Check, 
  X, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Droplet, 
  Search, 
  FileText,
  Clock,
  DollarSign
} from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface ServiceComparisonTableProps {
  currentServiceId?: string;
  onSelectService?: (serviceName: string) => void;
  className?: string;
}

interface ServiceTier {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  priceRange: string;
  recommendedInterval: string;
  duration: string;
  popular?: boolean;
}

const SERVICE_TIERS: ServiceTier[] = [
  {
    id: 'pumping',
    name: 'Standard Pump',
    badge: 'Routine Maintenance',
    tagline: 'Complete vacuum evacuation of sludge and scum layers to prevent drainfield clogs.',
    priceRange: '$375 – $525',
    recommendedInterval: 'Every 2 – 3 Years',
    duration: '45 – 60 min',
    popular: true,
  },
  {
    id: 'cleaning',
    name: 'High-Pressure Cleaning',
    badge: 'Deep Restoration',
    tagline: 'High-PSI water hydro-jetting to emulsify hardened crust, grease rings, and line deposits.',
    priceRange: '$525 – $695',
    recommendedInterval: 'Every 4 – 5 Years / Heavy Use',
    duration: '75 – 90 min',
  },
  {
    id: 'inspection',
    name: 'System Inspection',
    badge: 'Diagnostic & Real Estate',
    tagline: 'Certified multi-point diagnostic, hydraulic load dye test, and official OSSF report.',
    priceRange: '$295 – $450',
    recommendedInterval: 'Home Sale / Annually for ATU',
    duration: '60 – 75 min',
  },
];

interface FeatureRow {
  name: string;
  description: string;
  category: string;
  standard: boolean | string;
  cleaning: boolean | string;
  inspection: boolean | string;
}

const COMPARISON_FEATURES: FeatureRow[] = [
  {
    name: 'Full Sludge & Liquid Vacuum Removal',
    description: 'Commercial vacuum extraction of top scum layer and settled bottom solids.',
    category: 'Pumping & Waste Removal',
    standard: true,
    cleaning: true,
    inspection: 'Optional Add-on',
  },
  {
    name: 'Licensed TCEQ Waste Disposal',
    description: 'Manifested legal disposal at certified Texas municipal wastewater plants.',
    category: 'Pumping & Waste Removal',
    standard: true,
    cleaning: true,
    inspection: 'If pumped',
  },
  {
    name: 'Inlet & Outlet Baffle Visual Check',
    description: 'Inspection of sanitary sanitary tees to prevent solids leaking into drainfield.',
    category: 'Inspection & Integrity',
    standard: true,
    cleaning: true,
    inspection: true,
  },
  {
    name: 'High-PSI Tank Wall Hydro-Jetting',
    description: 'Scouring sidewalls and tank floor to eliminate sticky grease and hardened biomat.',
    category: 'Deep Cleaning',
    standard: false,
    cleaning: true,
    inspection: false,
  },
  {
    name: 'Effluent Filter Extraction & Backwash',
    description: 'Chemical rinse and jetting of reusable cylindrical filter cartridges.',
    category: 'Deep Cleaning',
    standard: 'Basic Rinse',
    cleaning: true,
    inspection: 'Visual Check',
  },
  {
    name: 'Main Sewer Line Jetting (House to Tank)',
    description: 'Clearing grease, wipes, and mineral scale from the primary inlet pipe.',
    category: 'Deep Cleaning',
    standard: false,
    cleaning: true,
    inspection: false,
  },
  {
    name: 'Hydraulic Load & Drainfield Dye Test',
    description: 'Simulating household water flow to check for surface breakouts or slow drainage.',
    category: 'Diagnostics',
    standard: false,
    cleaning: false,
    inspection: true,
  },
  {
    name: 'Aerobic ATU & Mechanical Check',
    description: 'Testing air compressor PSI, aerator diffuser, timer, and high-water floats.',
    category: 'Diagnostics',
    standard: 'Visual Only',
    cleaning: 'Visual Only',
    inspection: true,
  },
  {
    name: 'Formal Written TCEQ OSSF Inspection Report',
    description: 'Documented photo report with component ratings for real estate or permitting.',
    category: 'Documentation',
    standard: 'Receipt & Manifest',
    cleaning: 'Receipt & Manifest',
    inspection: true,
  },
];

export function ServiceComparisonTable({
  currentServiceId = 'pumping',
  onSelectService,
  className = '',
}: ServiceComparisonTableProps) {
  const [activeTier, setActiveTier] = useState<string>(currentServiceId);

  const handleSelect = (tierId: string, tierName: string) => {
    setActiveTier(tierId);
    if (onSelectService) {
      onSelectService(tierName);
    }
    trackEvent('service_viewed', {
      service: tierName,
      source: 'service_comparison_table',
    });

    const formEl = document.getElementById('quote-form') || document.querySelector('form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderValue = (val: boolean | string) => {
    if (val === true) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </span>
      );
    }
    if (val === false) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
          <X className="w-3.5 h-3.5" />
        </span>
      );
    }
    return (
      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
        {val}
      </span>
    );
  };

  return (
    <section
      className={`py-12 sm:py-16 bg-white border-t border-slate-200 ${className}`}
      id="service-comparison"
      aria-label="Septic Service Comparison Table"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200">
            <Layers className="w-3.5 h-3.5" />
            <span>Service Level Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Which Septic Service Does Your Home Need?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Compare our three primary service levels to choose the exact level of care your system requires—from routine maintenance pump-outs to deep hydro-jet cleaning and real estate inspections.
          </p>
        </div>

        {/* Desktop Comparison Table (Hidden on Mobile) */}
        <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white divide-x divide-slate-800">
                <th className="p-6 w-1/4 align-bottom">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                    Features & Scope
                  </div>
                  <div className="text-lg font-bold text-white">Compare Service Tiers</div>
                  <p className="text-xs text-slate-400 mt-1">
                    All tiers provided by Texas TCEQ-licensed contractor partners.
                  </p>
                </th>

                {SERVICE_TIERS.map((tier) => {
                  const isCurrent = currentServiceId === tier.id;
                  return (
                    <th
                      key={tier.id}
                      className={`p-6 w-1/4 align-top transition-colors relative ${
                        isCurrent
                          ? 'bg-slate-800/95 ring-2 ring-inset ring-emerald-500'
                          : 'bg-slate-900'
                      }`}
                    >
                      {tier.popular && (
                        <span className="absolute -top-0 right-6 bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-b-md shadow-xs">
                          Most Requested
                        </span>
                      )}
                      {isCurrent && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/50 mb-1">
                          Current Service
                        </span>
                      )}
                      <div className="text-lg font-bold text-white">{tier.name}</div>
                      <div className="text-xs font-medium text-emerald-400 mb-2">{tier.badge}</div>
                      <div className="text-2xl font-extrabold text-white tracking-tight tabular-nums">
                        {tier.priceRange}
                      </div>
                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                        {tier.tagline}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleSelect(tier.id, tier.name)}
                        className={`mt-4 w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                          isCurrent
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xs'
                            : 'bg-white/10 hover:bg-white text-white hover:text-slate-900'
                        }`}
                      >
                        <span>Request {tier.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Quick Specs Subheader */}
            <tbody className="divide-y divide-slate-200">
              <tr className="bg-slate-50 divide-x divide-slate-200 text-xs font-semibold text-slate-700">
                <td className="p-4 pl-6 text-slate-900 font-bold">Recommended Frequency</td>
                {SERVICE_TIERS.map((tier) => (
                  <td key={tier.id} className="p-4 text-center">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {tier.recommendedInterval}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-50/50 divide-x divide-slate-200 text-xs font-semibold text-slate-700">
                <td className="p-4 pl-6 text-slate-900 font-bold">Estimated On-Site Duration</td>
                {SERVICE_TIERS.map((tier) => (
                  <td key={tier.id} className="p-4 text-center text-slate-600">
                    {tier.duration}
                  </td>
                ))}
              </tr>

              {/* Detailed Feature Rows */}
              {COMPARISON_FEATURES.map((feature, idx) => (
                <tr
                  key={feature.name}
                  className={`divide-x divide-slate-200 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  }`}
                >
                  <td className="p-4 pl-6">
                    <div className="text-xs font-bold text-slate-900">{feature.name}</div>
                    <div className="text-[11px] text-slate-500 leading-snug">
                      {feature.description}
                    </div>
                  </td>
                  <td className="p-4 text-center">{renderValue(feature.standard)}</td>
                  <td className="p-4 text-center">{renderValue(feature.cleaning)}</td>
                  <td className="p-4 text-center">{renderValue(feature.inspection)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Clean Segmented Cards */}
        <div className="lg:hidden space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SERVICE_TIERS.map((tier) => {
              const isCurrent = activeTier === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setActiveTier(tier.id)}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">{tier.name}</span>
                    <span className="text-[10px] font-bold text-emerald-700">{tier.badge}</span>
                  </div>
                  <div className="text-base font-extrabold text-slate-900 tabular-nums">
                    {tier.priceRange}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Mobile Tier Detail Card */}
          {(() => {
            const selected =
              SERVICE_TIERS.find((t) => t.id === activeTier) || SERVICE_TIERS[0];
            return (
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {selected.badge}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">{selected.duration}</span>
                </div>
                <h3 className="text-xl font-extrabold text-white mb-1">{selected.name}</h3>
                <div className="text-2xl font-bold text-emerald-400 tabular-nums mb-3">
                  {selected.priceRange}
                </div>
                <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                  {selected.tagline}
                </p>

                <div className="border-t border-slate-800 pt-4 mb-6 space-y-2.5">
                  <div className="text-xs font-bold text-slate-200 mb-2">Included in this service:</div>
                  {COMPARISON_FEATURES.map((feat) => {
                    const val =
                      selected.id === 'pumping'
                        ? feat.standard
                        : selected.id === 'cleaning'
                        ? feat.cleaning
                        : feat.inspection;
                    if (val === false) return null;
                    return (
                      <div key={feat.name} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white">{feat.name}</span>
                          {typeof val === 'string' && (
                            <span className="text-[11px] text-emerald-300 block">({val})</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => handleSelect(selected.id, selected.name)}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Select & Request {selected.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
