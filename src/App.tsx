import { useState, useEffect } from 'react';
import { SERVICES, SERVICE_AREAS } from './config/business';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { HomePage } from './pages/HomePage';
import { ServicePage } from './pages/ServicePage';
import { ServiceAreasPage } from './pages/ServiceAreasPage';
import { CityPage } from './pages/CityPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactPage } from './pages/ContactPage';
import { RequestQuotePage } from './pages/RequestQuotePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { SitemapPage } from './pages/SitemapPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { QuoteForm } from './components/QuoteForm';
import { MetaTags } from './components/MetaTags';
import { BreadcrumbSchema } from './components/BreadcrumbSchema';
import { LeadConversionTracker } from './components/LeadConversionTracker';
import { X } from 'lucide-react';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Route matching logic
  const renderRoute = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={handleNavigate} />;
    }

    // 2. Service Pages (e.g. /septic-tank-pumping-houston-tx/)
    const matchedService = SERVICES.find(
      (s) =>
        currentPath === `/${s.slug}/` ||
        currentPath === `/${s.slug}` ||
        currentPath.replace(/\/$/, '') === `/${s.slug}`
    );
    if (matchedService) {
      return <ServicePage service={matchedService} onNavigate={handleNavigate} />;
    }

    // 3. Service Areas index
    if (currentPath === '/service-areas/' || currentPath === '/service-areas') {
      return <ServiceAreasPage onNavigate={handleNavigate} />;
    }

    // 4. Individual City Pages (e.g. /service-areas/katy-tx/)
    const cityMatch = currentPath.match(/^\/service-areas\/([^/]+)\/?$/);
    if (cityMatch) {
      const citySlug = cityMatch[1];
      const matchedCity = SERVICE_AREAS.find(
        (c) => c.slug === citySlug || c.id === citySlug.replace('-tx', '')
      );
      if (matchedCity) {
        return <CityPage city={matchedCity} onNavigate={handleNavigate} />;
      }
    }

    // 5. About Us
    if (currentPath === '/about-us/' || currentPath === '/about-us') {
      return <AboutUsPage onNavigate={handleNavigate} />;
    }

    // 6. Contact
    if (currentPath === '/contact/' || currentPath === '/contact') {
      return <ContactPage onNavigate={handleNavigate} />;
    }

    // 7. Request a Quote
    if (currentPath === '/request-a-quote/' || currentPath === '/request-a-quote') {
      return <RequestQuotePage onNavigate={handleNavigate} />;
    }

    // 8. Privacy Policy
    if (currentPath === '/privacy-policy/' || currentPath === '/privacy-policy') {
      return <PrivacyPolicyPage onNavigate={handleNavigate} />;
    }

    // 9. Terms of Service
    if (currentPath === '/terms-of-service/' || currentPath === '/terms-of-service') {
      return <TermsOfServicePage onNavigate={handleNavigate} />;
    }

    // 10. Sitemap & URL Directory
    if (currentPath === '/sitemap/' || currentPath === '/sitemap' || currentPath === '/html-sitemap/') {
      return <SitemapPage onNavigate={handleNavigate} />;
    }

    // 11. Fallback 404
    return <NotFoundPage onNavigate={handleNavigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-emerald-600 selection:text-white">
      {/* Route-Aware Dynamic Meta Tags (Title, Description, Canonical & Social) */}
      <MetaTags currentPath={currentPath} />

      {/* Dynamic Route-Aware Breadcrumb Structured Data (Schema.org BreadcrumbList) */}
      <BreadcrumbSchema path={currentPath} />

      {/* Lead Conversion Tracking & Webhook Forwarder (GA4 & Webhook Relay) */}
      <LeadConversionTracker />

      {/* Top Bar Navigation */}
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenQuoteModal={() => setQuoteModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1 pb-16 lg:pb-0">{renderRoute()}</main>

      {/* Site Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Sticky Bar - strictly within 15% viewport height cap */}
      <MobileStickyBar onOpenQuote={() => setQuoteModalOpen(true)} />

      {/* Quick Quote Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <QuoteForm
              compact
              title="Request a Free Quote"
              subtitle="Connect with an available licensed local contractor in Greater Houston."
              onSuccess={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
