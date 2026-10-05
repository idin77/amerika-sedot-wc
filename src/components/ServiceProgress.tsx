import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  UserCheck, 
  FileCheck2, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Sparkles,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Calendar
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

export type ServiceStageId = 
  | 'request_received'
  | 'contractor_assigned'
  | 'technician_dispatched'
  | 'service_completed';

export interface ServiceStage {
  id: ServiceStageId;
  order: number;
  label: string;
  shortDescription: string;
  fullDetails: string;
  homeownerTip: string;
  estimatedTime: string;
  statusBadge: string;
  icon: any;
}

const SERVICE_STAGES: ServiceStage[] = [
  {
    id: 'request_received',
    order: 1,
    label: 'Request Received',
    shortDescription: 'Inquiry logged into Houston dispatch queue',
    fullDetails: 'Your property specs, estimated tank capacity, and service needs are logged. Automated validation checks local OSSF contractor route availability.',
    homeownerTip: 'Keep your phone accessible. Dispatch typically matches a technician within 15–30 minutes during business hours.',
    estimatedTime: 'Instant (0–15 mins)',
    statusBadge: 'Verified & Logged',
    icon: CheckCircle2,
  },
  {
    id: 'contractor_assigned',
    order: 2,
    label: 'Contractor Assigned',
    shortDescription: 'Matched with licensed TCEQ local partner',
    fullDetails: 'A verified, insured septic contractor based in your county (Harris, Fort Bend, Montgomery, etc.) is assigned. They confirm equipment needs and review property access.',
    homeownerTip: 'The contractor will contact you with upfront flat pricing and confirm scheduled arrival time.',
    estimatedTime: '15–45 minutes',
    statusBadge: 'Partner Matched',
    icon: UserCheck,
  },
  {
    id: 'technician_dispatched',
    order: 3,
    label: 'En Route / On-Site',
    shortDescription: 'Vacuum truck arriving with suction equipment',
    fullDetails: 'The crew arrives in a commercial vacuum tanker with high-CFM suction lines, Sludge Judge measuring tubes, and hydro-pressure washing wands.',
    homeownerTip: 'Please keep personal cars out of the driveway to allow the heavy vacuum truck clear access within 75 feet of your tank riser.',
    estimatedTime: 'Scheduled Appointment',
    statusBadge: 'Field Crew Active',
    icon: Truck,
  },
  {
    id: 'service_completed',
    order: 4,
    label: 'Service Completed',
    shortDescription: 'Tank evacuated & TCEQ manifest issued',
    fullDetails: 'Both tank chambers evacuated of bottom sludge and surface scum. Effluent filter backwashed, sanitary tees inspected, lids re-sealed, and official disposal manifest signed.',
    homeownerTip: 'File your signed disposal receipt in your home record binder for Texas OSSF compliance during home resale.',
    estimatedTime: 'Service Complete',
    statusBadge: 'Certified & Signed',
    icon: FileCheck2,
  },
];

interface ServiceProgressProps {
  initialStage?: ServiceStageId;
  leadId?: string;
  serviceType?: string;
  zipCode?: string;
  homeownerName?: string;
  className?: string;
  onReset?: () => void;
  showLookupCard?: boolean;
}

