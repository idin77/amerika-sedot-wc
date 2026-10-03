import { MessageCircle, FileText } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

interface MobileStickyBarProps {
  onOpenQuote: () => void;
}

export function MobileStickyBar({ onOpenQuote }: MobileStickyBarProps) {
  const handleWhatsApp = () => {
    trackEvent('phone_click', {
      source: 'mobile_sticky_bar_whatsapp',
      phoneNumber: BUSINESS_CONFIG.phoneRaw,
    });
  };

  return (
    <aside 
      aria-label="Quick contact actions" 
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-2xl"
    >
      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
        <a
          href={BUSINESS_CONFIG.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs active:bg-emerald-800 transition-colors shadow-sm"
        >
          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">WhatsApp Chat</span>
        </a>

        <button
          type="button"
          onClick={() => {
            trackEvent('quote_form_started', { source: 'mobile_sticky_bar' });
            onOpenQuote();
          }}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs active:bg-slate-700 transition-colors shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Free Quote</span>
        </button>
      </div>
    </aside>
  );
}

