import { Home, MessageCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { BUSINESS_CONFIG, SERVICES } from '../config/business';
import { SEOHead } from '../components/SEOHead';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  return (
    <>
      <SEOHead
        title="Page Not Found | SepticProDirect"
        description="The requested page could not be located. Explore septic tank pumping and cleaning services in Greater Houston, TX."
        canonicalPath="/404"
      />

      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400">ERROR 404</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Page Not Found
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              We couldn't find the exact page you're looking for. Please browse our core Houston septic services below or call our dispatch desk.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </button>

            <a
              href={BUSINESS_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors tabular-nums"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {BUSINESS_CONFIG.phoneDisplay}</span>
            </a>
          </div>

          {/* Quick Services Navigation */}
          <div className="pt-8 border-t border-slate-200 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 text-center sm:text-left">
              Popular Houston Septic Services:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {SERVICES.map((s) => (
                <a
                  key={s.id}
                  href={`/${s.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/${s.slug}/`);
                  }}
                  className="p-3 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-800 flex items-center justify-between transition-colors"
                >
                  <span className="font-semibold">{s.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
