export type AnalyticsEvent =
  | 'phone_click'
  | 'quote_request_submitted'
  | 'quote_form_started'
  | 'estimator_calculated'
  | 'service_viewed'
  | 'city_viewed'
  | 'map_area_click'
  | 'checklist_downloaded'
  | 'checklist_item_toggled'
  | 'checklist_reset'
  | 'blog_post_viewed'
  | 'emergency_alert_viewed'
  | 'emergency_alert_action_clicked';

interface EventProperties {
  location?: string;
  service?: string;
  source?: string;
  phoneNumber?: string;
  leadId?: string;
  city?: string;
  [key: string]: any;
}

export function trackEvent(event: AnalyticsEvent, properties?: EventProperties) {
  if (typeof window === 'undefined') return;

  // Safe dispatch to window.gtag if Google Analytics is configured
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', event, properties);
  }

  // Safe dispatch to Meta Pixel if configured
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('trackCustom', event, properties);
  }

  // Custom event dispatch for analytics listeners
  window.dispatchEvent(
    new CustomEvent('septic_pro_analytics', {
      detail: { event, properties, timestamp: Date.now() },
    })
  );

  // In development, log cleanly
  if (import.meta.env.DEV) {
    console.log(`[SepticProDirect Analytics] ${event}`, properties);
  }
}
