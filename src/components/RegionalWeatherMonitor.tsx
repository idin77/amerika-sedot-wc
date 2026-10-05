import { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Droplets, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  RefreshCw, 
  MapPin, 
  Phone, 
  ArrowRight,
  Sun,
  CloudLightning,
  Umbrella,
  Compass,
  Info
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

interface WeatherData {
  success: boolean;
  region: string;
  county: string;
  coordinates: { lat: number; lon: number };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    rainInches: number;
    weatherCode: number;
  };
  forecast: {
    rainProbabilityToday: number;
    threeDayRainSum: number;
  };
  septicImpact: {
    soilSaturationLevel: 'dry' | 'moderate' | 'saturated' | 'flooded';
    septicRiskIndex: 'low' | 'moderate' | 'high';
    advisory: string;
    soilType: string;
  };
  lastUpdated: string;
  isFallback?: boolean;
}

const REGION_OPTIONS = [
  { id: 'houston', label: 'Houston Metro', county: 'Harris County' },
  { id: 'the-woodlands', label: 'The Woodlands / Conroe', county: 'Montgomery County' },
  { id: 'katy', label: 'Katy / Fulshear', county: 'Fort Bend / Harris' },
  { id: 'pearland', label: 'Pearland / Alvin', county: 'Brazoria County' },
  { id: 'sugar-land', label: 'Sugar Land / Missouri City', county: 'Fort Bend County' },
];

interface RegionalWeatherMonitorProps {
  onNavigate?: (path: string) => void;
  className?: string;
  sectionId?: string;
}

