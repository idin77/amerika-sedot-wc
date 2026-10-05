import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Zap, 
  ChevronRight,
  Video,
  ArrowUpRight
} from 'lucide-react';
import { IMAGES } from '../lib/images';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

interface ServiceDemoVideoProps {
  title?: string;
  subtitle?: string;
  className?: string;
  onNavigate?: (path: string) => void;
}

interface ProcessStep {
  id: number;
  time: string;
  title: string;
  shortDesc: string;
  equipment: string;
  standard: string;
  iconName: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 1,
    time: '0:00 - 0:15',
    title: '1. Riser Access & Sludge Gauging',
    shortDesc: 'Technician opens safety risers and measures scum vs sludge thickness with a calibrated Sludge Judge core sampler.',
    equipment: 'Airtight Riser Keys & Core Tube',
    standard: 'TCEQ §285.34 Inspection Rule',
    iconName: 'Gauge',
  },
  {
    id: 2,
    time: '0:15 - 0:35',
    title: '2. High-Velocity Vacuum Suction',
    shortDesc: 'Commercial 3,500-gallon vacuum truck deploys 3-inch reinforced suction hoses to liquefy and extract settled bottom solids.',
    equipment: 'Vac-Con High-CFM Industrial Pumper',
    standard: '100% Tank Evacuation Protocol',
    iconName: 'Vacuum',
  },
  {
    id: 3,
    time: '0:35 - 0:50',
    title: '3. Hydro-Jet Agitation & Baffle Flush',
    shortDesc: 'High-pressure water wand breaks up stubborn grease cakes on tank sidewalls and scours the inlet and outlet sanitary tees.',
    equipment: '2,500 PSI High-Pressure Agitator',
    standard: 'Biomat & Crust Emulsification',
    iconName: 'Water',
  },
  {
    id: 4,
    time: '0:50 - 1:00',
    title: '4. Effluent Filter Clean & Re-Seal',
    shortDesc: 'The cylindrical effluent filter is extracted, pressure washed, reseated, and the tank is sealed with airtight gaskets.',
    equipment: 'Wash Station & Neoprene Gaskets',
    standard: 'Airtight Odor-Lock Verification',
    iconName: 'Shield',
  },
];

export function ServiceDemoVideo({
  title = 'Watch Our Professional Septic Pumping Process',
  subtitle = 'See how licensed Houston contractor partners perform complete, TCEQ-compliant septic maintenance without damaging your lawn.',
  className = '',
  onNavigate,
}: ServiceDemoVideoProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(25);
  const [videoError, setVideoError] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeStep = PROCESS_STEPS[activeStepIndex];

  // Auto-cycle process stages every 5 seconds to simulate video progression
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Smooth progress bar update
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 220);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const togglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (videoRef.current) {
      if (next) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
    trackEvent('service_viewed', {
      source: 'demo_video_toggle',
      state: next ? 'play' : 'pause',
    });
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (videoRef.current) {
      videoRef.current.muted = next;
    }
  };

  const handleStepSelect = (idx: number) => {
    setActiveStepIndex(idx);
    setProgress(idx * 25 + 10);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = idx * 8;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <section
      className={`py-12 sm:py-16 bg-slate-950 text-white overflow-hidden relative ${className}`}
      id="service-demo-video"
      aria-label="Septic Maintenance Process Demo Video"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-semibold text-xs">
            <Video className="w-3.5 h-3.5" />
            <span>Process Simulation & Field Walkthrough</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Video Player + Step Chapters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 16:9 Video Canvas (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
              {/* HTML5 Video Element with High-Resolution Fallback */}
              <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                {!videoError ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    poster={IMAGES.pumpingOperation.src}
                    onError={() => setVideoError(true)}
                    className="w-full h-full object-cover brightness-[0.92] contrast-[1.05]"
                  >
                    {/* Public reliable industrial fluid & vacuum process animation MP4 stream */}
                    <source
                      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  /* High-Definition Fallback Poster with Animated Particle Shimmer */
                  <div className="relative w-full h-full">
                    <img
                      src={IMAGES.pumpingOperation.src}
                      alt={IMAGES.pumpingOperation.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  </div>
                )}

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/30 pointer-events-none" />

                {/* Top Overlay Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-bold text-white shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>REC · FIELD DEMO</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 backdrop-blur-md border border-emerald-500/50 text-[11px] font-semibold text-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>TCEQ Standard</span>
                  </div>
                </div>

                {/* Center Large Play/Pause Toggle button on hover or when paused */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 z-20 ${
                    !isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  aria-label={isPlaying ? 'Pause Demo Video' : 'Play Demo Video'}
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-xl backdrop-blur-sm transition-transform active:scale-95 cursor-pointer">
                    {isPlaying ? (
                      <Pause className="w-7 h-7 fill-slate-950" />
                    ) : (
                      <Play className="w-7 h-7 fill-slate-950 ml-1" />
                    )}
                  </div>
                </button>

                {/* Bottom Video HUD Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20 space-y-2.5 bg-gradient-to-t from-slate-950 to-transparent">
                  {/* Active Step Indicator Pill */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                        Active Phase:
                      </span>
                      <span className="font-semibold text-white truncate max-w-[280px] sm:max-w-md">
                        {activeStep.title}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-300 shrink-0">
                      {activeStep.time}
                    </span>
                  </div>

                  {/* Scrubber Progress Bar */}
                  <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Controls Toolbar */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={toggleMute}
                        className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <span className="text-[11px] text-slate-400 font-mono">
                        0:{(Math.floor((progress / 100) * 60)).toString().padStart(2, '0')} / 1:00
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="hidden sm:inline">1080p 60fps</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Loop Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Step Chapters & Technical Detail (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Standard Maintenance Steps</span>
              <span className="text-emerald-400">Click to Inspect Phase</span>
            </div>

            <div className="space-y-2.5">
              {PROCESS_STEPS.map((step, idx) => {
                const isSelected = activeStepIndex === idx;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepSelect(idx)}
                    className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <span
                        className={`text-xs font-bold transition-colors ${
                          isSelected ? 'text-emerald-400' : 'text-slate-200'
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 shrink-0">
                        {step.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-2.5">
                      {step.shortDesc}
                    </p>

                    {isSelected && (
                      <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-3 text-[11px] text-slate-300 animate-in fade-in duration-200">
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <Zap className="w-3 h-3" />
                          <span>Gear: {step.equipment}</span>
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400">Rule: {step.standard}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Schedule CTA Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex items-center justify-between gap-3 mt-4">
              <div>
                <div className="text-xs font-bold text-white">Need This Done for Your Property?</div>
                <div className="text-[11px] text-slate-400">
                  Flat-rate upfront quotes. No surprises.
                </div>
              </div>

              <a
                href="#quote-form"
                onClick={(e) => {
                  const target = document.getElementById('quote-form') || document.querySelector('form');
                  if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                  } else if (onNavigate) {
                    e.preventDefault();
                    onNavigate('/request-a-quote/');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer active:scale-95"
              >
                <span>Book Service</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
