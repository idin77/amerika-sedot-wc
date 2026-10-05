import { AlertCircle, PhoneCall, Zap, Clock } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

interface EmergencyIndicatorProps {
  variant?: 'pill' | 'badge' | 'card' | 'banner';
  className?: string;
  showPhone?: boolean;
}

export function EmergencyIndicator({
  variant = 'pill',
  className = '',
  showPhone = false,
}: EmergencyIndicatorProps) {
  const handleClick = () => {
    trackEvent('phone_click', {
      source: `emergency_indicator_${variant}`,
      phoneNumber: BUSINESS_CONFIG.phoneRaw,
    });
  };

  // 1. Sleek Pill Variant (Ideal for Header top bar / navigation)
  if (variant === 'pill') {
    return (
      <a
        href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-50 hover:bg-red-100/90 border border-red-200/90 text-red-700 text-xs font-semibold transition-all group shadow-2xs select-none ${className}`}
        title="Immediate Emergency Septic Dispatch Available"
        aria-label="24/7 Emergency Service Available - Click to Call"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <span className="font-bold tracking-tight text-red-900 group-hover:text-red-950">
          24/7 Emergency Service
        </span>
        {showPhone && (
          <span className="hidden xl:inline text-red-600 font-mono text-[11px] font-semibold border-l border-red-200 pl-1.5 ml-0.5">
            {BUSINESS_CONFIG.phoneDisplay}
          </span>
        )}
      </a>
    );
  }

  // 2. Compact Badge Variant (Subtle inline tag)
  if (variant === 'badge') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold tracking-tight ${className}`}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
        </span>
        <span>24/7 Emergency Service</span>
      </span>
    );
  }

  // 3. Banner Variant (Full width highlight bar)
  if (variant === 'banner') {
    return (
      <div
        className={`bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-3 shadow-xs ${className}`}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <span className="font-bold uppercase tracking-wider text-[11px]">24/7 Emergency Service</span>
        </div>
        <span className="hidden sm:inline text-rose-200">|</span>
        <span className="hidden sm:inline text-rose-100">
          Septic alarm sounding or sewage backup? On-call vacuum trucks ready for urgent dispatch.
        </span>
        <a
          href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 bg-white text-red-700 hover:bg-rose-50 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-2xs transition-colors shrink-0"
        >
          <PhoneCall className="w-3 h-3 text-red-600" />
          <span>Call Now: {BUSINESS_CONFIG.phoneDisplay}</span>
        </a>
      </div>
    );
  }

  // 4. Card Variant (Rich urgent callout box for ContactPage)
  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-red-50/80 via-white to-rose-50/60 border border-red-200/90 shadow-2xs ${className}`}
      role="region"
      aria-label="24/7 Emergency Service Information"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          {/* Pulsing Pill Header */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/80 border border-red-200 text-red-800 text-xs font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
            </span>
            <span>24/7 Emergency Service</span>
            <span className="text-red-500 text-[10px] font-semibold bg-white/80 px-1.5 py-0.2 rounded border border-red-200">
              URGENT DISPATCH
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Experiencing a Septic Backup or High-Water Alarm?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
            Our priority dispatch team routes immediate local vacuum pumping units across Greater Houston 24 hours a day, 7 days a week, including weekends and holidays.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 text-red-700 font-medium">
              <Zap className="w-3.5 h-3.5 text-red-600" />
              Rapid 60–90 Min Arrival Target
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Night & Weekend Dispatch Available
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
          <a
            href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
            onClick={handleClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98]"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Emergency Call: {BUSINESS_CONFIG.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
