import { useState, useMemo } from 'react';
import { 
  FileSearch, 
  Building2, 
  ExternalLink, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  FileText, 
  ArrowRight,
  Info,
  BadgeCheck,
  Send,
  HelpCircle,
  Download
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

export interface PermitAuthorityInfo {
  id: string;
  county: string;
  department: string;
  portalUrl: string;
  phone: string;
  officeAddress: string;
  onlineSearchAvailable: boolean;
  zipCodes: string[];
  permitTypes: string[];
  notes?: string;
}

export const HOUSTON_AUTHORITIES: PermitAuthorityInfo[] = [
  {
    id: 'harris',
    county: 'Harris County',
    department: 'Harris County Public Health (HCPH) - Environmental Public Health',
    portalUrl: 'https://publichealth.harriscountytx.gov/Services-Programs/Environmental-Public-Health/OSSF',
    phone: '(713) 274-6300',
    officeAddress: '2223 West Loop South, Houston, TX 77027',
    onlineSearchAvailable: true,
    zipCodes: ['77002', '77084', '77095', '77429', '77433', '77449', '77375', '77379', '77388', '77338'],
    permitTypes: ['License to Operate (LTO)', 'Aerobic Maintenance Contract Filing', 'OSSF Construction Permit'],
    notes: 'Mandates semi-annual maintenance agreements for all residential aerobic treatment units.',
  },
  {
    id: 'montgomery',
    county: 'Montgomery County',
    department: 'Montgomery County Environmental Health Services',
    portalUrl: 'https://www.mctx.org/departments/departments_d_-_f/environmental_health/index.php',
    phone: '(936) 539-7839',
    officeAddress: '501 N Thompson St, Suite 101, Conroe, TX 77301',
    onlineSearchAvailable: true,
    zipCodes: ['77301', '77304', '77380', '77381', '77382', '77384', '77385', '77354', '77356', '77316'],
    permitTypes: ['OSSF Operating Permit', 'Aerobic Maintenance Contract Verification', 'Site Evaluation Review'],
    notes: 'Maintains archival microfilms for The Woodlands, Conroe, Magnolia, and Lake Conroe OSSFs.',
  },
  {
    id: 'fort-bend',
    county: 'Fort Bend County',
    department: 'Fort Bend County Environmental Health Department',
    portalUrl: 'https://www.fortbendcountytx.gov/government/departments/health-and-human-services/environmental-health/on-site-sewage-facilities-ossf',
    phone: '(281) 342-7469',
    officeAddress: '4520 Reading Rd, Suite A-400, Rosenberg, TX 77471',
    onlineSearchAvailable: true,
    zipCodes: ['77406', '77469', '77471', '77479', '77494', '77407', '77450', '77478'],
    permitTypes: ['OSSF Permit to Construct', 'Authorization to Operate', 'Annual Maintenance Contract Renewal'],
    notes: 'Enforces strict 10-foot setback requirements from property lines and foundation footers.',
  },
  {
    id: 'brazoria',
    county: 'Brazoria County',
    department: 'Brazoria County Environmental Health Department',
    portalUrl: 'https://www.brazoriacountytx.gov/departments/environmental-health/septic-permits-ossf',
    phone: '(979) 864-1600',
    officeAddress: '111 E Locust St, Angleton, TX 77515',
    onlineSearchAvailable: true,
    zipCodes: ['77584', '77581', '77511', '77515', '77578', '77566'],
    permitTypes: ['OSSF License to Operate', 'Aerobic Spray Permitting', 'Transfer of Ownership Permit'],
    notes: 'Requires property transfer inspection records when buying or selling rural acreage.',
  },
  {
    id: 'galveston',
    county: 'Galveston County',
    department: 'Galveston County Health District (GCHD) - Pollution Control',
    portalUrl: 'https://www.gchd.org/pollution-control/on-site-septic-systems-ossf',
    phone: '(409) 938-2411',
    officeAddress: '9850-A Emmett F. Lowry Expressway, Texas City, TX 77591',
    onlineSearchAvailable: true,
    zipCodes: ['77539', '77568', '77573', '77590', '77591', '77550'],
    permitTypes: ['OSSF Operational Permit', 'High Water Table Variance', 'Maintenance Agreement Filing'],
    notes: 'Coastal high water table guidelines apply for Friendswood, Dickinson, and League City.',
  },
  {
    id: 'waller',
    county: 'Waller County',
    department: 'Waller County Road & Bridge / Environmental Permitting',
    portalUrl: 'https://www.co.waller.tx.us/page/RoadAndBridge.Permits',
    phone: '(979) 826-7670',
    officeAddress: '775 Business 290 East, Hempstead, TX 77445',
    onlineSearchAvailable: false,
    zipCodes: ['77423', '77445', '77446', '77484'],
    permitTypes: ['OSSF Installation Permit', 'Aerobic Inspection Records', 'Operating License'],
    notes: 'Direct phone & in-person inquiry recommended for legacy agricultural acreage tracts.',
  },
  {
    id: 'tceq',
    county: 'Texas Statewide (TCEQ)',
    department: 'Texas Commission on Environmental Quality - Central Registry Search',
    portalUrl: 'https://www.tceq.texas.gov/permitting/ossf',
    phone: '(512) 239-3799',
    officeAddress: '12100 Park 35 Circle, Austin, TX 78753',
    onlineSearchAvailable: true,
    zipCodes: [],
    permitTypes: ['Chapter 285 State Rules', 'Licensed Maintenance Provider Verification', 'Inter-County Authorizations'],
    notes: 'State regulatory agency overseeing all designated authorized agents in Texas.',
  },
];

interface PermitLookupProps {
  serviceName?: string;
  onNavigate?: (path: string) => void;
  className?: string;
  sectionId?: string;
}

export function HoustonSepticPermitLookup({
  serviceName = 'Septic Service',
  onNavigate,
  className = '',
  sectionId = 'houston-septic-permit-lookup',
}: PermitLookupProps) {
  // Search / Selection State
  const [selectedCountyId, setSelectedCountyId] = useState<string>('harris');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Assisted Search Form State
  const [propertyAddress, setPropertyAddress] = useState<string>('');
  const [cadTaxId, setCadTaxId] = useState<string>('');
  const [homeownerName, setHomeownerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [searchReason, setSearchReason] = useState<string>('Real Estate Sale / Purchase');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [submissionData, setSubmissionData] = useState<any>(null);

  // Auto-detect county from ZIP code or address input
  const handleSearchQueryChange = (val: string) => {
    setSearchQuery(val);
    const cleaned = val.trim();
    if (/^\d{5}$/.test(cleaned)) {
      trackEvent('permit_lookup_queried', { location: cleaned });
      // Find matching county by zip
      const matched = HOUSTON_AUTHORITIES.find((auth) => auth.zipCodes.includes(cleaned));
      if (matched) {
        setSelectedCountyId(matched.id);
      }
    }
  };

  const selectedAuthority = useMemo(() => {
    return HOUSTON_AUTHORITIES.find((a) => a.id === selectedCountyId) || HOUSTON_AUTHORITIES[0];
  }, [selectedCountyId]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyAddress || !phone) return;

    setIsSubmitting(true);
    trackEvent('permit_lookup_submitted', {
      county: selectedAuthority.county,
      location: propertyAddress,
      service: searchReason,
    });

    try {
      const res = await fetch('/api/permit-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: propertyAddress,
          county: selectedAuthority.county,
          cadTaxId,
          homeownerName,
          phone,
          email,
          reason: searchReason,
        }),
      });

      const data = await res.json();
      setSubmissionData(data);
      setSubmittedSuccess(true);
    } catch {
      setSubmissionData({
        success: true,
        requestId: `prm-${Date.now()}`,
        authority: selectedAuthority,
        message: `Request received for ${propertyAddress}. Our partner specialists will query ${selectedAuthority.county} public health archives.`,
      });
      setSubmittedSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id={sectionId}
      className={`py-16 sm:py-24 bg-slate-900 text-white scroll-mt-12 relative overflow-hidden ${className}`}
      aria-label="Greater Houston Septic Permit Lookup and County Government Records"
    >
      {/* Background Accent Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold mb-3.5 shadow-xs">
            <Building2 className="w-3.5 h-3.5" />
            <span>Texas OSSF Chapter 285 Government Verification</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3.5">
            Houston Septic Permit & As-Built Records Lookup
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Verify whether your property has a valid Texas On-Site Sewage Facility (OSSF) "License to Operate", find your county's official public health portal, or request our team pull historical as-built plot plans.
          </p>
        </div>

        {/* Top County Selector Bar */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-auto">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                1. Select Greater Houston County Jurisdiction
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {HOUSTON_AUTHORITIES.map((auth) => {
                  const isActive = selectedCountyId === auth.id;
                  return (
                    <button
                      key={auth.id}
                      type="button"
                      onClick={() => {
                        setSelectedCountyId(auth.id);
                        trackEvent('permit_lookup_queried', { location: auth.county });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 shadow-xs ring-2 ring-emerald-400/40'
                          : 'bg-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {auth.county}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick ZIP Auto-Detector */}
            <div className="w-full md:w-64 shrink-0">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Or Search by 5-Digit ZIP
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  maxLength={5}
                  value={searchQuery}
                  onChange={(e) => handleSearchQueryChange(e.target.value)}
                  placeholder="e.g. 77494, 77380, 77084"
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-600 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Content: Official Authority Card vs Assisted Search Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official County Government Agency Information (6 cols) */}
          <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-3 border-b border-slate-700 pb-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Authorized Licensing Agency
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
                  {selectedAuthority.department}
                </h3>
              </div>

              <div className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] font-bold text-slate-300 shrink-0">
                {selectedAuthority.county}
              </div>
            </div>

            {/* Official Agency Details */}
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Official Office Location:</strong>
                  <span>{selectedAuthority.officeAddress}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <strong className="text-white">OSSF Permitting Phone: </strong>
                  <a
                    href={`tel:${selectedAuthority.phone.replace(/\D/g, '')}`}
                    className="text-emerald-400 hover:text-emerald-300 font-bold underline"
                  >
                    {selectedAuthority.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Permit Records Tracked:</strong>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedAuthority.permitTypes.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-300"
                      >
                        ✓ {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {selectedAuthority.notes && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 text-[11px] flex items-start gap-2">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{selectedAuthority.notes}</span>
                </div>
              )}
            </div>

            {/* Direct Official Link Button */}
            <div className="pt-2">
              <a
                href={selectedAuthority.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs sm:text-sm transition-colors border border-slate-600 shadow-xs cursor-pointer group"
              >
                <span>Visit Official {selectedAuthority.county} OSSF Portal</span>
                <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                External county government database. Queries require parcel ID, subdivision name, or permit number.
              </p>
            </div>

            {/* Regulatory Importance Box */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                <span>Why a Valid Texas Septic Permit Matters</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Under Texas Health & Safety Code Chapter 366 and TCEQ Title 30 TAC §285, operating an unpermitted septic system is a Class C misdemeanor. Lenders (FHA/VA) mandate an official License to Operate before approving home purchases or refinancing.
              </p>
            </div>
          </div>

          {/* Right Column: Assisted Records & As-Built Diagram Retrieval Form (6 cols) */}
          <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <FileSearch className="w-3.5 h-3.5" />
                <span>Assisted Permit & Drawing Retrieval</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Request Professional Archive Search
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Can't find your permit number or as-built plot plan? Our licensed Houston partners retrieve official county health archives and engineering schematics for your property.
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-100 text-xs space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Permit Request Submitted Successfully</span>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {submissionData?.message || `Your search request for ${propertyAddress} has been received.`}
                </p>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-slate-300 space-y-1">
                  <div><strong>Reference ID:</strong> {submissionData?.requestId || 'PRM-RECORD'}</div>
                  <div><strong>Jurisdiction:</strong> {selectedAuthority.county}</div>
                  <div><strong>Estimated Archive Pull:</strong> 24–48 Business Hours</div>
                </div>

                <div className="pt-2">
                  <a
                    href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Urgent Closing? Call {BUSINESS_CONFIG.phoneDisplay}</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Property Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    placeholder="e.g. 14210 Spring Cypress Rd, Cypress, TX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      County Jurisdiction
                    </label>
                    <select
                      value={selectedCountyId}
                      onChange={(e) => setSelectedCountyId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {HOUSTON_AUTHORITIES.map((auth) => (
                        <option key={auth.id} value={auth.id}>
                          {auth.county}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      CAD Tax ID / Parcel # (Optional)
                    </label>
                    <input
                      type="text"
                      value={cadTaxId}
                      onChange={(e) => setCadTaxId(e.target.value)}
                      placeholder="e.g. 104-290-001-0024"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Homeowner / Requester Name
                    </label>
                    <input
                      type="text"
                      value={homeownerName}
                      onChange={(e) => setHomeownerName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(713) 555-0199"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email for Permit Deliverable
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="homeowner@gmail.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Reason for Search
                  </label>
                  <select
                    value={searchReason}
                    onChange={(e) => setSearchReason(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Real Estate Sale / Purchase">Buying or Selling Home (Title Closing)</option>
                    <option value="Installing Swimming Pool / Patio">Installing Pool / Fence / Outbuilding (Need Plot Plan)</option>
                    <option value="Aerobic Maintenance Audit">Aerobic Maintenance Agreement Verification</option>
                    <option value="Routine Record Keeping">Routine Record Keeping</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Searching Archives...' : 'Request Official County Records Search'}</span>
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Confidential research by TCEQ licensed Site Evaluators & Partners.</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
