import { useState } from 'react';
import { X, Calculator, Info, Check, ArrowRight } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface CostEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEstimate: (details: { size: string; estCost: string }) => void;
}

export function CostEstimatorModal({ isOpen, onClose, onSelectEstimate }: CostEstimatorModalProps) {
  const [tankSize, setTankSize] = useState<'750' | '1000' | '1500'>('1000');
  const [lidDepth, setLidDepth] = useState<'exposed' | 'shallow' | 'deep'>('exposed');
  const [needsFilterCleaning, setNeedsFilterCleaning] = useState<boolean>(true);
  const [distanceFromDriveway, setDistanceFromDriveway] = useState<'standard' | 'far'>('standard');

  if (!isOpen) return null;

  // Realistic transparent cost calculation
  let baseLow = 375;
  let baseHigh = 525;

  if (tankSize === '750') {
    baseLow = 325;
    baseHigh = 450;
  } else if (tankSize === '1000') {
    baseLow = 425;
    baseHigh = 575;
  } else if (tankSize === '1500') {
    baseLow = 525;
    baseHigh = 725;
  }

  // Digging labor add-ons
  if (lidDepth === 'shallow') {
    baseLow += 45;
    baseHigh += 75;
  } else if (lidDepth === 'deep') {
    baseLow += 85;
    baseHigh += 140;
  }

  // Filter cleaning
  if (needsFilterCleaning) {
    baseLow += 35;
    baseHigh += 60;
  }

  // Distance / extra hose run
  if (distanceFromDriveway === 'far') {
    baseLow += 40;
    baseHigh += 75;
  }

  const handleApply = () => {
    trackEvent('estimator_calculated', {
      tankSize,
      lidDepth,
      needsFilterCleaning,
      distanceFromDriveway,
      estimatedRange: `$${baseLow} – $${baseHigh}`,
    });
    onSelectEstimate({
      size: `${tankSize} Gallons`,
      estCost: `$${baseLow} – $${baseHigh}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Septic Pumping Cost Estimator</h3>
              <p className="text-xs text-slate-500">Based on standard Greater Houston contractor rates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Factors */}
        <div className="py-5 space-y-4 text-xs">
          {/* Factor 1: Tank Capacity */}
          <div>
            <label className="font-semibold text-slate-800 block mb-1.5">
              1. Septic Tank Capacity
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTankSize('750')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-colors ${
                  tankSize === '750'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                750 Gallons
                <span className="block text-[10px] text-slate-500 font-normal">1-2 Bed</span>
              </button>
              <button
                type="button"
                onClick={() => setTankSize('1000')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-colors ${
                  tankSize === '1000'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                1,000 Gallons
                <span className="block text-[10px] text-slate-500 font-normal">Standard 3-4 Bed</span>
              </button>
              <button
                type="button"
                onClick={() => setTankSize('1500')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-colors ${
                  tankSize === '1500'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                1,500 Gallons
                <span className="block text-[10px] text-slate-500 font-normal">Large / 4+ Bed</span>
              </button>
            </div>
          </div>

          {/* Factor 2: Lid Depth */}
          <div>
            <label className="font-semibold text-slate-800 block mb-1.5">
              2. Tank Lid Access Depth
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLidDepth('exposed')}
                className={`py-2 px-2 rounded-lg border text-center transition-colors ${
                  lidDepth === 'exposed'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                Surface Riser
                <span className="block text-[10px] text-slate-500 font-normal">No digging ($0)</span>
              </button>
              <button
                type="button"
                onClick={() => setLidDepth('shallow')}
                className={`py-2 px-2 rounded-lg border text-center transition-colors ${
                  lidDepth === 'shallow'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                Buried 0–12"
                <span className="block text-[10px] text-slate-500 font-normal">Light dig (+$45-$75)</span>
              </button>
              <button
                type="button"
                onClick={() => setLidDepth('deep')}
                className={`py-2 px-2 rounded-lg border text-center transition-colors ${
                  lidDepth === 'deep'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                Buried &gt;12"
                <span className="block text-[10px] text-slate-500 font-normal">Deep dig (+$85-$140)</span>
              </button>
            </div>
          </div>

          {/* Factor 3: Filter & Distance */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Effluent Filter Clean
              </label>
              <button
                type="button"
                onClick={() => setNeedsFilterCleaning(!needsFilterCleaning)}
                className={`w-full py-2 px-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                  needsFilterCleaning
                    ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <span>Include wash</span>
                {needsFilterCleaning && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Distance from Driveway
              </label>
              <button
                type="button"
                onClick={() =>
                  setDistanceFromDriveway(distanceFromDriveway === 'standard' ? 'far' : 'standard')
                }
                className={`w-full py-2 px-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                  distanceFromDriveway === 'far'
                    ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <span>{distanceFromDriveway === 'far' ? '> 100 ft (Hose run)' : 'Standard (< 75 ft)'}</span>
                {distanceFromDriveway === 'far' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Estimated Price Range Result */}
        <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 mb-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">
            Estimated Service Price Range
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
              ${baseLow} – ${baseHigh}
            </span>
            <span className="text-xs text-slate-400">total estimated range</span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-start gap-2 text-[11px] text-slate-300">
            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Includes vacuum extraction, solid agitation, and TCEQ-compliant disposal. Contractor provides final binding price on-site.
            </p>
          </div>
        </div>

        {/* Apply CTA */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Use Estimate in Quote Form</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
