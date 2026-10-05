import { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  HelpCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

interface SepticCostCalculatorProps {
  onApplyEstimate?: (estimate: {
    tankSize: string;
    lastService: string;
    estimatedCost: string;
    urgencyLevel: string;
  }) => void;
  className?: string;
  compact?: boolean;
}

interface TankOption {
  id: string;
  label: string;
  sublabel: string;
  baseMin: number;
  baseMax: number;
}

const TANK_OPTIONS: TankOption[] = [
  {
    id: '750-1000',
    label: '750 – 1,000 Gallons',
    sublabel: '1–2 Bedroom homes or older conventional tanks',
    baseMin: 375,
    baseMax: 475,
  },
  {
    id: '1000-1250',
    label: '1,000 – 1,250 Gallons',
    sublabel: 'Standard 3–4 Bedroom Houston suburban homes',
    baseMin: 425,
    baseMax: 545,
  },
  {
    id: '1500',
    label: '1,500 Gallons',
    sublabel: 'Large 4–5 Bedroom homes & standard Aerobic ATUs',
    baseMin: 495,
    baseMax: 650,
  },
  {
    id: '1750-2000',
    label: '1,750 – 2,000+ Gallons',
    sublabel: 'Acreage properties, multi-bath estates & commercial',
    baseMin: 625,
    baseMax: 850,
  },
];

interface LastServiceOption {
  id: string;
  label: string;
  sublabel: string;
  multiplier: number;
  urgency: 'Normal' | 'Recommended' | 'Urgent' | 'Critical';
  riskNote: string;
}

const LAST_SERVICE_OPTIONS: LastServiceOption[] = [
  {
    id: 'less-than-2',
    label: 'Less than 2 years ago',
    sublabel: 'Routine maintenance window',
    multiplier: 1.0,
    urgency: 'Normal',
    riskNote: 'Standard routine pump-out. Light-to-moderate sludge layer expected.',
  },
  {
    id: '2-to-3',
    label: '2 – 3 years ago',
    sublabel: 'TCEQ recommended pumping interval',
    multiplier: 1.05,
    urgency: 'Recommended',
    riskNote: 'Optimal service timing to prevent solid sludge migration to drain lines.',
  },
  {
    id: '4-to-5',
    label: '4 – 5 years ago',
    sublabel: 'Overdue service interval',
    multiplier: 1.15,
    urgency: 'Urgent',
    riskNote: 'Heavy compacted sludge. Effluent filter and baffles likely require thorough cleaning.',
  },
  {
    id: '6-plus-or-never',
    label: '6+ years / Never / Not sure',
    sublabel: 'High accumulation risk',
    multiplier: 1.25,
    urgency: 'Critical',
    riskNote: 'Severe risk of drainfield clogs or sewage backup. May require crust breakup/hydro-jetting.',
  },
];

export function SepticCostCalculator({
  onApplyEstimate,
  className = '',
  compact = false,
}: SepticCostCalculatorProps) {
  const [selectedTank, setSelectedTank] = useState<string>('1000-1250');
  const [selectedServiceDate, setSelectedServiceDate] = useState<string>('2-to-3');
  const [hasLidAccess, setHasLidAccess] = useState<boolean>(true); // true = risers accessible, false = digging required

  const tankData = useMemo(() => {
    return TANK_OPTIONS.find((t) => t.id === selectedTank) || TANK_OPTIONS[1];
  }, [selectedTank]);

  const serviceData = useMemo(() => {
    return (
      LAST_SERVICE_OPTIONS.find((s) => s.id === selectedServiceDate) ||
      LAST_SERVICE_OPTIONS[1]
    );
  }, [selectedServiceDate]);

  // Calculate ballpark range
  const calculation = useMemo(() => {
    const diggingFee = hasLidAccess ? 0 : 50; // digging adds ~$50–$95 depending on depth
    const min = Math.round(tankData.baseMin * serviceData.multiplier + diggingFee);
    const max = Math.round(tankData.baseMax * serviceData.multiplier + (hasLidAccess ? 0 : 95));

    return {
      min,
      max,
      formattedRange: `$${min} – $${max}`,
      urgency: serviceData.urgency,
      riskNote: serviceData.riskNote,
    };
  }, [tankData, serviceData, hasLidAccess]);

  // Track calculate event
  useEffect(() => {
    trackEvent('estimator_calculated', {
      tankSize: tankData.label,
      lastService: serviceData.label,
      hasLidAccess,
      calculatedRange: calculation.formattedRange,
    });
  }, [selectedTank, selectedServiceDate, hasLidAccess, calculation.formattedRange]);

  const handleApply = () => {
    if (onApplyEstimate) {
      onApplyEstimate({
        tankSize: tankData.label,
        lastService: serviceData.label,
        estimatedCost: calculation.formattedRange,
        urgencyLevel: calculation.urgency,
      });
    }

    // Smooth scroll to quote section if present
    const quoteElement = document.getElementById('quote-section') || document.querySelector('form');
    if (quoteElement) {
      quoteElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'Normal':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'On Schedule (Normal)',
        };
      case 'Recommended':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          label: 'Optimal Service Window',
        };
      case 'Urgent':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Overdue (Pumping Advised)',
        };
      case 'Critical':
      default:
        return {
          bg: 'bg-red-50 text-red-800 border-red-200',
          dot: 'bg-red-500 animate-pulse',
          label: 'High Risk of Drainfield Backup',
        };
    }
  };

  const badgeStyle = getUrgencyBadge(calculation.urgency);

  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden ${className}`}
      id="septic-cost-calculator"
      aria-label="Interactive Septic Tank Cost Estimator"
    >
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Calculator className="w-4 h-4" />
          <span>Interactive Houston Pricing Estimator</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Septic Service Ballpark Calculator
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
          Select your tank capacity and the date of your last pump-out to generate an instant, realistic price range.
        </p>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Step 1: Tank Size Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Select Approximate Tank Size</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TANK_OPTIONS.map((tank) => {
              const isSelected = selectedTank === tank.id;
              return (
                <button
                  key={tank.id}
                  type="button"
                  onClick={() => setSelectedTank(tank.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs ring-1 ring-emerald-600/30'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {tank.label}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 tabular-nums">
                      ${tank.baseMin}–${tank.baseMax}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {tank.sublabel}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Last Service Date */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. When Was Your Tank Last Pumped?</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {LAST_SERVICE_OPTIONS.map((service) => {
              const isSelected = selectedServiceDate === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedServiceDate(service.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs ring-1 ring-emerald-600/30'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {service.label}
                    </span>
                    {service.urgency === 'Critical' && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                        Overdue
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {service.sublabel}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Tank Access / Risers */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            3. Tank Lid Access
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                hasLidAccess
                  ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600/30'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="lid_access"
                checked={hasLidAccess}
                onChange={() => setHasLidAccess(true)}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Exposed Surface Risers / Uncovered Lids</span>
                <span className="text-slate-500 text-[11px]">Lids are visible at lawn surface ($0 digging cost)</span>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                !hasLidAccess
                  ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600/30'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="lid_access"
                checked={!hasLidAccess}
                onChange={() => setHasLidAccess(false)}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Buried Lids (Requires Minor Digging)</span>
                <span className="text-slate-500 text-[11px]">Covered by dirt, grass, or mulch (~$50–$95 depth fee)</span>
              </div>
            </label>
          </div>
        </div>

        {/* Output Ballpark Display Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="text-xs text-slate-400 font-medium mb-1">
                Estimated Ballpark Service Cost:
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight tabular-nums flex items-baseline gap-2">
                <span>{calculation.formattedRange}</span>
                <span className="text-xs font-normal text-slate-400">All-Inclusive</span>
              </div>
            </div>

            {/* Urgency Badge */}
            <div className="flex flex-col items-start md:items-end">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeStyle.bg}`}>
                <span className={`w-2 h-2 rounded-full ${badgeStyle.dot}`} />
                <span>{badgeStyle.label}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">
                Based on Greater Houston TCEQ fee averages
              </span>
            </div>
          </div>

          {/* Risk & Recommendation Note */}
          <div className="pt-4 pb-2 text-xs text-slate-300 leading-relaxed">
            <span className="text-emerald-400 font-semibold">Technician Note: </span>
            {calculation.riskNote}
          </div>

          {/* What is Included Checklist */}
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Full tank sludge and scum pump-out</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Certified Texas TCEQ municipal waste disposal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Visual inlet & outlet baffle inspection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Up to 100 ft of hose deployed to protect lawn</span>
            </div>
          </div>

          {/* Apply Button CTA */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400">
              *A licensed technician confirms your quote in writing before any suction starts.
            </div>

            <button
              type="button"
              onClick={handleApply}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <span>Apply Estimate to Quote Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