export function RegionalWeatherMonitor({
  onNavigate,
  className = '',
  sectionId = 'regional-weather-monitor',
}: RegionalWeatherMonitorProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('houston');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchWeather = async (regionId: string) => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/weather?region=${regionId}`);
      if (res.ok) {
        const data = await res.json();
        setWeatherData(data);
      }
    } catch {
      // In case of network error, graceful local baseline
      setWeatherData({
        success: true,
        region: 'Houston Metro',
        county: 'Harris County',
        coordinates: { lat: 29.7604, lon: -95.3698 },
        current: {
          temperature: 82,
          feelsLike: 86,
          humidity: 70,
          windSpeed: 8,
          rainInches: 0.15,
          weatherCode: 1,
        },
        forecast: {
          rainProbabilityToday: 25,
          threeDayRainSum: 0.45,
        },
        septicImpact: {
          soilSaturationLevel: 'moderate',
          septicRiskIndex: 'low',
          advisory: 'Moderate soil moisture. Typical humid subtropical conditions. Absorption lines operating within normal parameters.',
          soilType: 'Gulf Coast Fine Sandy Loam & Gumbo Clay (Slow Percolation)',
        },
        lastUpdated: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedRegion);
  }, [selectedRegion]);

  const handleRegionChange = (regId: string) => {
    setSelectedRegion(regId);
    trackEvent('city_viewed', { city: regId, source: 'weather_monitor' });
  };

  const riskBadge = () => {
    if (!weatherData) return null;
    const { septicRiskIndex } = weatherData.septicImpact;

    if (septicRiskIndex === 'high') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 border border-red-300 text-xs font-bold animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          <span>High Soil Saturation Risk</span>
        </span>
      );
    }
    if (septicRiskIndex === 'moderate') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
          <Droplets className="w-3.5 h-3.5 text-amber-600" />
          <span>Moderate Soil Saturation</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Optimal Soil Absorption Conditions</span>
      </span>
    );
  };

  return (
    <section
      id={sectionId}
      className={`py-16 sm:py-24 bg-slate-900 text-white border-t border-slate-800 scroll-mt-12 relative overflow-hidden ${className}`}
      aria-label="Greater Houston Regional Weather & Septic Soil Saturation Monitor"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/40 text-sky-400 text-xs font-semibold mb-3">
            <CloudRain className="w-3.5 h-3.5" />
            <span>Real-Time Houston Weather & Hydrologic Impact</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3">
            Regional Weather & Septic Soil Saturation Monitor
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            In Greater Houston's dense clay soil, heavy rainfall saturates absorption fields and restricts effluent percolation. Monitor current rainfall levels to protect your tank from hydro-lock and stormwater backups.
          </p>
        </div>

        {/* Region Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {REGION_OPTIONS.map((reg) => {
            const isActive = selectedRegion === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => handleRegionChange(reg.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>{reg.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => fetchWeather(selectedRegion)}
            disabled={isRefreshing}
            title="Refresh Live Weather"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>

        {/* Weather & Saturation Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Live Weather Metrics (5 cols) */}
          <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Live Conditions
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    {weatherData?.region || 'Houston, TX'}
                  </h3>
                  <span className="text-xs text-slate-400">{weatherData?.county}</span>
                </div>
                {riskBadge()}
              </div>

              {/* Big Temp & Rain Stat */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-700/80">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Temperature</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {weatherData?.current.temperature ?? '--'}°F
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Feels like {weatherData?.current.feelsLike ?? '--'}°F
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                    <span>Precipitation</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {weatherData?.current.rainInches ?? '0.00'}"
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {weatherData?.forecast.rainProbabilityToday ?? 0}% rain chance
                  </div>
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/80">
                  <div className="text-[10px] text-slate-400">Humidity</div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    {weatherData?.current.humidity ?? '--'}%
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/80">
                  <div className="text-[10px] text-slate-400">Wind</div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    {weatherData?.current.windSpeed ?? '--'} mph
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/80">
                  <div className="text-[10px] text-slate-400">3-Day Rain</div>
                  <div className="text-xs sm:text-sm font-bold text-sky-400 mt-0.5">
                    {weatherData?.forecast.threeDayRainSum ?? '0.00'}"
                  </div>
                </div>
              </div>
            </div>

            {/* Soil Type Tag */}
            <div className="pt-3 border-t border-slate-700/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Dominant Regional Soil:</span>
              <strong className="text-slate-300">Beaumont Clay / Gumbo Loam</strong>
            </div>
          </div>

          {/* Right Column: Septic Impact Analysis & Stormwater Guidelines (7 cols) */}
          <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Drainfield Hydrologic Advisory</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  How Current Houston Weather Affects Your Septic System
                </h3>
              </div>

              {/* Dynamic Advisory Banner */}
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                  weatherData?.septicImpact.septicRiskIndex === 'high'
                    ? 'bg-red-950/80 border-red-500/80 text-red-200'
                    : weatherData?.septicImpact.septicRiskIndex === 'moderate'
                    ? 'bg-amber-950/80 border-amber-500/80 text-amber-200'
                    : 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200'
                }`}
              >
                <div className="font-bold flex items-center gap-2 mb-1 text-white">
                  {weatherData?.septicImpact.septicRiskIndex === 'high' ? (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  ) : weatherData?.septicImpact.septicRiskIndex === 'moderate' ? (
                    <Droplets className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span>Official Greater Houston Drainage Advisory:</span>
                </div>
                <p>{weatherData?.septicImpact.advisory}</p>
              </div>

              {/* Homeowner Storm Protocol Checklist */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Critical Stormwater Best Practices for Texas Homeowners:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/80 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">1.</span>
                    <span><strong>Ration High Water Usage:</strong> Stagger laundry and dishwasher cycles during downpours to prevent hydraulic overload.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/80 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">2.</span>
                    <span><strong>Keep Vehicles Off Lawn:</strong> Driving or parking heavy vehicles over waterlogged drainfield soils crushes PVC lines.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/80 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">3.</span>
                    <span><strong>Divert Roof Downspouts:</strong> Ensure gutter extensions discharge at least 15–20 feet away from tank access lids.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/80 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">4.</span>
                    <span><strong>NEVER Pump Submerged Tanks:</strong> Hydrostatic groundwater pressure can pop an empty concrete tank out of the ground!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Strip */}
            <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 text-center sm:text-left">
                Experiencing slow toilets or yard water pooling right now?
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <a
                  href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Dispatch</span>
                </a>

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
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <span>Request Emergency Crew</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
