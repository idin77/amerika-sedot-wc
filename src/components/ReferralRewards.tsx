import { useState } from 'react';
import { 
  Gift, 
  Share2, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageSquare, 
  Mail, 
  Phone, 
  Sparkles, 
  ArrowRight, 
  BadgePercent, 
  Clock, 
  ShieldCheck, 
  HelpCircle,
  QrCode,
  Search
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

interface ReferralAccountData {
  code: string;
  customerName: string;
  email: string;
  phone: string;
  area: string;
  completedReferrals: number;
  totalRewardDollars: number;
  pendingReferrals: number;
  createdAt: string;
}

interface ReferralRewardsProps {
  onNavigate?: (path: string) => void;
  className?: string;
  sectionId?: string;
}

export function ReferralRewards({
  onNavigate,
  className = '',
  sectionId = 'referral-rewards',
}: ReferralRewardsProps) {
  // Tab state: 'generate' or 'lookup'
  const [activeTab, setActiveTab] = useState<'generate' | 'lookup'>('generate');

  // Generator form state
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [area, setArea] = useState<string>('Katy, TX');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeAccount, setActiveAccount] = useState<ReferralAccountData | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Lookup form state
  const [lookupCode, setLookupCode] = useState<string>('');
  const [isLookingUp, setIsLookingUp] = useState<boolean>(false);
  const [lookupResult, setLookupResult] = useState<ReferralAccountData | null>(null);
  const [lookupError, setLookupError] = useState<string>('');

  // Handle Generate Referral Code
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!email && !phone)) return;

    setIsGenerating(true);
    trackEvent('referral_code_generated', {
      source: 'referral_rewards_component',
      location: area,
    });

    try {
      const res = await fetch('/api/referral/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, area }),
      });

      const data = await res.json();
      if (data.success && data.account) {
        setActiveAccount(data.account);
        setGeneratedLink(data.referralLink);
      } else {
        // Fallback generator
        const code = `HOU-${name.toUpperCase().slice(0, 4)}50`;
        const mock: ReferralAccountData = {
          code,
          customerName: name,
          email,
          phone,
          area,
          completedReferrals: 0,
          totalRewardDollars: 0,
          pendingReferrals: 0,
          createdAt: new Date().toISOString(),
        };
        setActiveAccount(mock);
        setGeneratedLink(`https://septicprodirect.com/?ref=${code}`);
      }
    } catch {
      const code = `HOU-${name.toUpperCase().slice(0, 4)}50`;
      setActiveAccount({
        code,
        customerName: name,
        email,
        phone,
        area,
        completedReferrals: 0,
        totalRewardDollars: 0,
        pendingReferrals: 0,
        createdAt: new Date().toISOString(),
      });
      setGeneratedLink(`https://septicprodirect.com/?ref=${code}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Lookup existing code
  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupCode.trim()) return;

    setIsLookingUp(true);
    setLookupError('');
    trackEvent('referral_balance_checked', { code: lookupCode });

    try {
      const clean = lookupCode.trim().toUpperCase();
      const res = await fetch(`/api/referral/${clean}`);
      const data = await res.json();

      if (data.success && data.account) {
        setLookupResult(data.account);
      } else {
        setLookupError(data.message || 'Code not found. Please check spelling or generate a new code.');
      }
    } catch {
      setLookupError('Network error checking code. Please try again.');
    } finally {
      setIsLookingUp(false);
    }
  };

  const copyToClipboard = (text: string, isCode = false) => {
    navigator.clipboard.writeText(text);
    if (isCode) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
    trackEvent('referral_link_copied', { isCode });
  };

  // Share templates
  const smsText = activeAccount
    ? `Hey! If you need your septic tank pumped or inspected in Houston, use my link to get $35 off with SepticProDirect: ${generatedLink}`
    : '';

  const emailSubject = 'Save $35 on your next Houston septic tank service';
  const emailBody = `Hi there,\n\nI recommend SepticProDirect for reliable septic pumping and maintenance in the Houston area. Use my referral code "${activeAccount?.code}" or click my link to get $35 off your service:\n\n${generatedLink}\n\nHope this helps!`;

  return (
    <section
      id={sectionId}
      className={`py-16 sm:py-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white scroll-mt-12 relative overflow-hidden border-t border-slate-800 ${className}`}
      aria-label="Houston Septic Referral Rewards Program"
    >
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 text-xs font-semibold mb-3.5 shadow-sm">
            <Gift className="w-3.5 h-3.5" />
            <span>Houston Neighbor-to-Neighbor Program</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3.5">
            Give $35, Get $50 Referral Rewards
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Help your Houston neighbors prevent costly sewer backups. Your friends get <strong className="text-emerald-400">$35 off</strong> their first pumping or inspection, and you earn a <strong className="text-emerald-400">$50 maintenance credit</strong> applied directly to your next visit.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 font-bold text-base">
              1
            </div>
            <h3 className="font-bold text-white text-base">Share Your Link</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate your unique Houston tracking link and text or email it to neighbors, HOA groups, or friends.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 font-bold text-base">
              2
            </div>
            <h3 className="font-bold text-white text-base">They Save $35</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your referred friend receives an instant $35 discount on any standard pumping, cleaning, or TCEQ inspection.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 font-bold text-base">
              3
            </div>
            <h3 className="font-bold text-white text-base">You Bank $50</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every completed referral adds a $50 credit to your customer account with no maximum limit!
            </p>
          </div>
        </div>

        {/* Tab Controls: Generate vs Check Balance */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'generate'
                ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400/40'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate My Referral Link</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lookup')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'lookup'
                ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400/40'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Check My Reward Balance</span>
          </button>
        </div>

        {/* Tab 1: Code Generator */}
        {activeTab === 'generate' && (
          <div className="max-w-3xl mx-auto bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
            {!activeAccount ? (
              <form onSubmit={handleGenerate} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Create Your Unique Houston Referral Code
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Takes 10 seconds. Enter your name and contact details to immediately activate your code.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Marcus Harris"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Houston Neighborhood / Area
                    </label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Katy, TX">Katy / Fulshear</option>
                      <option value="Cypress, TX">Cypress / Jersey Village</option>
                      <option value="The Woodlands, TX">The Woodlands / Conroe</option>
                      <option value="Pearland, TX">Pearland / Alvin</option>
                      <option value="Sugar Land, TX">Sugar Land / Richmond</option>
                      <option value="Spring, TX">Spring / Tomball</option>
                      <option value="Houston Metro">Houston Metro (General)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Email (for credit vouchers) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="marcus.h@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mobile Phone (Optional for SMS alerts)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(713) 555-0199"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gift className="w-4 h-4" />
                  <span>{isGenerating ? 'Generating Unique Code...' : 'Activate My $50 Referral Code'}</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>No purchase required to generate. Credits never expire and stack without limit.</span>
                </div>
              </form>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-lg">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base">
                        Referral Program Activated!
                      </h4>
                      <p className="text-xs text-emerald-200">
                        Welcome, {activeAccount.customerName}. Your rewards tracking link is live.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveAccount(null)}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Edit Info
                  </button>
                </div>

                {/* Unique Code Box */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700 text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Your Personal Referral Code
                  </span>

                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl sm:text-4xl font-mono font-extrabold text-emerald-400 tracking-wider">
                      {activeAccount.code}
                    </span>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(activeAccount.code, true)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>

                  {/* Shareable Link Box */}
                  <div className="pt-2">
                    <label className="block text-xs text-slate-400 mb-1">
                      Shareable Referral Tracking Link:
                    </label>
                    <div className="flex items-center gap-2 max-w-lg mx-auto">
                      <input
                        type="text"
                        readOnly
                        value={generatedLink}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(generatedLink, false)}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Share Buttons (SMS / Email) */}
                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={`sms:?&body=${encodeURIComponent(smsText)}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>Text to Neighbor</span>
                    </a>

                    <a
                      href={`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                    >
                      <Mail className="w-4 h-4 text-sky-400" />
                      <span>Send via Email</span>
                    </a>
                  </div>
                </div>

                {/* Balance Summary Card */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Completed</div>
                    <div className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                      {activeAccount.completedReferrals}
                    </div>
                    <div className="text-[10px] text-slate-400">Friends Pumped</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Total Credits</div>
                    <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-0.5">
                      ${activeAccount.totalRewardDollars}
                    </div>
                    <div className="text-[10px] text-slate-400">Active Balance</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Pending</div>
                    <div className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-0.5">
                      {activeAccount.pendingReferrals}
                    </div>
                    <div className="text-[10px] text-slate-400">Upcoming Jobs</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Balance Lookup */}
        {activeTab === 'lookup' && (
          <div className="max-w-2xl mx-auto bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Check Existing Referral Credits
              </h3>
              <p className="text-xs text-slate-400">
                Enter your referral code (e.g. <strong className="text-emerald-400">HOU-MARCUS50</strong> or <strong className="text-emerald-400">KATY-ELENA35</strong>) to view your accumulated maintenance credits.
              </p>
            </div>

            <form onSubmit={handleLookup} className="flex gap-2">
              <input
                type="text"
                required
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                placeholder="Enter Code (e.g. HOU-MARCUS50)"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
              />
              <button
                type="submit"
                disabled={isLookingUp}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shrink-0 cursor-pointer"
              >
                {isLookingUp ? 'Checking...' : 'Lookup'}
              </button>
            </form>

            {lookupError && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs">
                {lookupError}
              </div>
            )}

            {lookupResult && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Customer</span>
                    <h4 className="text-base font-bold text-white">{lookupResult.customerName}</h4>
                    <span className="text-xs text-slate-400">{lookupResult.area}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Total Rewards</span>
                    <div className="text-2xl font-extrabold text-emerald-400">
                      ${lookupResult.totalRewardDollars}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Completed Referrals</span>
                    <strong className="text-white text-base">{lookupResult.completedReferrals} Neighbors</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Pending Jobs</span>
                    <strong className="text-amber-400 text-base">{lookupResult.pendingReferrals} In Progress</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between">
                  <span>Redeem credit on next service call:</span>
                  <a
                    href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                    className="font-bold underline text-white"
                  >
                    Call {BUSINESS_CONFIG.phoneDisplay}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
