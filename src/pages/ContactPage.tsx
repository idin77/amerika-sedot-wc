import { Phone, Mail, Clock, MapPin, ShieldCheck, MessageCircle } from 'lucide-react';
import { BUSINESS_CONFIG, SERVICE_AREAS } from '../config/business';
import { SEOHead } from '../components/SEOHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { QuoteForm } from '../components/QuoteForm';
import { trackEvent } from '../lib/analytics';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const handlePhoneClick = () => {
    trackEvent('phone_click', {
      source: 'contact_page',
      phoneNumber: BUSINESS_CONFIG.phoneRaw,
    });
  };

  const breadcrumbs = [{ name: 'Contact', url: '/contact/' }];

  return (
    <>
      <SEOHead
        title="Contact SepticProDirect | Houston TX Septic Service & Dispatch"
        description="Contact SepticProDirect for residential septic tank pumping, cleaning, and inspections in Houston, TX. Speak with our dispatch desk or submit an inquiry online."
        canonicalPath="/contact/"
        schemaType="ContactPage"
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

      {/* Hero */}
      <section className="bg-slate-900 text-white py-14 sm:py-18">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            We Are Here to Assist
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Contact SepticProDirect
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Need pricing estimates, partner scheduling, or service information for your Houston area property? Get in touch with our team today.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Col: Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 space-y-6 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900">
                  Direct Inquiries & Dispatch
                </h2>

                <div className="space-y-4">
                  <a
                    href={BUSINESS_CONFIG.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handlePhoneClick}
                    className="flex items-start gap-4 p-4 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:bg-emerald-700 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-800 font-semibold">WhatsApp & Telephone Dispatch</div>
                      <div className="text-base font-bold text-slate-900 tabular-nums">
                        {BUSINESS_CONFIG.phoneDisplay}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Click to chat directly on WhatsApp</div>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Email Inquiries</div>
                      <div className="text-sm font-semibold text-slate-900">
                        {BUSINESS_CONFIG.email}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Response within 24 business hours</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Service Coverage Region</div>
                      <div className="text-sm font-semibold text-slate-900">
                        Greater Houston Metropolitan Area
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Harris, Fort Bend, Montgomery, Brazoria, and Galveston counties
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 leading-relaxed space-y-2">
                  <p>
                    <strong className="text-slate-800">Dispatch Transparency Notice:</strong> {BUSINESS_CONFIG.transparencyNotice}
                  </p>
                </div>
              </div>

              {/* Houston Suburbs Quick List */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-xs text-slate-600 shadow-xs">
                <span className="font-bold text-slate-900 block mb-2">Primary Communities Served:</span>
                <div className="flex flex-wrap gap-1.5">
                  {SERVICE_AREAS.map((a) => (
                    <span key={a.id} className="text-slate-700 bg-slate-100 px-2 py-1 rounded">
                      {a.name}, TX
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Quote & Message Form */}
            <div className="lg:col-span-7">
              <QuoteForm
                title="Send a Service Inquiry"
                subtitle="Provide your address and tank details to receive a free, no-obligation quote from an available local contractor."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
