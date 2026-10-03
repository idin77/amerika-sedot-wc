import { BUSINESS_CONFIG } from '../config/business';
import { SEOHead } from '../components/SEOHead';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface PrivacyPolicyPageProps {
  onNavigate: (path: string) => void;
}

export function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
  const breadcrumbs = [{ name: 'Privacy Policy', url: '/privacy-policy/' }];

  return (
    <>
      <SEOHead
        title="Privacy Policy | SepticProDirect"
        description="Privacy policy and data protection disclosures for SepticProDirect. Learn how we handle your personal information and service requests."
        canonicalPath="/privacy-policy/"
        schemaType="WebSite"
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
            <p className="text-xs text-slate-500">
              Last Updated: October 2026 · Effective Date: October 2026
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Introduction & Scope</h2>
            <p>
              {BUSINESS_CONFIG.brandName} ("we," "our," or "us") operates an online marketing and contractor referral platform connecting residential homeowners with independent licensed septic contractor partners in Greater Houston, Texas. This Privacy Policy describes how we collect, use, and protect your personal information when you visit our website or submit a quote request.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Information We Collect</h2>
            <p>When you use our services or submit a quote request, we collect:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Contact Information:</strong> Full name, telephone number, and email address (optional).</li>
              <li><strong>Property & Service Details:</strong> Service address, ZIP code, property type, estimated septic tank capacity, and problem descriptions.</li>
              <li><strong>Technical Data:</strong> Browser user agent, IP address, device type, and referral URLs for security and anti-spam verification.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. How We Use Your Information</h2>
            <p>We use your information strictly for the following legitimate business purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>To connect your service inquiry with vetted, licensed local septic contractor partners in your Texas service area.</li>
              <li>To allow contractor partners to contact you with service availability and price quotes.</li>
              <li>To prevent fraudulent inquiries, spam, and bot abuse.</li>
              <li>To comply with applicable legal obligations and state recordkeeping standards.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Sharing & Disclosure of Personal Data</h2>
            <p>
              <strong>We do not sell, rent, or trade your personal data to unrelated marketing brokers.</strong> When you submit a quote request, you authorize us to transmit your contact details and service notes to independent local septic contractors servicing your ZIP code so they can provide estimates and arrange appointments.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Texas Data Privacy Rights (TDPSA)</h2>
            <p>
              Under Texas law and relevant consumer protection regulations, Texas residents have the right to request access to the personal data we hold about them, request correction of inaccuracies, or request the deletion of their personal data. To exercise these rights, email us at <a href={`mailto:${BUSINESS_CONFIG.email}`} className="text-emerald-700 font-semibold underline">{BUSINESS_CONFIG.email}</a>.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">6. Data Security & Storage</h2>
            <p>
              We implement industry-standard encryption protocols (HTTPS/TLS) and server security controls to protect information during transmission and storage. However, no internet transmission is 100% secure, and we encourage caution when transmitting sensitive data.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">7. Contact Information</h2>
            <p>
              For privacy-related questions or data deletion requests, contact our privacy compliance team:
            </p>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-700">
              <div><strong>{BUSINESS_CONFIG.legalName}</strong></div>
              <div>Email: {BUSINESS_CONFIG.email}</div>
              <div>Telephone: {BUSINESS_CONFIG.phoneDisplay}</div>
              <div>Location: Greater Houston, Texas, USA</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
