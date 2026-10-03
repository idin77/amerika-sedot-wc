import { Shield, CheckCircle, Users, Scale, FileText, Phone, ArrowRight } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { SEOHead } from '../components/SEOHead';
import { LocalBusinessSchema } from '../components/LocalBusinessSchema';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface AboutUsPageProps {
  onNavigate: (path: string) => void;
}

export function AboutUsPage({ onNavigate }: AboutUsPageProps) {
  const breadcrumbs = [{ name: 'About Us', url: '/about-us/' }];

  return (
    <>
      <SEOHead
        title="About SepticProDirect | Transparent Septic Dispatch in Houston, TX"
        description="Learn about SepticProDirect: our mission, transparent contractor referral model, and commitment to connecting Houston homeowners with licensed local septic pumpers."
        canonicalPath="/about-us/"
        schemaType="AboutPage"
        breadcrumbs={breadcrumbs}
      />
      <LocalBusinessSchema
        customDescription="Learn about SepticProDirect, our transparent contractor referral and dispatch platform connecting Houston homeowners with licensed local septic pumpers."
      />

      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

      {/* Hero */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Our Business Model & Standards
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            About SepticProDirect
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connecting Houston homeowners with independent, verified, and licensed local septic service professionals with honesty and upfront pricing.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Mission */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Why We Created SepticProDirect
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              When a residential septic tank backs up or reaches its 3-year pumping interval, homeowners often find it frustrating to find a qualified technician. Many local pumpers are out in the field driving vacuum trucks, unable to answer phones or provide clear pricing schedules. Homeowners face voicemail dead-ends, confusing estimates, or untruthful flat-rate promotions that balloon once the truck arrives.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              <strong>SepticProDirect</strong> bridges this gap. We operate a streamlined digital marketing and customer dispatch platform focused exclusively on Greater Houston and surrounding Texas communities. We coordinate homeowner inquiries, gather property and tank specifications, and connect requests with verified, independent local contractors who are actively working routes in that specific neighborhood.
            </p>
          </div>

          {/* Full Transparency Disclosure */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <Scale className="w-6 h-6 text-emerald-600 shrink-0" />
              <h3 className="text-lg font-bold">Our Commitment to Full Transparency</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {BUSINESS_CONFIG.transparencyNotice}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>We never fabricate customer reviews or make false claims of owning fleets.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>All contractor partners are verified for active TCEQ sludge transporter registration.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Contractor partners provide written quotes prior to starting any on-site service.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Clear explanation of pricing factors (tank gallon capacity, lid digging depth).</span>
              </div>
            </div>
          </div>

          {/* Partner Standards */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Contractor Partner Vetting Criteria
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We hold our partner network to rigorous professional standards before routing homeowner requests:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">State Licensing</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Registered Sludge Transporter credentials and OSSF compliance with Texas Commission on Environmental Quality (TCEQ).
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Commercial Insurance</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Active commercial general liability and vehicle insurance to safeguard your residential landscaping and property.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Upfront Pricing</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Commitment to honest price ranges based on tank gallons, with zero bait-and-switch fees or unapproved charges.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="p-8 rounded-2xl bg-slate-900 text-white text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold">Have a Question or Need Service?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Our dispatch team is ready to connect you with an available licensed local contractor in Greater Houston.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/request-a-quote/')}
                className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
              >
                Request a Free Quote
              </button>
              <a
                href={BUSINESS_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors tabular-nums"
              >
                WhatsApp {BUSINESS_CONFIG.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
