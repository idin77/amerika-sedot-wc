import { useMemo } from 'react';
import { Phone, ArrowRight, ShieldCheck, MapPin, CheckCircle, Info, MessageCircle } from 'lucide-react';
import { CityArea } from '../types';
import { BUSINESS_CONFIG, SERVICES } from '../config/business';
import { IMAGES } from '../lib/images';
import { SEOHead } from '../components/SEOHead';
import { FAQSchema } from '../components/FAQSchema';
import { getCityFAQs } from '../lib/faqData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { QuoteForm } from '../components/QuoteForm';
import { trackEvent } from '../lib/analytics';

interface CityPageProps {
  city: CityArea;
  onNavigate: (path: string) => void;
}

export function CityPage({ city, onNavigate }: CityPageProps) {
  const cityFAQs = useMemo(() => getCityFAQs(city), [city]);

  const handlePhoneClick = () => {
    trackEvent('phone_click', {
      source: `city_page_${city.id}`,
      city: city.name,
      phoneNumber: BUSINESS_CONFIG.phoneRaw,
    });
  };

  const breadcrumbs = [
    { name: 'Service Areas', url: '/service-areas/' },
    { name: `${city.name}, TX`, url: `/service-areas/${city.slug}/` },
  ];

  return (
    <>
      <SEOHead
        title={`Septic Tank Pumping ${city.name} TX | Local Service & Cleaning | SepticProDirect`}
        description={city.metaDesc}
        canonicalPath={`/service-areas/${city.slug}/`}
        schemaType="Service"
        serviceData={{
          name: `Septic Tank Pumping in ${city.name}, TX`,
          description: `Residential septic tank pumping, cleaning, inspection, and maintenance in ${city.name}, ${city.state}.`,
          areaServed: `${city.name}, ${city.county}, TX`,
        }}
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

      {/* Hero */}
      <section className="bg-slate-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.houstonHome.src}
            alt={IMAGES.houstonHome.alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <span>{city.county}</span>
              <span aria-hidden="true">·</span>
              <span>Local Partner Dispatch</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Septic Tank Pumping in {city.name}, TX
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Connect with vetted, licensed local septic pumping contractor partners serving residential and acreage properties throughout {city.name} and surrounding neighborhoods.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#city-quote-form"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-colors"
              >
                <span>Request {city.name} Free Quote</span>
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
            {/* Left Column: Local Soil, Regulations & Service Details */}
            <div className="lg:col-span-7 space-y-10">
              {/* Local Area Profile */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Septic System Care in {city.name}: Local Soil & Engineering Realities
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Proper septic maintenance in {city.name} requires an understanding of local topography and climate. Because {city.name} lies within {city.county}, onsite sewage facilities (OSSF) face unique operating conditions:
                </p>

                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-1">
                      Local Soil Composition & Absorption
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {city.soilNotes} During intense Texas Gulf rainstorms, saturated soil can slow drainfield absorption, making regular 3-to-5-year solid extraction critical to avoid household backups.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-1">
                      Prevalent Onsite System Configurations
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {city.systemTypes}. Aerobic treatment units (ATUs) require periodic trash-tank pumping and chlorine tablet disinfection, while conventional dual-compartment tanks focus on sludge extraction.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-1">
                      {city.name} ZIP Codes Served
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 font-mono">
                      {city.zipCodes.join(' · ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Available Services in City */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Septic Services Offered in {city.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {SERVICES.map((s) => (
                    <div key={s.id} className="p-4 rounded-lg border border-slate-200 bg-white">
                      <h3 className="font-bold text-sm text-slate-900 mb-1">{s.name}</h3>
                      <p className="text-xs text-slate-600 mb-2">{s.shortDesc}</p>
                      <a
                        href={`/${s.slug}/`}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(`/${s.slug}/`);
                        }}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                      >
                        <span>Learn more</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Contractor Dispatch Note */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>{city.name} Dispatch Coverage</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {city.dispatchNote}
                </p>
                <div className="pt-2 text-xs text-slate-500">
                  All work is performed by independent, licensed OSSF contractors holding valid registrations with the Texas Commission on Environmental Quality (TCEQ).
                </div>
              </div>
            </div>

            {/* Right Column: Quote Form Pre-filled */}
            <div className="lg:col-span-5 space-y-6" id="city-quote-form">
              <QuoteForm
                defaultZip={city.zipCodes[0]}
                title={`Get a Quote in ${city.name}`}
                subtitle={`We match your service request with an available licensed local contractor in ${city.name}, TX.`}
              />

              <div className="bg-white border border-slate-200 rounded-xl p-5 text-xs text-slate-600 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Transparent Upfront Pricing</span>
                </div>
                <p className="leading-relaxed">
                  Technicians provide full written pricing breakdowns before lowering suction hoses. Pumping costs in {city.name} typically range between $375 and $650 for standard 1,000-gallon tanks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic City-Specific FAQ Section & JSON-LD FAQSchema */}
      <FAQSchema
        renderVisibleUI={true}
        items={cityFAQs}
        title={`Frequently Asked Questions About Septic Service in ${city.name}`}
        subtitle={`Local insights on ${city.name} soil percolation, Texas TCEQ septic hauler compliance, system pricing, and emergency dispatch.`}
        badgeText={`${city.name}, TX Septic FAQ`}
        sectionId={`faq-${city.id}`}
      />
    </>
  );
}
