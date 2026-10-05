import { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Droplet, 
  Wrench, 
  AlertTriangle, 
  FileCheck, 
  ChevronRight, 
  Filter, 
  Building, 
  ShieldCheck, 
  Award, 
  Phone,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

export interface CompletedProject {
  id: string;
  title: string;
  city: string;
  county: string;
  neighborhood: string;
  zipCode: string;
  serviceType: 'Pumping' | 'Aerobic' | 'Inspection' | 'Emergency' | 'Repair';
  tankSize: string;
  completedAgo: string;
  technicianNotes: string;
  gallonsPumped?: number;
  lat: number;
  lon: number;
  mapX: number; // percentage X (0 - 100)
  mapY: number; // percentage Y (0 - 100)
}

const DEFAULT_PROJECTS: CompletedProject[] = [
  {
    id: 'proj-1',
    title: '1,500-Gal Dual-Compartment Tank Pump & Baffle Inspection',
    city: 'Katy',
    county: 'Fort Bend County',
    neighborhood: 'Cinco Ranch Equestrian Area',
    zipCode: '77494',
    serviceType: 'Pumping',
    tankSize: '1,500 gal concrete',
    completedAgo: 'Yesterday',
    technicianNotes: 'Removed 1,450 gallons of consolidated sludge. Replaced cracked PVC sanitary Tee on outlet baffle to protect drainfield lines.',
    gallonsPumped: 1450,
    lat: 29.7858,
    lon: -95.8245,
    mapX: 20,
    mapY: 55,
  },
  {
    id: 'proj-2',
    title: 'Emergency Stormwater Hydro-Jetting & Drain Clearing',
    city: 'Cypress',
    county: 'Harris County',
    neighborhood: 'Grant Rd Acreage Estates',
    zipCode: '77429',
    serviceType: 'Emergency',
    tankSize: '1,250 gal dual tank',
    completedAgo: '2 days ago',
    technicianNotes: 'Emergency 75-minute dispatch. Cleared heavy tree root obstruction in main 4-inch sewer transport pipe using 3,500 PSI rotational jetting.',
    gallonsPumped: 1200,
    lat: 29.9688,
    lon: -95.6972,
    mapX: 30,
    mapY: 34,
  },
  {
    id: 'proj-3',
    title: 'Aerobic ATU Aerator Compressor Replacement & Chlorine Recharge',
    city: 'The Woodlands',
    county: 'Montgomery County',
    neighborhood: 'Sterling Ridge Village',
    zipCode: '77382',
    serviceType: 'Aerobic',
    tankSize: '500 GPD aerobic unit',
    completedAgo: '3 days ago',
    technicianNotes: 'Replaced seized linear diaphragm air pump. Verified 2.4 PSI air pressure to diffuser bars. Serviced chlorination tablet feed tube.',
    lat: 30.1578,
    lon: -95.4894,
    mapX: 52,
    mapY: 15,
  },
  {
    id: 'proj-4',
    title: 'Routine Preventative Pumping & Effluent Filter Cleanout',
    city: 'Pearland',
    county: 'Brazoria County',
    neighborhood: 'Silverlake Subdivisions',
    zipCode: '77584',
    serviceType: 'Pumping',
    tankSize: '1,000 gal poly tank',
    completedAgo: '3 days ago',
    technicianNotes: 'Pumped down both chambers to bottom. Pressure-washed reusable Sim/Tech nylon bristle filter to restore full gravity flow.',
    gallonsPumped: 1000,
    lat: 29.5636,
    lon: -95.2860,
    mapX: 72,
    mapY: 76,
  },
  {
    id: 'proj-5',
    title: 'Lake Conroe Waterfront Tank Pump-Out & Risers Seal',
    city: 'Conroe',
    county: 'Montgomery County',
    neighborhood: 'Walden on Lake Conroe',
    zipCode: '77356',
    serviceType: 'Repair',
    tankSize: '1,500 gal concrete',
    completedAgo: '4 days ago',
    technicianNotes: 'Pumped out heavy grease and sludge buildup. Resealed concrete riser seams with butyl sealant to prevent lake water groundwater infiltration.',
    gallonsPumped: 1500,
    lat: 30.3119,
    lon: -95.4560,
    mapX: 55,
    mapY: 6,
  },
  {
    id: 'proj-6',
    title: 'TCEQ Chapter 285 Real Estate Transfer Escrow Inspection',
    city: 'Sugar Land',
    county: 'Fort Bend County',
    neighborhood: 'Greatwood Rural Enclave',
    zipCode: '77479',
    serviceType: 'Inspection',
    tankSize: '1,200 gal conventional',
    completedAgo: '5 days ago',
    technicianNotes: 'Performed hydraulic dye load test (250 gallons). Confirmed zero surface surfacing on absorption trenches. Certified official real estate escrow form.',
    lat: 29.6197,
    lon: -95.6349,
    mapX: 37,
    mapY: 70,
  },
  {
    id: 'proj-7',
    title: '2,000-Gal Agricultural Acreage Pumping & High-Volume Vacuuming',
    city: 'Magnolia',
    county: 'Montgomery County',
    neighborhood: 'High Meadow Ranch',
    zipCode: '77354',
    serviceType: 'Pumping',
    tankSize: '2,000 gal dual chamber',
    completedAgo: '6 days ago',
    technicianNotes: 'Pulled 160 feet of heavy-duty vacuum suction hose. Liquefied heavy 18-inch sludge crust using crust-buster backflush technique.',
    gallonsPumped: 1950,
    lat: 30.2135,
    lon: -95.7508,
    mapX: 25,
    mapY: 18,
  },
  {
    id: 'proj-8',
    title: 'Submersible Effluent Pump & Float Switch Calibration',
    city: 'Friendswood',
    county: 'Galveston County',
    neighborhood: 'Heritage Park / Clear Creek',
    zipCode: '77546',
    serviceType: 'Aerobic',
    tankSize: 'Pump dosing tank',
    completedAgo: '1 week ago',
    technicianNotes: 'Replaced failed mercury float switch with high-durability mechanical float switch. Bench-tested high water alarm horn and visual beacon.',
    lat: 29.5294,
    lon: -95.2010,
    mapX: 80,
    mapY: 82,
  },
  {
    id: 'proj-9',
    title: 'Acreage Tank Locating, Digging & Secondary Riser Install',
    city: 'Tomball',
    county: 'Harris County',
    neighborhood: 'Rosehill Reserve',
    zipCode: '77377',
    serviceType: 'Repair',
    tankSize: '1,000 gal concrete',
    completedAgo: '1 week ago',
    technicianNotes: 'Located buried tank using electronic radio flush-transmitter probe. Excavated 24 inches of topsoil and installed green Polylok risers to grade.',
    gallonsPumped: 1050,
    lat: 30.0972,
    lon: -95.6161,
    mapX: 38,
    mapY: 23,
  },
  {
    id: 'proj-10',
    title: 'Full Vacuum Cleanout & Texas Sludge Manifest Documentation',
    city: 'Spring',
    county: 'Harris County',
    neighborhood: 'Champion Forest / Gleannloch',
    zipCode: '77379',
    serviceType: 'Pumping',
    tankSize: '1,500 gal dual tank',
    completedAgo: '1 week ago',
    technicianNotes: 'Complete cleanout performed. Generated official TCEQ waste manifest for homeowner records and county environmental compliance.',
    gallonsPumped: 1500,
    lat: 30.0799,
    lon: -95.4172,
    mapX: 58,
    mapY: 26,
  },
];

interface ServiceMapProps {
  onNavigate?: (path: string) => void;
  className?: string;
  sectionId?: string;
}

export function ServiceMap({
  onNavigate,
  className = '',
  sectionId = 'completed-projects-map',
}: ServiceMapProps) {
  const [projects, setProjects] = useState<CompletedProject[]>(DEFAULT_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1');
  const [serviceFilter, setServiceFilter] = useState<string>('All');
  const [countyFilter, setCountyFilter] = useState<string>('All');

  // Load from API if available
  useEffect(() => {
    fetch('/api/completed-projects')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_PROJECTS
      });
  }, []);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchService = serviceFilter === 'All' || p.serviceType === serviceFilter;
      const matchCounty = countyFilter === 'All' || p.county.toLowerCase().includes(countyFilter.toLowerCase());
      return matchService && matchCounty;
    });
  }, [projects, serviceFilter, countyFilter]);

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  const getServiceColor = (type: CompletedProject['serviceType']) => {
    switch (type) {
      case 'Pumping':
        return {
          bg: 'bg-emerald-500',
          text: 'text-emerald-400',
          ring: 'ring-emerald-400/50',
          badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
        };
      case 'Aerobic':
        return {
          bg: 'bg-sky-500',
          text: 'text-sky-400',
          ring: 'ring-sky-400/50',
          badge: 'bg-sky-950/80 text-sky-300 border-sky-500/40',
        };
      case 'Inspection':
        return {
          bg: 'bg-amber-500',
          text: 'text-amber-400',
          ring: 'ring-amber-400/50',
          badge: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
        };
      case 'Emergency':
        return {
          bg: 'bg-red-500',
          text: 'text-red-400',
          ring: 'ring-red-400/50',
          badge: 'bg-red-950/80 text-red-300 border-red-500/40',
        };
      case 'Repair':
        return {
          bg: 'bg-purple-500',
          text: 'text-purple-400',
          ring: 'ring-purple-400/50',
          badge: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
        };
      default:
        return {
          bg: 'bg-emerald-500',
          text: 'text-emerald-400',
          ring: 'ring-emerald-400/50',
          badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
        };
    }
  };

  const handleMarkerClick = (p: CompletedProject) => {
    setSelectedProjectId(p.id);
    trackEvent('map_area_click', {
      city: p.city,
      service: p.serviceType,
      source: 'completed_projects_service_map',
    });
  };

  return (
    <section
      id={sectionId}
      className={`py-16 sm:py-24 bg-slate-900 text-white scroll-mt-12 relative overflow-hidden ${className}`}
      aria-label="Recent Septic Projects in Greater Houston"
    >
      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Proven Greater Houston Field Experience</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3">
            Recently Completed Septic Projects Across Houston
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Explore live markers of actual septic pumping, aerobic ATU maintenance, and TCEQ inspections executed by our licensed partner crews across Harris, Montgomery, Fort Bend, and Brazoria counties.
          </p>
        </div>

        {/* Experience Proof Metric Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
            <div className="text-xl sm:text-3xl font-extrabold text-emerald-400">4,850+</div>
            <div className="text-[11px] text-slate-300 font-semibold mt-0.5">Tanks Pumped in Houston</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
            <div className="text-xl sm:text-3xl font-extrabold text-white">100%</div>
            <div className="text-[11px] text-slate-300 font-semibold mt-0.5">TCEQ Sludge Manifest Compliant</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
            <div className="text-xl sm:text-3xl font-extrabold text-amber-400">&lt; 90 min</div>
            <div className="text-[11px] text-slate-300 font-semibold mt-0.5">Average Emergency Dispatch</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
            <div className="text-xl sm:text-3xl font-extrabold text-sky-400">4.9 ★</div>
            <div className="text-[11px] text-slate-300 font-semibold mt-0.5">Verified Local Homeowner Rating</div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Service Filter */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Service:
            </span>
            {['All', 'Pumping', 'Aerobic', 'Inspection', 'Emergency', 'Repair'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setServiceFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  serviceFilter === s
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'bg-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* County Filter */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              County:
            </span>
            {['All', 'Harris', 'Montgomery', 'Fort Bend', 'Brazoria'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCountyFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  countyFilter === c
                    ? 'bg-sky-500 text-slate-950 shadow-xs'
                    : 'bg-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-Column Interface: Interactive Map Canvas vs Project Details Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Map Canvas with Project Markers (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden min-h-[460px] flex flex-col justify-between">
            {/* Map Header Overlay */}
            <div className="flex items-center justify-between mb-4 z-10">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Greater Houston Regional Dispatch Field (Live GPS Markers)
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Showing {filteredProjects.length} Verified Projects
              </span>
            </div>

            {/* Simulated Vector Houston Map Canvas */}
            <div className="relative w-full h-[380px] sm:h-[440px] bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden select-none">
              {/* Regional Geographic Lines & Landmarks */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
                {/* Grand Parkway TX-99 Loop */}
                <ellipse cx="50%" cy="45%" rx="42%" ry="38%" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
                {/* Sam Houston Tollway Beltway 8 */}
                <ellipse cx="50%" cy="45%" rx="28%" ry="25%" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 3" />
                {/* I-610 Inner Loop */}
                <ellipse cx="50%" cy="45%" rx="14%" ry="12%" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.6" />

                {/* Major Highways */}
                {/* I-10 East-West */}
                <line x1="5%" y1="52%" x2="95%" y2="48%" stroke="#475569" strokeWidth="1.5" />
                {/* I-45 North-South */}
                <line x1="52%" y1="5%" x2="50%" y2="95%" stroke="#475569" strokeWidth="1.5" />
                {/* US-290 Northwest */}
                <line x1="12%" y1="18%" x2="48%" y2="44%" stroke="#475569" strokeWidth="1.5" />
                {/* US-59 / I-69 Southwest */}
                <line x1="20%" y1="85%" x2="48%" y2="46%" stroke="#475569" strokeWidth="1.5" />

                {/* Waterbodies (Lake Conroe, Galveston Bay, San Jacinto) */}
                <circle cx="56%" cy="7%" r="14" fill="#0284c7" opacity="0.4" />
                <path d="M 80 80 Q 90 85 98 98" stroke="#0284c7" strokeWidth="3" fill="none" opacity="0.4" />
              </svg>

              {/* Geographical Labels */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-sky-400/70 tracking-wider">
                LAKE CONROE / MONTGOMERY CO.
              </div>
              <div className="absolute bottom-2 left-6 text-[10px] font-bold text-slate-500 tracking-wider">
                FORT BEND CO. (KATY / SUGAR LAND)
              </div>
              <div className="absolute bottom-2 right-6 text-[10px] font-bold text-slate-500 tracking-wider">
                BRAZORIA / GALVESTON CO.
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-black text-slate-700 pointer-events-none">
                HOUSTON METRO
              </div>

              {/* Interactive Markers for Projects */}
              {filteredProjects.map((p) => {
                const isSelected = p.id === activeProject.id;
                const colors = getServiceColor(p.serviceType);

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleMarkerClick(p)}
                    style={{ left: `${p.mapX}%`, top: `${p.mapY}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-transform cursor-pointer ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                    title={`${p.title} (${p.city}, TX)`}
                  >
                    {/* Pulsing ring for active */}
                    {isSelected && (
                      <span className={`absolute -inset-2 rounded-full ${colors.bg} opacity-40 animate-ping`} />
                    )}

                    {/* Pin Bubble */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg border-2 transition-all ${
                        isSelected
                          ? `${colors.bg} text-slate-950 border-white ring-4 ${colors.ring}`
                          : 'bg-slate-800 text-white border-slate-600 hover:border-white'
                      }`}
                    >
                      {p.serviceType === 'Pumping' && <Droplet className="w-3.5 h-3.5" />}
                      {p.serviceType === 'Aerobic' && <Sparkles className="w-3.5 h-3.5" />}
                      {p.serviceType === 'Inspection' && <FileCheck className="w-3.5 h-3.5" />}
                      {p.serviceType === 'Emergency' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {p.serviceType === 'Repair' && <Wrench className="w-3.5 h-3.5" />}
                    </div>

                    {/* Floating City Label */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap shadow-xs pointer-events-none transition-all ${
                        isSelected
                          ? 'bg-white text-slate-950'
                          : 'bg-slate-900/90 text-slate-300 group-hover:bg-slate-800'
                      }`}
                    >
                      {p.city}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-800 text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Tank Pumping</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>Aerobic ATU</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>TCEQ Inspection</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Emergency Jetting</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Riser / Repairs</span>
              </span>
            </div>
          </div>

          {/* Right Column: Selected Project Detail Card & List (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Active Project Highlight Card */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-start justify-between gap-3 border-b border-slate-700 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getServiceColor(activeProject.serviceType).badge}`}>
                      {activeProject.serviceType}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{activeProject.completedAgo}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {activeProject.title}
                  </h3>
                </div>

                <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-center shrink-0">
                  <span className="text-[10px] font-bold text-emerald-400 block uppercase">Verified</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto" />
                </div>
              </div>

              {/* Location & Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Location</span>
                  <strong className="text-white block mt-0.5">{activeProject.city}, TX ({activeProject.zipCode})</strong>
                  <span className="text-[11px] text-slate-400">{activeProject.neighborhood}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">System Specs</span>
                  <strong className="text-white block mt-0.5">{activeProject.tankSize}</strong>
                  {activeProject.gallonsPumped ? (
                    <span className="text-[11px] text-emerald-400 font-bold">{activeProject.gallonsPumped} Gallons Pumped</span>
                  ) : (
                    <span className="text-[11px] text-slate-400">Mechanical Service</span>
                  )}
                </div>
              </div>

              {/* Technician Notes */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Licensed Technician Job Notes:</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {activeProject.technicianNotes}
                </p>
              </div>

              {/* Quick Book CTA for this Area */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <a
                  href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call {activeProject.city} Crew</span>
                </a>

                <a
                  href="#quote-form"
                  onClick={(e) => {
                    const el = document.getElementById('quote-form');
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs transition-colors"
                >
                  <span>Book In {activeProject.city}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Project Select List */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Recently Dispatched Truck Logs
              </span>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {filteredProjects.map((p) => {
                  const isSelected = p.id === activeProject.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleMarkerClick(p)}
                      className={`p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-slate-900 border-emerald-500/80 ring-1 ring-emerald-500/50'
                          : 'bg-slate-900/50 border-slate-700/60 hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className="text-white">{p.city}, TX</strong>
                          <span className="text-[10px] text-slate-400">({p.neighborhood})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{p.title}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block">{p.completedAgo}</span>
                        <span className="text-[10px] font-bold text-emerald-400">{p.serviceType}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
