import { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  Clock, 
  Truck, 
  Layers, 
  ChevronRight, 
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SERVICE_AREAS, BUSINESS_CONFIG } from '../config/business';
import { CityArea } from '../types';
import { trackEvent } from '../lib/analytics';

interface ServiceAreaMapProps {
  selectedAreaId?: string;
  onSelectArea?: (areaId: string) => void;
  onNavigate?: (path: string) => void;
  className?: string;
}

// Coordinates calibrated to SVG viewBox 0 0 800 620
// Centered around Houston downtown (approx 410, 310)
interface MapNode {
  id: string;
  name: string;
  county: string;
  region: 'North' | 'West' | 'South' | 'East' | 'Central';
  x: number;
  y: number;
  zips: string[];
  responseTarget: string;
  soilHighlight: string;
}

const MAP_NODES: MapNode[] = [
  {
    id: 'houston',
    name: 'Houston (Central/Suburbs)',
    county: 'Harris County',
    region: 'Central',
    x: 410,
    y: 310,
    zips: ['77002', '77024', '77040', '77079', '77095'],
    responseTarget: '45–60 min dispatch',
    soilHighlight: 'Heavy Beaumont clay; regular pumping prevents drainfield compaction.',
  },
  {
    id: 'the-woodlands',
    name: 'The Woodlands',
    county: 'Montgomery County',
    region: 'North',
    x: 400,
    y: 130,
    zips: ['77380', '77381', '77382', '77389'],
    responseTarget: '60–75 min dispatch',
    soilHighlight: 'Sandy loam over clay; tree root intrusion requires routine inspection.',
  },
  {
    id: 'conroe',
    name: 'Conroe',
    county: 'Montgomery County',
    region: 'North',
    x: 405,
    y: 70,
    zips: ['77301', '77304', '77384'],
    responseTarget: '60–90 min dispatch',
    soilHighlight: 'Forest clay/sand; aerobic spray & conventional gravity fields.',
  },
  {
    id: 'spring',
    name: 'Spring',
    county: 'Harris / Montgomery',
    region: 'North',
    x: 415,
    y: 190,
    zips: ['77373', '77379', '77388'],
    responseTarget: '45–60 min dispatch',
    soilHighlight: 'Cypress Creek alluvial soil; high water table post-storm.',
  },
  {
    id: 'tomball',
    name: 'Tomball',
    county: 'Harris County',
    region: 'North',
    x: 325,
    y: 185,
    zips: ['77375', '77377'],
    responseTarget: '50–65 min dispatch',
    soilHighlight: 'Sandy loam with clay pan; popular for aerobic drip systems.',
  },
  {
    id: 'cypress',
    name: 'Cypress',
    county: 'Harris County',
    region: 'West',
    x: 275,
    y: 245,
    zips: ['77429', '77433'],
    responseTarget: '45–60 min dispatch',
    soilHighlight: 'Heavy Katy-series clay; slow percolation requires strict pumping.',
  },
  {
    id: 'katy',
    name: 'Katy',
    county: 'Harris / Fort Bend',
    region: 'West',
    x: 230,
    y: 330,
    zips: ['77449', '77450', '77493', '77494'],
    responseTarget: '45–60 min dispatch',
    soilHighlight: 'Dense black gumbo clay; aerobic spray & conventional tanks.',
  },
  {
    id: 'sugar-land',
    name: 'Sugar Land',
    county: 'Fort Bend County',
    region: 'South',
    x: 310,
    y: 400,
    zips: ['77478', '77479', '77498'],
    responseTarget: '45–60 min dispatch',
    soilHighlight: 'Brazos River silt & alluvial clay; seasonal water tables.',
  },
  {
    id: 'pearland',
    name: 'Pearland',
    county: 'Brazoria / Harris',
    region: 'South',
    x: 480,
    y: 410,
    zips: ['77581', '77584', '77588'],
    responseTarget: '45–60 min dispatch',
    soilHighlight: 'Coastal plain heavy clay; pump-outs prevent surface ponding.',
  },
  {
    id: 'friendswood',
    name: 'Friendswood',
    county: 'Galveston / Harris',
    region: 'South',
    x: 520,
    y: 440,
    zips: ['77546'],
    responseTarget: '50–70 min dispatch',
    soilHighlight: 'Clear Creek alluvial soil; high humidity and soil saturation.',
  },
  {
    id: 'league-city',
    name: 'League City',
    county: 'Galveston County',
    region: 'South',
    x: 565,
    y: 465,
    zips: ['77573'],
    responseTarget: '50–75 min dispatch',
    soilHighlight: 'Coastal clay loam; regular maintenance prevents high-water alarm.',
  },
  {
    id: 'humble',
    name: 'Humble & Atascocita',
    county: 'Harris County',
    region: 'East',
    x: 535,
    y: 220,
    zips: ['77338', '77346', '77396'],
    responseTarget: '50–65 min dispatch',
    soilHighlight: 'San Jacinto River drainage basin; aerobic treatment units.',
  },
];

