import { useState } from 'react';
import { 
  Phone, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Truck, 
  Calculator, 
  FileText,
  AlertTriangle,
  Wrench,
  Search,
  Droplets,
  MessageCircle
} from 'lucide-react';
import { BUSINESS_CONFIG, SERVICES, SERVICE_AREAS, FREQUENTLY_ASKED_QUESTIONS } from '../config/business';
import { IMAGES } from '../lib/images';
import { SEOHead } from '../components/SEOHead';
import { LocalBusinessSchema } from '../components/LocalBusinessSchema';
import { FAQAccordion } from '../components/FAQAccordion';
import { SepticMaintenanceBlog } from '../components/SepticMaintenanceBlog';
import { ReviewSchema } from '../components/ReviewSchema';
import { CustomerTestimonials } from '../components/CustomerTestimonials';
import { TestimonialSlider } from '../components/TestimonialSlider';
import { ServiceDemoVideo } from '../components/ServiceDemoVideo';
import { QuoteForm } from '../components/QuoteForm';
import { CostEstimatorModal } from '../components/CostEstimatorModal';
import { trackEvent } from '../lib/analytics';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [estimatorOpen, setEstimatorOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<{ size: string; estCost: string } | null>(null);

  const handlePhoneClick = () => {
    trackEvent('phone_click', {
      source: 'home_hero',
      phoneNumber: BUSINESS_CONFIG.phoneRaw,
    });
  };

  const serviceIcons: Record<string, any> = {
    pumping: Truck,
    cleaning: Droplets,
    inspection: Search,
    maintenance: Wrench,
    emergency: AlertTriangle,
  };

  return (
    <>
      <SEOHead
        title="Professional Septic Tank Pumping Houston TX | SepticProDirect"
        description="Connect with local septic service professionals for residential septic pumping, maintenance, and service requests in the Houston area."
        canonicalPath="/"
        schemaType="WebSite"
      />
      <LocalBusinessSchema />

      <CostEstimatorModal
        isOpen={estimatorOpen}
        onClose={() => setEstimatorOpen(false)}
        onSelectEstimate={(est) => setSelectedEstimate(est)}
      />

      {/* 1. Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.heroTruck.src}
            alt={IMAGES.heroTruck.alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Main Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              {/* Unboxed editorial kicker - Zero-pill discipline */}
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                <span>Greater Houston Septic Network</span>
                <span aria-hidden="true">·</span>
                <span>TCEQ Licensed Contractor Partners</span>
              </div>

              {/* Exact required headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
                Professional Septic Tank Pumping in Houston, TX
              </h1>

              {/* Exact required subheadline */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Connect with local septic service professionals for residential septic pumping, maintenance, and service requests in the Houston area.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <a
                  href="#quote-section"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('quote-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base shadow-md transition-all active:scale-95"
                >
                  <span>Request a Free Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={BUSINESS_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handlePhoneClick}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 transition-all backdrop-blur-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp: {BUSINESS_CONFIG.phoneDisplay}</span>
                </a>
              </div>

              {/* Quick Trust Attributes - Unboxed text with subtle typographic separators */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified Local Partners</span>
                </div>
                <span className="hidden sm:inline" aria-hidden="true">·</span>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Upfront Written Estimates</span>
                </div>
                <span className="hidden sm:inline" aria-hidden="true">·</span>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Residential & Aerobic</span>
                </div>
              </div>
            </div>

            {/* Right Col: Instant Quote Form Card */}
            <div className="lg:col-span-5" id="hero-form">
              <QuoteForm
                compact
                title="Get a Fast Local Quote"
                subtitle="Independent licensed technicians serving Harris, Fort Bend, and Montgomery counties."
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Verifiable Trust & Compliance Bar */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">TCEQ Compliance</h4>
                <p className="text-xs text-slate-600 mt-0.5">Partner pumpers follow strict Texas On-Site Sewage Facility environmental disposal rules.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Calculator className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Transparent Quotes</h4>
                <p className="text-xs text-slate-600 mt-0.5">Clear price ranges by tank gallon size. No surprise hidden sludge surcharges at completion.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Local Houston Pros</h4>
                <p className="text-xs text-slate-600 mt-0.5">Matched with contractors stationed near your specific neighborhood for prompt arrival.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Fast Booking Dispatch</h4>
                <p className="text-xs text-slate-600 mt-0.5">Online quote triage and telephone support Monday through Saturday across the metro.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Services Section */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                Comprehensive Onsite Wastewater Solutions
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Residential Septic Services in Greater Houston
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              From routine 3-year pump-outs to certified real estate inspections and urgent backup response.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, idx) => {
              const Icon = serviceIcons[service.id] || Truck;
              return (
                <div
                  key={service.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-slate-100 group-hover:bg-emerald-50 text-slate-800 group-hover:text-emerald-700 flex items-center justify-center mb-5 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="text-xs text-slate-400 font-mono mb-1">
                      0{idx + 1}. Service
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {service.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                      {service.shortDesc}
                    </p>

                    <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                      <div className="flex justify-between">
                        <span>Typical Frequency:</span>
                        <span className="font-medium text-slate-800">{service.frequency.split(' ')[0]} {service.frequency.split(' ')[1]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price Guideline:</span>
                        <span className="font-semibold text-slate-900">{service.pricingEstimate.split('(')[0]}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`/${service.slug}/`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/${service.slug}/`);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-emerald-700 transition-colors pt-2 group-hover:translate-x-1 duration-150"
                  >
                    <span>Read Service Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof: Verified Customer Reviews Carousel / Testimonial Slider */}
      <TestimonialSlider onNavigate={onNavigate} />

      {/* 4. How It Works Section */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
              Simple & Transparent Process
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
              How SepticProDirect Connects You with Local Pros
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We take the hassle out of finding reliable septic services. Three clear steps from your inquiry to a clean, professionally pumped tank.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-7 relative">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center mb-5">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Submit Your Request</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Fill out our quick quote form or call our dispatch desk with your address, tank size, and service needed.
              </p>
              <div className="text-xs text-slate-500 font-medium">
                Takes under 60 seconds
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-7 relative">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center mb-5">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Matched with a Local Partner</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                We review contractor routes and connect you with a verified, TCEQ-registered technician stationed in your area.
              </p>
              <div className="text-xs text-slate-500 font-medium">
                Upfront quotes before dispatch
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-7 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mb-5">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">On-Site Pumping & Completion</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                The licensed crew arrives with vacuum tanker equipment, evacuates sludge and scum, rinses the tank, and secures lids.
              </p>
              <div className="text-xs text-slate-500 font-medium">
                Full documentation & disposal receipt
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Field Walkthrough & Process Demonstration Video Loop */}
      <ServiceDemoVideo onNavigate={onNavigate} />

      {/* 5. Authentic Pricing Breakdown & Interactive Estimator Helper */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Fair & Predictable Pricing
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                What Determines Your Septic Pumping Cost?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                We believe in genuine transparency. Septic pumping prices are not a single flat gimmick because every home has different tank sizes, lid depths, and accessibility.
              </p>

              <div className="space-y-3 pt-2">
                {BUSINESS_CONFIG.typicalPriceRanges.map((tier) => (
                  <div
                    key={tier.size}
                    className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-sm sm:text-base text-white">{tier.size}</div>
                      <div className="text-xs text-slate-400">{tier.idealFor}</div>
                    </div>
                    <div className="font-extrabold text-lg sm:text-xl text-emerald-400 tabular-nums">
                      {tier.range}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  type="button"
                  onClick={() => setEstimatorOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Open Interactive Cost Estimator</span>
                </button>
                <span className="text-xs text-slate-400">
                  Calculates estimates including lid digging and filter service.
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-4 text-xs">
                <h3 className="font-bold text-white text-sm">Key Pricing Factors Explained:</h3>
                
                <div className="space-y-3 text-slate-300">
                  <div>
                    <strong className="text-white block mb-0.5">1. Tank Capacity:</strong>
                    Standard Houston suburban homes feature 1,000-gallon tanks. Larger residences with 4+ bedrooms typically have 1,250 or 1,500-gallon tanks requiring higher vacuum truck capacity.
                  </div>
                  <div>
                    <strong className="text-white block mb-0.5">2. Lid Exposure (Digging Labor):</strong>
                    If access manholes are covered with sod or buried over 12 inches deep, technicians charge a standard digging labor fee. You can uncover them yourself prior to arrival to save.
                  </div>
                  <div>
                    <strong className="text-white block mb-0.5">3. Distance from Driveway:</strong>
                    Heavy vacuum trucks must park on paved surfaces. Distances exceeding 100 feet may require extra suction hose extensions.
                  </div>
                  <div>
                    <strong className="text-white block mb-0.5">4. TCEQ Approved Disposal:</strong>
                    Texas state law mandates that septage be transported by registered haulers to approved municipal treatment facilities.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Visual Spotlight: Real Texas Field Operations */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              Field Operations & Quality Standards
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
              Professional Workmanship on Every Service Call
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Clean field execution, respectful property care, and full tank evacuation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-4/3 bg-slate-100">
              <img
                src={IMAGES.technicianInspection.src}
                alt={IMAGES.technicianInspection.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent p-5 text-white">
                <p className="text-xs font-medium text-slate-200">
                  Licensed technicians inspect baffles and measure sludge layers to diagnose overall septic health.
                </p>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-4/3 bg-slate-100">
              <img
                src={IMAGES.pumpingOperation.src}
                alt={IMAGES.pumpingOperation.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent p-5 text-white">
                <p className="text-xs font-medium text-slate-200">
                  Commercial vacuum hoses safely extract sludge and scum without damaging lawn sod or driveways.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Houston Service Areas Coverage Section */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                Regional Dispatch Network
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Service Areas in Greater Houston
              </h2>
            </div>
            <a
              href="/service-areas/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/service-areas/');
              }}
              className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-emerald-700 flex items-center gap-1 transition-colors"
            >
              <span>View all cities & ZIP codes</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SERVICE_AREAS.map((area) => (
              <a
                key={area.id}
                href={`/service-areas/${area.slug}/`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/service-areas/${area.slug}/`);
                }}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all block group"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {area.name}, TX
                  </h3>
                  <span className="text-[11px] text-slate-400">{area.state}</span>
                </div>
                <div className="text-xs text-slate-500 truncate mb-2">
                  {area.county}
                </div>
                <div className="text-[11px] text-slate-400">
                  {area.zipCodes.slice(0, 3).join(', ')}...
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Customer Testimonials & Verified Houston Homeowner Reviews with Star Ratings */}
      <CustomerTestimonials onNavigate={onNavigate} />

      {/* Review Schema: Injects JSON-LD structured data for Google SERP star ratings */}
      <ReviewSchema renderVisibleUI={false} />

      {/* 9. Interactive FAQ Accordion: Dynamically renders septic maintenance FAQs & injects JSON-LD FAQPage Schema */}
      <FAQAccordion
        title="Frequently Asked Questions About Septic Maintenance in Houston"
        subtitle="Transparent answers regarding tank pumping intervals, warning signs of full tanks, aerobic ATU care, and costs across Greater Houston."
        badgeText="Houston Septic Maintenance Guide"
        sectionId="home-faq-accordion"
      />

      {/* 10. Educational Knowledge Base & Texas TCEQ Septic Regulations Blog for Long-Tail SEO */}
      <SepticMaintenanceBlog onNavigate={onNavigate} />

      {/* 11. Dedicated Lead Form Section */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200" id="quote-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
              Ready for Service?
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Request Your Free Houston Septic Quote
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Tell us about your property and service needs. An independent local partner will contact you promptly with availability and upfront pricing.
            </p>
          </div>

          <QuoteForm
            title="Service Request Details"
            subtitle="No upfront payment required. Honest estimates before work starts."
          />
        </div>
      </section>

      {/* 10. Bottom Urgent Assistance Bar */}
      <section className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
              Need immediate answers or have a backup?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Speak with our dispatch desk to check real-time technician routes in your Houston neighborhood.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href={BUSINESS_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handlePhoneClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors tabular-nums"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {BUSINESS_CONFIG.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
