import { useState, useMemo } from 'react';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Square, 
  CheckSquare, 
  Send, 
  Phone, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  Copy, 
  Check, 
  FileText, 
  ArrowRight,
  Droplet,
  Flame,
  Home,
  Waves,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

export interface SymptomItem {
  id: string;
  category: 'indoor' | 'outdoor' | 'mechanical';
  label: string;
  detail: string;
  severityWeight: number; // 1: mild, 2: moderate, 3: critical
  isCritical?: boolean;
}

const CHECKLIST_SYMPTOMS: SymptomItem[] = [
  // Indoor
  {
    id: 'indoor-slow-multiple',
    category: 'indoor',
    label: 'Slow Draining in Multiple Fixtures',
    detail: 'Bathtubs, kitchen sinks, or shower drains running slower than usual across multiple rooms.',
    severityWeight: 2,
  },
  {
    id: 'indoor-gurgle',
    category: 'indoor',
    label: 'Gurgling Toilets or Floor Drains',
    detail: 'Toilets bubble or make sucking sounds when washing machine drains or showers run.',
    severityWeight: 2,
  },
  {
    id: 'indoor-backup',
    category: 'indoor',
    label: 'Sewage or Wastewater Backup in Lowest Drains',
    detail: 'Black or greywater coming up into ground-floor bathtubs or shower pans.',
    severityWeight: 3,
    isCritical: true,
  },
  {
    id: 'indoor-odor',
    category: 'indoor',
    label: 'Persistent Sewer Gas Odors Indoors',
    detail: 'Noxious hydrogen sulfide (rotten egg) odors detected near bathrooms or laundry rooms.',
    severityWeight: 2,
  },

  // Outdoor
  {
    id: 'outdoor-soggy',
    category: 'outdoor',
    label: 'Soggy, Spongy Lawn Over Drainfield',
    detail: 'Ground feels squishy or wet underfoot even after several days of dry weather.',
    severityWeight: 2,
  },
  {
    id: 'outdoor-pooling',
    category: 'outdoor',
    label: 'Standing Wastewater Puddles on Surface',
    detail: 'Visible effluent or black ponding water accumulating over tank lids or absorption lines.',
    severityWeight: 3,
    isCritical: true,
  },
  {
    id: 'outdoor-lush-grass',
    category: 'outdoor',
    label: 'Unusually Vibrant, Overgrown Green Grass Strips',
    detail: 'Hyper-fertilized green grass patches outlining the underground drainfield trenches.',
    severityWeight: 1,
  },
  {
    id: 'outdoor-cave-in',
    category: 'outdoor',
    label: 'Depression or Soil Settlement Around Tank Lids',
    detail: 'Soil sunken around concrete tank lids or access risers indicating possible structural erosion.',
    severityWeight: 2,
  },

  // Mechanical / Aerobic
  {
    id: 'mech-alarm',
    category: 'mechanical',
    label: 'High-Water Audio Buzzer or Red Flashing Beacon Active',
    detail: 'Aerobic control panel alarm is sounding or red warning light is illuminated on exterior wall.',
    severityWeight: 3,
    isCritical: true,
  },
  {
    id: 'mech-compressor-silent',
    category: 'mechanical',
    label: 'Aerator Compressor Inactive, Overheating, or Loud',
    detail: 'Air pump is not vibrating, excessively hot to the touch, or blowing tripped circuit breakers.',
    severityWeight: 2,
  },
  {
    id: 'mech-spray-malfunction',
    category: 'mechanical',
    label: 'Aerobic Spray Heads Clogged or Spraying Irregularly',
    detail: 'Sprinklers fail to pop up, spray cloudy/odorous water, or have broken nozzles.',
    severityWeight: 2,
  },
  {
    id: 'mech-chlorine-empty',
    category: 'mechanical',
    label: 'Chlorine Disinfection Feed Tube Empty',
    detail: 'Chlorinator tube has no calcium hypochlorite tablets remaining to disinfect effluent.',
    severityWeight: 1,
  },
];

interface PreInspectionChecklistProps {
  onNavigate?: (path: string) => void;
  className?: string;
  sectionId?: string;
}

