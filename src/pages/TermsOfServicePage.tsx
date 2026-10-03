import { BUSINESS_CONFIG } from '../config/business';
import { SEOHead } from '../components/SEOHead';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface TermsOfServicePageProps {
  onNavigate: (path: string) => void;
}

export function TermsOfServicePage({ onNavigate }: TermsOfServicePageProps) {
  const breadcrumbs = [{ name: 'Terms of Service', url: '/terms-of-service/' }];

  return (
    <>
      <SEOHead
        title="Terms of Service | SepticProDirect"
        description="Terms of Service and user agreement for SepticProDirect. Understand our dispatch platform rules, contractor relationships, and estimate policies."
        canonicalPath="/terms-of-service/"
        schemaType="WebSite"
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Terms of Service</h1>
            <p className="text-xs text-slate-500">
              Last Updated: October 2026 · Effective Date: October 2026
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing {BUSINESS_CONFIG.brandName} or submitting a quote request, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or referral services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Independent Contractor Dispatch Model</h2>
            <p>
              {BUSINESS_CONFIG.brandName} operates strictly as a lead generation, digital marketing, and dispatch coordination platform. <strong>We do not directly provide physical on-site septic tank pumping, excavation, cleaning, or plumbing services.</strong>
            </p>
            <p>
              All physical septic pumping, inspections, cleaning, and repairs are performed by independent local contractor partners. These contractors are independent businesses and are not agents, employees, or joint venturers of {BUSINESS_CONFIG.brandName}.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Quotes & Estimates Non-Binding</h2>
            <p>
              Any pricing ranges, calculator estimates, or ballpark figures displayed on this website or discussed via telephone are informational estimates only. Because underground septic systems cannot be fully evaluated without uncovering the access lids and measuring solid levels, all final pricing is determined and agreed upon directly between the homeowner and the on-site contractor before work begins.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. User Obligations & Property Access</h2>
            <p>
              You agree to provide accurate information regarding your property address, contact details, and system history. It is the homeowner's responsibility to provide safe, clear access from the driveway to the septic tank and to disclose any known underground hazards, buried utilities, or sprinkler lines.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable Texas law, {BUSINESS_CONFIG.brandName} shall not be liable for any direct, indirect, incidental, punitive, or consequential damages resulting from the physical work, omissions, delays, property damage, or disputes arising between you and an independent contractor partner.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">6. Governing Law & Jurisdiction</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of law principles. Any legal action or proceeding arising under these Terms shall be instituted exclusively in the state courts of Harris County, Texas.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">7. Contact Information</h2>
            <p>
              For questions regarding these Terms of Service:
            </p>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-700">
              <div><strong>{BUSINESS_CONFIG.legalName}</strong></div>
              <div>Email: {BUSINESS_CONFIG.email}</div>
              <div>Telephone: {BUSINESS_CONFIG.phoneDisplay}</div>
              <div>Greater Houston, Texas, USA</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