export function ServiceProgress({
  initialStage = 'contractor_assigned',
  leadId = 'SPD-HOU-482910',
  serviceType = 'Residential Septic Tank Pumping',
  zipCode = '77494',
  homeownerName = 'Valued Homeowner',
  className = '',
  onReset,
  showLookupCard = false,
}: ServiceProgressProps) {
  const [currentStageId, setCurrentStageId] = useState<ServiceStageId>(initialStage);
  const [selectedStageDetail, setSelectedStageDetail] = useState<ServiceStageId>(initialStage);
  const [activeLeadId, setActiveLeadId] = useState<string>(leadId);
  const [lookupInput, setLookupInput] = useState<string>('');
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);

  // Auto-progress simulation for demo transparency
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const currentStageIndex = SERVICE_STAGES.findIndex((s) => s.id === currentStageId);
  const progressPercentage = Math.round(((currentStageIndex + 1) / SERVICE_STAGES.length) * 100);

  // Sync state if initialStage or leadId props change
  useEffect(() => {
    setCurrentStageId(initialStage);
    setSelectedStageDetail(initialStage);
    setActiveLeadId(leadId);
  }, [initialStage, leadId]);

  const handleSimulateNextStage = () => {
    setIsSimulating(true);
    const nextIdx = (currentStageIndex + 1) % SERVICE_STAGES.length;
    const nextStage = SERVICE_STAGES[nextIdx].id;
    setCurrentStageId(nextStage);
    setSelectedStageDetail(nextStage);
    trackEvent('service_viewed', {
      source: 'service_progress_simulation',
      location: nextStage,
    });
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupInput.trim()) return;

    const cleanInput = lookupInput.trim().toUpperCase();
    setActiveLeadId(cleanInput.startsWith('SPD-') ? cleanInput : `SPD-HOU-${cleanInput}`);
    setCurrentStageId('contractor_assigned');
    setSelectedStageDetail('contractor_assigned');
    setLookupMessage(`Tracking status updated for reference ID ${cleanInput}`);
    trackEvent('service_viewed', {
      source: 'progress_lookup',
      leadId: cleanInput,
    });
  };

  const selectedStage = SERVICE_STAGES.find((s) => s.id === selectedStageDetail) || SERVICE_STAGES[0];

  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-left ${className}`}
      id="service-progress-tracker"
      aria-label="Service Project Progress Tracker"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Project Transparency</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Septic Service Status Tracker
          </h3>
          <p className="text-xs text-slate-500">
            Real-time milestone visibility from quote intake to final TCEQ waste manifest disposal.
          </p>
        </div>

        {/* Lead Reference Badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs shrink-0 self-start sm:self-auto space-y-0.5">
          <div className="text-[10px] uppercase font-bold text-slate-400">Order Reference #</div>
          <div className="font-mono font-bold text-slate-900 text-sm tracking-wide">{activeLeadId}</div>
          <div className="text-[11px] text-emerald-700 font-semibold">{zipCode ? `ZIP ${zipCode} Service Area` : 'Houston Metro'}</div>
        </div>
      </div>

      {/* Progress Bar & Stage Indicator */}
      <div className="py-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
          <span>Overall Project Progress</span>
          <span className="font-bold text-emerald-700">{progressPercentage}% Complete</span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Stepper Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {SERVICE_STAGES.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isPending = index > currentStageIndex;
            const isDetailActive = selectedStageDetail === stage.id;
            const Icon = stage.icon;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStageDetail(stage.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isDetailActive
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs'
                    : isCurrent
                    ? 'border-emerald-300 bg-white hover:bg-slate-50'
                    : isCompleted
                    ? 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/60'
                    : 'border-slate-200 bg-white opacity-60 hover:opacity-100'
                }`}
              >
                {/* Top Badge: Order & State */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-600'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stage.order}
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isCurrent
                        ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {isCompleted ? 'Done' : isCurrent ? 'Active Now' : 'Upcoming'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span>{stage.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {stage.shortDescription}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Drawer / Focus Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h4 className="text-sm font-bold text-slate-900">
              Stage {selectedStage.order}: {selectedStage.label}
            </h4>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Est. Window: {selectedStage.estimatedTime}</span>
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {selectedStage.fullDetails}
        </p>

        {/* Homeowner Action Tip */}
        <div className="bg-white border border-emerald-200/80 rounded-lg p-3.5 text-xs flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900">What to do at this stage: </span>
            <span className="text-slate-600">{selectedStage.homeownerTip}</span>
          </div>
        </div>

        {/* Actions / Dispatch Helper */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Questions regarding this step? Contact local contractor dispatch desk.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSimulateNextStage}
              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              title="Simulate advance to next milestone"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Advance Stage</span>
            </button>

            <a
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>Call Dispatch</span>
            </a>
          </div>
        </div>
      </div>

      {/* Optional Lookup Form for returning homeowners */}
      {showLookupCard && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-auto sm:flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={lookupInput}
                onChange={(e) => setLookupInput(e.target.value)}
                placeholder="Enter Reference # (e.g. SPD-HOU-123456)"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Track Request
            </button>
          </form>

          {lookupMessage && (
            <p className="text-xs text-emerald-700 font-semibold mt-2">{lookupMessage}</p>
          )}
        </div>
      )}

      {onReset && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium underline cursor-pointer"
          >
            Submit Another Quote Request
          </button>
        </div>
      )}
    </div>
  );
}
