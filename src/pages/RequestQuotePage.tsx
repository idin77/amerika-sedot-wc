import { useState } from 'react';
import { Calculator, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { SEOHead } from '../components/SEOHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { QuoteForm } from '../components/QuoteForm';
import { CostEstimatorModal } from '../components/CostEstimatorModal';

interface RequestQuotePageProps {
  onNavigate: (path: string) => void;
}

export function RequestQuotePage({ onNavigate }: RequestQuotePageProps) {
  const [estimatorOpen, setEstimatorOpen] = useState(false);
  const breadcrumbs = [{ name: 'Request a Quote', url: '/request-a-quote/' }];

  return (
    <>
      <SEOHead
        title="Request a Free Septic Tank Pumping Quote | Houston, TX | SepticProDirect"
        description="Request a free, transparent quote for septic tank pumping, cleaning, inspection, or maintenance in Greater Houston, TX. Fast local contractor matching with upfront pricing."
        canonicalPath="/request-a-quote/"
        schemaType="WebSite"
        breadcrumbs={breadcrumbs}
      />

      <CostEstimatorModal
        isOpen={estimatorOpen}
        onClose={() => setEstimatorOpen(false)}
        onSelectEstimate={() => {}}
      />

      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

      {/* Hero */}
      <section className="bg-slate-900 text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Fast, No-Obligation Estimates
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Request a Free Septic Service Quote
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Connect with a verified, licensed septic professional in your Houston neighborhood. Honest pricing based on tank size and access.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Sidebar: Pricing Guides & Estimator trigger */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Houston Pricing Guide</h3>
                  <button
                    type="button"
                    onClick={() => setEstimatorOpen(true)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Estimator</span>
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {BUSINESS_CONFIG.typicalPriceRanges.map((p) => (
                    <div key={p.size} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                      <div className="font-semibold text-slate-900">{p.size}</div>
                      <div className="text-emerald-700 font-bold tabular-nums">{p.range}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{p.idealFor}</div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
                  *Final price depends on buried lid depth (if digging is needed) and distance to driveway.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 text-xs text-slate-600 space-y-3 shadow-xs">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Why Homeowners Trust Us</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Independent, vetted TCEQ-registered pumpers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Written quote provided before pumping starts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Zero spam or unsolicited third-party sales calls</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Lead Form */}
            <div className="lg:col-span-8">
              <QuoteForm
                title="Service Request Form"
                subtitle="Fill out your property details below to receive availability and custom pricing."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
