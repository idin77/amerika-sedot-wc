import { ShieldCheck, HeartHandshake, Award, CheckCircle2 } from 'lucide-react';

export interface TrustBadgeItem {
  id: string;
  title: string;
  subtitle: string;
  badgeCode?: string;
  highlightText?: string;
}

export const DEFAULT_TRUST_BADGES: TrustBadgeItem[] = [
  {
    id: 'licensed-insured',
    title: 'Licensed & Insured',
    subtitle: 'Texas TCEQ Registered & $2M Commercial Liability',
    highlightText: 'TCEQ #285',
  },
  {
    id: 'bbb-accredited',
    title: 'BBB Accredited',
    subtitle: 'A+ Rated Trust Standards & Consumer Confidence',
    badgeCode: 'A+',
  },
  {
    id: 'family-owned',
    title: 'Family Owned',
    subtitle: 'Locally Operated in Houston · Serving Neighbors Since 2012',
    highlightText: 'Local Team',
  },
];

interface TrustBadgesProps {
  variant?: 'compact' | 'cards' | 'inline' | 'bordered';
  className?: string;
  showSubtitles?: boolean;
}

export function TrustBadges({
  variant = 'cards',
  className = '',
  showSubtitles = true,
}: TrustBadgesProps) {
  // 1. BBB Custom Seal Icon
  const BBBAcreditedIcon = () => (
    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/90 text-blue-800 flex flex-col items-center justify-center font-black leading-none shrink-0 shadow-2xs">
      <span className="text-[9px] font-black tracking-tighter text-blue-900">BBB</span>
      <span className="text-[10px] font-extrabold text-blue-700 -mt-0.5">A+</span>
    </div>
  );

  // 2. Licensed & Insured Shield Icon
  const LicensedInsuredIcon = () => (
    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/90 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
      <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
    </div>
  );

  // 3. Family Owned Emblem Icon
  const FamilyOwnedIcon = () => (
    <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/90 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
      <HeartHandshake className="w-4.5 h-4.5 text-amber-700" />
    </div>
  );

  if (variant === 'compact') {
    return (
      <div className={`grid grid-cols-3 gap-2 py-2 ${className}`} aria-label="Trust Certifications">
        {/* Licensed & Insured */}
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200/80">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="truncate">
            <div className="text-[11px] font-bold text-slate-900 leading-tight truncate">
              Licensed & Insured
            </div>
            {showSubtitles && (
              <div className="text-[9px] text-slate-500 truncate">TCEQ Approved</div>
            )}
          </div>
        </div>

        {/* BBB Accredited */}
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="px-1 py-0.5 rounded text-[9px] font-black bg-blue-100 text-blue-800 border border-blue-200 leading-none shrink-0">
            BBB
          </span>
          <div className="truncate">
            <div className="text-[11px] font-bold text-slate-900 leading-tight truncate">
              BBB Accredited
            </div>
            {showSubtitles && (
              <div className="text-[9px] text-slate-500 truncate">A+ Rated Partner</div>
            )}
          </div>
        </div>

        {/* Family Owned */}
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200/80">
          <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="truncate">
            <div className="text-[11px] font-bold text-slate-900 leading-tight truncate">
              Family Owned
            </div>
            {showSubtitles && (
              <div className="text-[9px] text-slate-500 truncate">Houston Local</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div
        className={`flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2 text-xs text-slate-600 ${className}`}
        aria-label="Verified Trust Signals"
      >
        <div className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-800">Licensed & Insured</span>
        </div>
        <span className="text-slate-300 hidden sm:inline">•</span>
        <div className="inline-flex items-center gap-1.5">
          <span className="px-1 py-0.2 rounded text-[9px] font-black bg-blue-100 text-blue-800 border border-blue-200 leading-tight">
            BBB A+
          </span>
          <span className="font-semibold text-slate-800">BBB Accredited</span>
        </div>
        <span className="text-slate-300 hidden sm:inline">•</span>
        <div className="inline-flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-amber-600" />
          <span className="font-semibold text-slate-800">Family Owned & Operated</span>
        </div>
      </div>
    );
  }

  // Default 'cards' variant: High-trust card trio
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${className}`}
      aria-label="Company Trust Accreditations and Guarantees"
    >
      {/* 1. Licensed & Insured */}
      <div className="flex items-center sm:items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 shadow-2xs hover:bg-emerald-50 transition-colors">
        <LicensedInsuredIcon />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
              Licensed & Insured
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          </div>
          {showSubtitles && (
            <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
              Texas TCEQ Registered & $2M Commercial Liability
            </p>
          )}
        </div>
      </div>

      {/* 2. BBB Accredited */}
      <div className="flex items-center sm:items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/80 shadow-2xs hover:bg-blue-50 transition-colors">
        <BBBAcreditedIcon />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
              BBB Accredited
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200">
              A+
            </span>
          </div>
          {showSubtitles && (
            <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
              Strict Reliability Standards & Verified Consumer Trust
            </p>
          )}
        </div>
      </div>

      {/* 3. Family Owned */}
      <div className="flex items-center sm:items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80 shadow-2xs hover:bg-amber-50 transition-colors">
        <FamilyOwnedIcon />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
              Family Owned
            </span>
            <span className="text-[10px] font-medium text-amber-700">★</span>
          </div>
          {showSubtitles && (
            <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
              Houston Born & Operated · Serving Neighbors Since 2012
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