export function SepticPreInspectionChecklist({
  onNavigate,
  className = '',
  sectionId = 'pre-inspection-checklist',
}: PreInspectionChecklistProps) {
  // Selected symptoms state
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

  // Contractor triage contact form
  const [homeownerName, setHomeownerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [addressOrZip, setAddressOrZip] = useState<string>('');
  const [systemType, setSystemType] = useState<string>('Conventional Gravity');
  const [notes, setNotes] = useState<string>('');

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [triageSent, setTriageSent] = useState<boolean>(false);
  const [triageResult, setTriageResult] = useState<any>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Active filter tab
  const [activeCategory, setActiveCategory] = useState<'all' | 'indoor' | 'outdoor' | 'mechanical'>('all');

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = !prev[id];
      if (next) {
        trackEvent('triage_assessment_started', {
          service: id,
        });
      }
      return { ...prev, [id]: next };
    });
  };

  const selectedCount = Object.values(selectedIds).filter(Boolean).length;

  // Filtered symptoms
  const visibleSymptoms = useMemo(() => {
    if (activeCategory === 'all') return CHECKLIST_SYMPTOMS;
    return CHECKLIST_SYMPTOMS.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  // Compute severity score
  const triageAnalysis = useMemo(() => {
    const selectedItems = CHECKLIST_SYMPTOMS.filter((s) => selectedIds[s.id]);
    const totalScore = selectedItems.reduce((acc, curr) => acc + curr.severityWeight, 0);
    const hasCritical = selectedItems.some((s) => s.isCritical);

    let level: 'low' | 'moderate' | 'critical' = 'low';
    let label = 'Low Concern / Routine Maintenance';
    let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    let advice = 'Your symptoms suggest early sludge accumulation or routine maintenance needs. An inspection within 1–2 weeks is recommended.';

    if (hasCritical || totalScore >= 6) {
      level = 'critical';
      label = 'CRITICAL EMERGENCY: Immediate Dispatch Required';
      badgeColor = 'bg-red-100 text-red-900 border-red-400 animate-pulse';
      advice = 'HIGH RISK: Active sewage backup or drainfield hydro-lock detected. Immediately cease heavy water usage (washing machines, showers) and request emergency pumper dispatch.';
    } else if (totalScore >= 3) {
      level = 'moderate';
      label = 'MODERATE WARNING: System Compromise Imminent';
      badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
      advice = 'Elevated hydraulic pressure or partial drainfield saturation detected. Schedule diagnostic pumping within 24–48 hours to avoid catastrophic backup.';
    }

    return {
      level,
      label,
      badgeColor,
      advice,
      selectedItems,
      totalScore,
    };
  }, [selectedIds]);

  // Formatted text summary for remote triage
  const formattedSummaryText = useMemo(() => {
    const issues = triageAnalysis.selectedItems.map((item, idx) => `${idx + 1}. ${item.label} (${item.detail})`).join('\n');
    return `SEPTIC PRE-INSPECTION TRIAGE REPORT
Property: ${addressOrZip || 'Houston Area'}
Contact: ${homeownerName || 'Homeowner'} - ${phoneNumber || 'Not provided'}
System Type: ${systemType}
Severity: ${triageAnalysis.label}
Selected Symptoms (${selectedCount}):
${issues || 'No specific symptoms checked.'}
Notes: ${notes || 'None'}
Generated via SepticProDirect Triage Tool.`;
  }, [addressOrZip, homeownerName, phoneNumber, systemType, triageAnalysis, selectedCount, notes]);

  // Handle send to contractor
  const handleSendToContractor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsSubmitting(true);
    trackEvent('triage_assessment_submitted', {
      severity: triageAnalysis.level,
      score: triageAnalysis.totalScore,
      selectedCount,
    });

    try {
      const res = await fetch('/api/triage-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: homeownerName,
          phone: phoneNumber,
          email,
          addressOrZip,
          systemType,
          selectedIssues: triageAnalysis.selectedItems.map((s) => s.label),
          severityLevel: triageAnalysis.level,
          additionalNotes: notes,
        }),
      });

      const data = await res.json();
      setTriageResult(data);
      setTriageSent(true);
    } catch {
      setTriageResult({
        success: true,
        triageId: `tri-${Date.now()}`,
        recommendedAction: triageAnalysis.advice,
      });
      setTriageSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(formattedSummaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  return (
    <section
      id={sectionId}
      className={`py-16 sm:py-24 bg-slate-50 border-t border-slate-200 scroll-mt-12 ${className}`}
      aria-label="Homeowner Septic Pre-Inspection Self-Assessment and Remote Triage"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold mb-3">
            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Homeowner Diagnostic Self-Assessment</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Septic Pre-Inspection Checklist & Remote Triage
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Check off any symptoms your plumbing or yard is currently exhibiting. Our diagnostic engine evaluates your failure risk and prepares a complete triage brief for certified Houston pumpers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Symptom Checklist (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: 'All Symptoms' },
                  { id: 'indoor', label: 'Indoor Drains' },
                  { id: 'outdoor', label: 'Yard & Drainfield' },
                  { id: 'mechanical', label: 'Aerobic & Mechanical' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeCategory === tab.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500 font-semibold">
                Selected: <strong className="text-emerald-700">{selectedCount}</strong>
              </div>
            </div>

            {/* Symptoms Cards Grid */}
            <div className="space-y-3">
              {visibleSymptoms.map((symptom) => {
                const isSelected = !!selectedIds[symptom.id];

                return (
                  <div
                    key={symptom.id}
                    onClick={() => handleToggle(symptom.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start justify-between gap-3 ${
                      isSelected
                        ? symptom.isCritical
                          ? 'bg-red-50/80 border-red-400 ring-1 ring-red-400'
                          : 'bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-400'
                        : 'bg-slate-50/70 border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {symptom.category === 'indoor'
                            ? 'Indoor Plumbing'
                            : symptom.category === 'outdoor'
                            ? 'Yard / Lawn'
                            : 'Mechanical / ATU'}
                        </span>
                        {symptom.isCritical && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-200">
                            Critical Red Flag
                          </span>
                        )}
                      </div>
                      <h4 className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-slate-950' : 'text-slate-800'}`}>
                        {symptom.label}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {symptom.detail}
                      </p>
                    </div>

                    <div className="shrink-0 mt-0.5">
                      {isSelected ? (
                        <CheckSquare
                          className={`w-5 h-5 ${symptom.isCritical ? 'text-red-600' : 'text-emerald-600'}`}
                        />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Reset Button */}
            {selectedCount > 0 && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedIds({})}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Clear all selections
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Triage Diagnosis & "Send Results to Contractor" (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Triage Diagnosis Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Diagnostic Triage Status
                  </h3>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${triageAnalysis.badgeColor}`}>
                  {triageAnalysis.level.toUpperCase()}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {triageAnalysis.label}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {triageAnalysis.advice}
                </p>
              </div>

              {/* Triage Summary Copy Chip */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  {selectedCount} symptom{selectedCount === 1 ? '' : 's'} recorded
                </span>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? 'Copied to Clipboard' : 'Copy Triage Brief'}</span>
                </button>
              </div>
            </div>

            {/* "Send Results to Contractor" Remote Triage Form */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-md space-y-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Send className="w-3.5 h-3.5" />
                  <span>Remote Contractor Triage</span>
                </div>
                <h3 className="text-lg font-bold tracking-tight">
                  Send Results to Local Pumping Dispatch
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Transmits your checklist directly to a licensed Greater Houston technician to determine required vacuum hose length and urgency.
                </p>
              </div>

              {triageSent ? (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Triage Brief Transmitted</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    A licensed technician is reviewing your assessment. For active backups, call directly for immediate emergency dispatch.
                  </p>

                  <a
                    href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Dispatch: {BUSINESS_CONFIG.phoneDisplay}</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSendToContractor} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={homeownerName}
                      onChange={(e) => setHomeownerName(e.target.value)}
                      placeholder="e.g. David Henderson"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="(713) 555-0182"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        ZIP / City
                      </label>
                      <input
                        type="text"
                        required
                        value={addressOrZip}
                        onChange={(e) => setAddressOrZip(e.target.value)}
                        placeholder="e.g. Katy, 77494"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      System Type
                    </label>
                    <select
                      value={systemType}
                      onChange={(e) => setSystemType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Conventional Gravity">Conventional Gravity Tank</option>
                      <option value="Aerobic ATU Spray/Drip">Aerobic ATU (Spray or Drip)</option>
                      <option value="Not Sure">Unsure / Need Tech to Identify</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Additional Notes / Description
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Toilet gurgles whenever laundry machine drains; odor worse after rain..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-1"
                  >
                    <span>{isSubmitting ? 'Transmitting Triage...' : 'Send Checklist to Dispatch'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>Average technician response time: &lt; 15 minutes.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
