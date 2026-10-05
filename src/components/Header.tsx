import { useState } from 'react';
import { Phone, Menu, X, ArrowUpRight, MessageCircle } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';
import { EmergencyIndicator } from './EmergencyIndicator';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenQuoteModal?: () => void;
}

export function Header({ currentPath, onNavigate, onOpenQuoteModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Pumping', path: '/septic-tank-pumping-houston-tx/' },
    { label: 'Cleaning', path: '/septic-tank-cleaning-houston/' },
    { label: 'Inspection', path: '/septic-tank-inspection-houston/' },
    { label: 'Maintenance', path: '/septic-tank-maintenance-houston/' },
    { label: 'Service Areas', path: '/service-areas/' },
    { label: 'About', path: '/about-us/' },
  ];

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  const handlePhoneClick = () => {
    trackEvent('phone_click', {
      source: 'header',
      phoneNumber: BUSINESS_CONFIG.phoneRaw,
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark + Urgent Emergency Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="text-xl font-bold tracking-tight text-slate-900 hover:text-slate-700 transition-colors shrink-0"
          >
            {BUSINESS_CONFIG.brandName}
          </a>
          <EmergencyIndicator variant="pill" className="hidden sm:inline-flex" />
        </div>

        {/* Zone 2: 4–6 nav links, 1–2 word labels, single-line text with subtle underlines */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`whitespace-nowrap transition-colors relative py-1 ${
                  isActive
                    ? 'text-slate-900 font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1–2 primary actions */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={BUSINESS_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handlePhoneClick}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-emerald-700 transition-colors px-3 py-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span className="tabular-nums whitespace-nowrap">WhatsApp: {BUSINESS_CONFIG.phoneDisplay}</span>
          </a>

          <button
            onClick={() => {
              if (onOpenQuoteModal) {
                onOpenQuoteModal();
              } else {
                onNavigate('/request-a-quote/');
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95"
          >
            <span>Request Quote</span>
            <ArrowUpRight className="w-4 h-4 opacity-80" />
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="mb-3 pt-1">
            <EmergencyIndicator variant="pill" className="w-full justify-center py-2 text-xs" showPhone={true} />
          </div>
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <a
              href="/emergency-septic-service-houston/"
              onClick={(e) => handleLinkClick(e, '/emergency-septic-service-houston/')}
              className="px-3 py-2.5 rounded-md text-base font-medium text-amber-800 hover:bg-amber-50"
            >
              Emergency Septic Service
            </a>
            <a
              href="/contact/"
              onClick={(e) => handleLinkClick(e, '/contact/')}
              className="px-3 py-2.5 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Contact Us
            </a>
          </nav>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-3">
            <a
              href={BUSINESS_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handlePhoneClick}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-sm border border-emerald-200"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>WhatsApp: {BUSINESS_CONFIG.phoneDisplay}</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/request-a-quote/');
              }}
              className="w-full py-3 px-4 text-center rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800"
            >
              Request a Free Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
