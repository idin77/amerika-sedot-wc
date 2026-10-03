import { Shield, Phone, Mail, MapPin, CheckCircle2, MessageCircle } from 'lucide-react';
import { BUSINESS_CONFIG, SERVICE_AREAS, SERVICES } from '../config/business';
import { trackEvent } from '../lib/analytics';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleLink = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  const handlePhoneClick = () => {
    trackEvent('phone_click', {
      source: 'footer',
      phoneNumber: BUSINESS_CONFIG.phoneRaw,
    });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Banner: Verification & TCEQ Notice */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-emerald-400 shrink-0" />
              <p className="text-xs sm:text-sm text-slate-300">
                <span className="font-semibold text-white">Texas Regulatory Compliance:</span> All field services are performed by independent, licensed OSSF professionals registered with the TCEQ.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Independent Contractor Matching Network</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Model Overview */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href="/"
              onClick={(e) => handleLink(e, '/')}
              className="text-2xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors inline-block"
            >
              {BUSINESS_CONFIG.brandName}
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Connecting homeowners in Greater Houston with verified, licensed, and insured local septic pumping contractors. Reliable residential service, transparent pricing, and prompt dispatch.
            </p>
            <div className="pt-2 space-y-2">
              <a
                href={BUSINESS_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handlePhoneClick}
                className="flex items-center gap-3 text-white hover:text-emerald-400 transition-colors group"
              >
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center group-hover:bg-emerald-950 transition-colors">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">WhatsApp Inquiries & Dispatch</div>
                  <div className="font-bold text-sm tabular-nums">{BUSINESS_CONFIG.phoneDisplay}</div>
                </div>
              </a>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Primary Coverage Area</div>
                  <div className="text-sm font-medium">Houston, Texas & Surrounding Counties</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Inquiry Email</div>
                  <div className="text-sm font-medium">{BUSINESS_CONFIG.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Septic Services</h4>
            <ul className="space-y-2 text-sm">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a
                    href={`/${s.slug}/`}
                    onClick={(e) => handleLink(e, `/${s.slug}/`)}
                    className="hover:text-emerald-400 transition-colors block py-0.5"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/request-a-quote/"
                  onClick={(e) => handleLink(e, '/request-a-quote/')}
                  className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors block py-0.5"
                >
                  Request a Free Quote
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Service Areas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Houston Service Areas</h4>
            <ul className="space-y-1.5 text-sm">
              {SERVICE_AREAS.slice(0, 7).map((area) => (
                <li key={area.id}>
                  <a
                    href={`/service-areas/${area.slug}/`}
                    onClick={(e) => handleLink(e, `/service-areas/${area.slug}/`)}
                    className="hover:text-emerald-400 transition-colors block py-0.5"
                  >
                    {area.name}, TX Septic
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/service-areas/"
                  onClick={(e) => handleLink(e, '/service-areas/')}
                  className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors block pt-1"
                >
                  View All Service Areas →
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Company & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/about-us/"
                  onClick={(e) => handleLink(e, '/about-us/')}
                  className="hover:text-emerald-400 transition-colors block py-0.5"
                >
                  About SepticProDirect
                </a>
              </li>
              <li>
                <a
                  href="/contact/"
                  onClick={(e) => handleLink(e, '/contact/')}
                  className="hover:text-emerald-400 transition-colors block py-0.5"
                >
                  Contact & Dispatch Info
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy/"
                  onClick={(e) => handleLink(e, '/privacy-policy/')}
                  className="hover:text-emerald-400 transition-colors block py-0.5"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-service/"
                  onClick={(e) => handleLink(e, '/terms-of-service/')}
                  className="hover:text-emerald-400 transition-colors block py-0.5"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/sitemap/"
                  onClick={(e) => handleLink(e, '/sitemap/')}
                  className="hover:text-emerald-400 transition-colors block py-0.5"
                >
                  HTML Sitemap
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-emerald-400 transition-colors block py-0.5"
                >
                  XML Sitemap (Crawler)
                </a>
              </li>
            </ul>

            <div className="pt-3">
              <span className="text-xs text-slate-400 block mb-1">Office Hours:</span>
              <p className="text-xs text-slate-300">
                Monday – Saturday: 7:00 AM – 6:00 PM CST<br />
                Emergency requests routed to on-call partners.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed">
          <p className="mb-3">
            <strong className="text-slate-300">Consumer Notice & Business Disclosure:</strong> {BUSINESS_CONFIG.transparencyNotice} {BUSINESS_CONFIG.pricingTransparencyNotice}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-900 text-slate-400 text-xs">
            <div>
              © {new Date().getFullYear()} {BUSINESS_CONFIG.brandName}. All rights reserved. Serving Greater Houston, TX.
            </div>
            <div className="flex items-center gap-4 text-xs">
              <a href="/privacy-policy/" onClick={(e) => handleLink(e, '/privacy-policy/')} className="hover:text-slate-300">Privacy</a>
              <span>·</span>
              <a href="/terms-of-service/" onClick={(e) => handleLink(e, '/terms-of-service/')} className="hover:text-slate-300">Terms</a>
              <span>·</span>
              <a href="/sitemap/" onClick={(e) => handleLink(e, '/sitemap/')} className="hover:text-slate-300">Sitemap</a>
              <span>·</span>
              <a href="/contact/" onClick={(e) => handleLink(e, '/contact/')} className="hover:text-slate-300">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
