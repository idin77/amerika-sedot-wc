import { useMemo } from 'react';
import { ArrowRight, CheckCircle2, Phone, AlertCircle, Shield, Clock, FileCheck, MessageCircle } from 'lucide-react';
import { ServiceItem } from '../types';
import { BUSINESS_CONFIG, SERVICE_AREAS } from '../config/business';
import { IMAGES } from '../lib/images';
import { SEOHead } from '../components/SEOHead';
import { ImageSchema } from '../components/ImageSchema';
import { FAQSchema } from '../components/FAQSchema';
import { getServiceFAQs } from '../lib/faqData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { QuoteForm } from '../components/QuoteForm';
import { trackEvent } from '../lib/analytics';

interface ServicePageProps {
  service: ServiceItem;
  onNavigate: (path: string) => void;
}

export function ServicePage({ service, onNavigate }: ServicePageProps) {
  const handlePhoneClick = () => {
    trackEvent('phone_click', {
      source: `service_page_${service.id}`,
      phoneNumber: BUSINESS_CONFIG.phoneRaw,
    });
  };

  const breadcrumbs = [
    { name: 'Services', url: '/' },
    { name: service.name, url: `/${service.slug}/` },
  ];

  // Match photo according to service
  const serviceImage =
    service.id === 'inspection'
      ? IMAGES.technicianInspection
      : service.id === 'cleaning'
      ? IMAGES.pumpingOperation
      : IMAGES.heroTruck;

  const serviceFAQs = useMemo(() => getServiceFAQs(service), [service]);

  return (
    <>
      <SEOHead
        title={service.seoTitle}
        description={service.metaDesc}
        canonicalPath={`/${service.slug}/`}
        schemaType="Service"
        serviceData={{
          name: service.name,
          description: service.shortDesc,
          areaServed: 'Greater Houston, TX',
        }}
        breadcrumbs={breadcrumbs}
      />
      <ImageSchema
        pageUrl={`/${service.slug}/`}
        images={{
          url: serviceImage.src,
          name: `${service.name} in Houston, TX - ${BUSINESS_CONFIG.brandName}`,
          caption: serviceImage.alt,
          description: `${service.headline} - ${service.shortDesc}`,
        }}
      />

      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={serviceImage.src}
            alt={serviceImage.alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <span>Houston Septic Service</span>
              <span aria-hidden="true">·</span>
              <span>Texas TCEQ Standards</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {service.headline}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {service.fullDesc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#quote-form"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-colors"
              >
                <span>Request {service.name} Quote</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={BUSINESS_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handlePhoneClick}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: {BUSINESS_CONFIG.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-10">
              {/* Service Overview & Practical Parameters */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Service Specifications & Pricing Guidelines
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-xs text-slate-500 block mb-1">Recommended Schedule:</span>
                    <span className="text-sm font-semibold text-slate-900">{service.frequency}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-xs text-slate-500 block mb-1">Estimated Cost Range:</span>
                    <span className="text-sm font-semibold text-emerald-700">{service.pricingEstimate}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  *Disclaimer: {BUSINESS_CONFIG.pricingTransparencyNotice}
                </p>
              </div>

              {/* Signs You Need This Service */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Signs Your Houston Property Requires {service.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Heavy rain and clay soils throughout Harris, Montgomery, and Fort Bend counties can accelerate drainage problems. Watch for these indicators:
                </p>

                <ul className="space-y-3 pt-2">
                  {service.commonSigns.map((sign, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-slate-700">{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Procedure */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  What to Expect During the Service Visit
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Our independent partner contractors follow standardized industry protocols to protect your landscaping and adhere to Texas environmental disposal laws.
                </p>

                <div className="space-y-4 pt-2">
                  {service.processSteps.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-4">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Area Linkage */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-slate-900">
                  Available Across All Houston Suburbs
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Partner pumping crews operate across all major regional hubs. Select your city to review specific soil and county guidelines:
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {SERVICE_AREAS.slice(0, 8).map((area) => (
                    <a
                      key={area.id}
                      href={`/service-areas/${area.slug}/`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`/service-areas/${area.slug}/`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors"
                    >
                      {area.name}, TX
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sticky Sidebar: Form & Dispatch Info */}
            <div className="lg:col-span-5 space-y-6" id="quote-form">
              <QuoteForm
                defaultService={service.name}
                title={`Request ${service.name}`}
                subtitle="We match your inquiry with an available licensed local contractor in your ZIP code."
              />

              {/* Trust Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 text-xs shadow-xs">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>The SepticProDirect Standard</span>
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>TCEQ Registered Sludge Transporter partners</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Quick response scheduling across Greater Houston</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Upfront quotes with no surprise disposal fees</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Service-Specific FAQ Section & JSON-LD FAQSchema */}
      <FAQSchema
        renderVisibleUI={true}
        items={serviceFAQs}
        title={`Frequently Asked Questions About ${service.name}`}
        subtitle={`Expert answers regarding ${service.name.toLowerCase()} costs, service intervals, and Texas TCEQ guidelines across Greater Houston.`}
        badgeText={`${service.name} Help Guide`}
        sectionId={`faq-${service.id}`}
      />
    </>
  );
}