export function ServiceAreaMap({
  selectedAreaId,
  onSelectArea,
  onNavigate,
  className = '',
}: ServiceAreaMapProps) {
  const [activeNodeId, setActiveNodeId] = useState<string>(selectedAreaId || 'houston');
  const [activeRegionFilter, setActiveRegionFilter] = useState<string>('All');

  useEffect(() => {
    if (selectedAreaId) {
      setActiveNodeId(selectedAreaId);
    }
  }, [selectedAreaId]);

  const activeNode = useMemo(() => {
    return MAP_NODES.find((n) => n.id === activeNodeId) || MAP_NODES[0];
  }, [activeNodeId]);

  const activeServiceAreaItem: CityArea | undefined = useMemo(() => {
    return SERVICE_AREAS.find((a) => a.id === activeNode.id);
  }, [activeNode.id]);

  const handleNodeClick = (node: MapNode) => {
    setActiveNodeId(node.id);
    if (onSelectArea) {
      onSelectArea(node.id);
    }
    trackEvent('map_area_click', {
      areaId: node.id,
      areaName: node.name,
      county: node.county,
    });
  };

  // Inject Schema.org ServiceArea & GeoShape JSON-LD for rich local Houston SEO
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const SCRIPT_ID = 'jsonld-houston-service-areas-map';
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = SCRIPT_ID;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: BUSINESS_CONFIG.brandName,
      telephone: BUSINESS_CONFIG.phoneRaw,
      url: `${BUSINESS_CONFIG.domain}/service-areas/`,
      description: 'Licensed septic tank pumping, cleaning, and inspection coverage map across Greater Houston, Harris, Montgomery, Fort Bend, Brazoria, and Galveston counties.',
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '29.7604',
        longitude: '-95.3698',
      },
      areaServed: [
        {
          '@type': 'AdministrativeArea',
          name: 'Harris County, TX',
        },
        {
          '@type': 'AdministrativeArea',
          name: 'Fort Bend County, TX',
        },
        {
          '@type': 'AdministrativeArea',
          name: 'Montgomery County, TX',
        },
        {
          '@type': 'AdministrativeArea',
          name: 'Brazoria County, TX',
        },
        {
          '@type': 'AdministrativeArea',
          name: 'Galveston County, TX',
        },
        ...SERVICE_AREAS.map((area) => ({
          '@type': 'City',
          name: `${area.name}, TX`,
          postalCode: area.zipCodes,
        })),
      ],
    };

    scriptTag.textContent = JSON.stringify(schemaData, null, 2);

    return () => {
      const tag = document.getElementById(SCRIPT_ID);
      if (tag && tag.parentNode) {
        tag.parentNode.removeChild(tag);
      }
    };
  }, []);

  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden ${className}`}
      id="service-area-interactive-map"
      aria-label="Interactive Houston Septic Service Area Map"
    >
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Navigation className="w-3.5 h-3.5" />
            <span>Interactive Dispatch Coverage Map</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Greater Houston Regional Septic Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Select any city hub on the map or filter below to inspect local county regulations, soil percolation notes, and guaranteed dispatch routes.
          </p>
        </div>

        {/* Region Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/80 text-xs shrink-0">
          {['All', 'North', 'West', 'South', 'East'].map((region) => {
            const isActive = activeRegionFilter === region;
            return (
              <button
                key={region}
                type="button"
                onClick={() => setActiveRegionFilter(region)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive SVG Canvas (Left) + Detail Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Interactive Vector Map (7 cols) */}
        <div className="lg:col-span-7 p-4 sm:p-6 bg-slate-950/95 relative flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 select-none overflow-hidden">
          {/* Subtle Ambient Grid Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* SVG Map Canvas */}
          <div className="w-full max-w-[620px] aspect-[4/3] relative">
            <svg
              viewBox="0 0 800 620"
              className="w-full h-full drop-shadow-md"
              role="img"
              aria-label="Map of Greater Houston Counties and Septic Service Hubs"
            >
              <defs>
                {/* Glow Filter */}
                <filter id="emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* County Background Regions (Stylized Polygonal Boundaries) */}
              {/* Montgomery County (North) */}
              <polygon
                points="250,20 570,20 560,170 260,170"
                className="fill-slate-900/60 stroke-slate-800/80 stroke-1 hover:fill-slate-800/60 transition-colors"
              />
              <text x="520" y="55" className="fill-slate-600 text-[13px] font-bold tracking-widest uppercase">
                Montgomery Co.
              </text>

              {/* Harris County (Central core) */}
              <polygon
                points="220,170 590,170 630,370 200,370"
                className="fill-slate-900/80 stroke-emerald-500/20 stroke-1.5 hover:fill-slate-900 transition-colors"
              />
              <text x="600" y="270" className="fill-emerald-500/40 text-[14px] font-extrabold tracking-widest uppercase">
                Harris County
              </text>

              {/* Fort Bend County (Southwest) */}
              <polygon
                points="160,370 380,370 360,540 140,500"
                className="fill-slate-900/60 stroke-slate-800/80 stroke-1 hover:fill-slate-800/60 transition-colors"
              />
              <text x="180" y="470" className="fill-slate-600 text-[13px] font-bold tracking-widest uppercase">
                Fort Bend Co.
              </text>

              {/* Brazoria & Galveston (South / Southeast) */}
              <polygon
                points="380,370 660,370 690,560 370,550"
                className="fill-slate-900/50 stroke-slate-800/80 stroke-1 hover:fill-slate-800/60 transition-colors"
              />
              <text x="590" y="520" className="fill-slate-600 text-[12px] font-bold tracking-widest uppercase">
                Brazoria & Galveston
              </text>

              {/* Major Highway Corridors (Stylized Houston Radials) */}
              {/* Grand Parkway (TX-99 Outer Loop) */}
              <path
                d="M 230,130 C 210,230 200,360 270,460 C 370,550 560,530 630,420"
                fill="none"
                className="stroke-slate-800/90 stroke-dasharray-4 stroke-1"
              />
              {/* Beltway 8 (Sam Houston Tollway Ring) */}
              <ellipse
                cx="410"
                cy="310"
                rx="140"
                ry="115"
                fill="none"
                className="stroke-emerald-500/20 stroke-1 stroke-dasharray-2"
              />
              <text x="410" y="200" textAnchor="middle" className="fill-slate-600 text-[9px] font-mono tracking-wider">
                BELTWAY 8
              </text>

              {/* I-10 East/West Corridor */}
              <line x1="80" y1="320" x2="720" y2="305" className="stroke-slate-700/60 stroke-1.5" />
              <text x="110" y="315" className="fill-slate-500 text-[9px] font-mono">I-10 W</text>
              <text x="690" y="300" className="fill-slate-500 text-[9px] font-mono">I-10 E</text>

              {/* I-45 North/South Corridor */}
              <line x1="400" y1="30" x2="570" y2="580" className="stroke-slate-700/60 stroke-1.5" />
              <text x="410" y="45" className="fill-slate-500 text-[9px] font-mono">I-45 N</text>
              <text x="580" y="570" className="fill-slate-500 text-[9px] font-mono">I-45 S</text>

              {/* US-290 Northwest Corridor */}
              <line x1="160" y1="170" x2="410" y2="310" className="stroke-slate-700/60 stroke-1" />
              <text x="175" y="180" className="fill-slate-500 text-[9px] font-mono">US-290</text>

              {/* US-59 / I-69 Southwest Corridor */}
              <line x1="190" y1="480" x2="410" y2="310" className="stroke-slate-700/60 stroke-1" />
              <text x="210" y="475" className="fill-slate-500 text-[9px] font-mono">I-69 / US-59</text>

              {/* Map Service Node Pins */}
              {MAP_NODES.map((node) => {
                const isSelected = activeNodeId === node.id;
                const matchesFilter =
                  activeRegionFilter === 'All' || activeRegionFilter === node.region;

                return (
                  <g
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className="cursor-pointer group"
                    opacity={matchesFilter ? 1 : 0.25}
                    style={{ transition: 'opacity 0.2s ease, transform 0.2s ease' }}
                  >
                    {/* Active Ripple Animation */}
                    {isSelected && (
                      <>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="20"
                          className="fill-emerald-500/20 animate-ping"
                        />
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="14"
                          className="fill-emerald-500/30 stroke-emerald-400 stroke-1"
                        />
                      </>
                    )}

                    {/* Node Core Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 7 : 5}
                      className={`transition-all ${
                        isSelected
                          ? 'fill-emerald-400 stroke-white stroke-2 shadow-lg'
                          : 'fill-emerald-600 stroke-slate-900 stroke-1.5 group-hover:fill-emerald-400 group-hover:r-6'
                      }`}
                    />

                    {/* Node Text Label */}
                    <text
                      x={node.x}
                      y={node.y - (isSelected ? 11 : 9)}
                      textAnchor="middle"
                      className={`text-[11px] font-bold tracking-tight transition-all select-none ${
                        isSelected
                          ? 'fill-emerald-300 font-extrabold text-[12px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
                          : 'fill-slate-300 group-hover:fill-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                      }`}
                    >
                      {node.name.split(' (')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 w-full max-w-[620px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-xs" />
              <span>Active Pumping Hub</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-emerald-500/40 inline-block" />
              <span>Beltway 8 / Ring Loops</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-400 inline-block" />
              <span>Selected Route</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-500 text-[10px]">Harris · Fort Bend · Montgomery · Brazoria</span>
          </div>
        </div>

        {/* Right Column: Dynamic Dispatch Detail Card (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-7 flex flex-col justify-between bg-slate-50/70">
          <div>
            {/* Header info */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{activeNode.region} Houston Sector</span>
              </div>
              <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeNode.responseTarget}</span>
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
              {activeNode.name}
            </h3>
            <div className="text-xs font-semibold text-slate-500 mb-4">
              Jurisdiction: <span className="text-slate-800">{activeNode.county}</span>
            </div>

            {/* Structured Local SEO Highlights */}
            <div className="space-y-3.5 text-xs text-slate-600">
              {/* Coverage ZIP Codes */}
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>Covered ZIP Codes:</span>
                  <span className="text-[11px] font-normal text-slate-400">All neighborhood routes</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeNode.zips.map((zip) => (
                    <span
                      key={zip}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-medium border border-slate-200"
                    >
                      {zip}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                    + Adjacent Parcels
                  </span>
                </div>
              </div>

              {/* Soil & Drainage Specifics */}
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Local Texas Soil & Percolation Note:</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {activeNode.soilHighlight}
                </p>
              </div>

              {/* Service Types */}
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Partner Dispatch Guarantees:</span>
                </div>
                <ul className="space-y-1 text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Texas TCEQ Chapter 285 licensed contractors</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>All-inclusive disposal at certified Houston treatment sites</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Upfront flat quote before suction hoses are deployed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center gap-3">
            <a
              href="#quote-section"
              onClick={(e) => {
                const el = document.getElementById('quote-section');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth' });
                } else if (onNavigate) {
                  e.preventDefault();
                  onNavigate('/#quote-section');
                }
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm text-center shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Request Quote for {activeNode.name.split(' (')[0]}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-300 text-center transition-colors shrink-0"
            >
              Call {BUSINESS_CONFIG.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
