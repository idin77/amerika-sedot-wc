import { useEffect, useRef } from 'react';
import { trackEvent } from '../lib/analytics';

export interface CampaignAttribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  landingPage: string;
  referrer: string;
  firstTouchTimestamp: number;
}

export interface LeadConversionPayload {
  leadId: string;
  service?: string;
  zipCode?: string;
  propertyType?: string;
  tankSizeEstimated?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  value?: number;
  currency?: string;
  sourceUrl?: string;
  conversionType: 'quote_form_submission' | 'phone_call_click' | 'whatsapp_click' | 'cost_estimator';
  attribution?: CampaignAttribution;
  timestamp: string;
}

export interface ButtonClickPayload {
  buttonText: string;
  buttonType: 'phone' | 'whatsapp' | 'cta_quote' | 'cta_estimate' | 'navigation';
  targetUrl?: string;
  currentPath: string;
  timestamp: string;
}

const STORAGE_KEY = 'septic_pro_campaign_attribution';

/**
 * Parses and persists URL UTM parameters and Click IDs into sessionStorage
 */
export function getOrCreateCampaignAttribution(): CampaignAttribution {
  if (typeof window === 'undefined') {
    return {
      landingPage: '/',
      referrer: '',
      firstTouchTimestamp: Date.now(),
    };
  }

  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // Ignore storage parse issues
  }

  const searchParams = new URLSearchParams(window.location.search);
  const attribution: CampaignAttribution = {
    utmSource: searchParams.get('utm_source') || undefined,
    utmMedium: searchParams.get('utm_medium') || undefined,
    utmCampaign: searchParams.get('utm_campaign') || undefined,
    utmTerm: searchParams.get('utm_term') || undefined,
    utmContent: searchParams.get('utm_content') || undefined,
    gclid: searchParams.get('gclid') || undefined,
    fbclid: searchParams.get('fbclid') || undefined,
    landingPage: window.location.pathname + window.location.search,
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    firstTouchTimestamp: Date.now(),
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch (e) {
    // Ignore storage quota issues
  }

  return attribution;
}

/**
 * Sends conversion payload to both Google Analytics and the backend Lead Notification Webhook
 */
export async function dispatchConversionToAnalyticsAndWebhook(
  payload: LeadConversionPayload,
  customWebhookUrl?: string
): Promise<void> {
  const attribution = payload.attribution || getOrCreateCampaignAttribution();
  const enrichedPayload: LeadConversionPayload = {
    ...payload,
    attribution,
    sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
    timestamp: new Date().toISOString(),
  };

  // 1. Google Analytics (GA4) Tracking
  if (typeof window !== 'undefined') {
    const win = window as any;

    if (typeof win.gtag === 'function') {
      // Official GA4 Lead Generation Event
      win.gtag('event', 'generate_lead', {
        value: enrichedPayload.value || 450, // Average Houston septic pumping ticket ($450)
        currency: enrichedPayload.currency || 'USD',
        transaction_id: enrichedPayload.leadId,
        lead_id: enrichedPayload.leadId,
        service_category: enrichedPayload.service || 'Septic Pumping',
        zip_code: enrichedPayload.zipCode,
        campaign_source: attribution.utmSource,
        campaign_name: attribution.utmCampaign,
        traffic_medium: attribution.utmMedium,
      });

      // Secondary Conversion Event for Google Ads import
      win.gtag('event', 'conversion', {
        send_to: win.__GA_CONVERSION_ID || undefined,
        value: enrichedPayload.value || 450,
        currency: 'USD',
        transaction_id: enrichedPayload.leadId,
      });
    }

    // Meta Pixel (if configured)
    if (typeof win.fbq === 'function') {
      win.fbq('track', 'Lead', {
        content_name: enrichedPayload.service,
        content_category: 'Septic Services',
        value: enrichedPayload.value || 450,
        currency: 'USD',
      });
    }
  }

  // 2. Lead Notification Webhook Dispatch (via server proxy endpoint to protect endpoints)
  try {
    const endpoint = '/api/track-conversion';
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'lead_conversion',
        ...enrichedPayload,
      }),
    });
  } catch (err) {
    console.warn('[LeadConversionTracker] Server webhook relay failed, attempting direct fallback if configured:', err);
  }

  // Optional direct webhook dispatch if a client webhook URL was provided
  if (customWebhookUrl) {
    try {
      await fetch(customWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'lead_conversion',
          ...enrichedPayload,
        }),
      });
    } catch (err) {
      console.error('[LeadConversionTracker] Direct webhook dispatch error:', err);
    }
  }
}

/**
 * Sends button click telemetry to Google Analytics and server analytics
 */
export function dispatchButtonClickToAnalytics(payload: ButtonClickPayload): void {
  const attribution = getOrCreateCampaignAttribution();

  if (typeof window !== 'undefined') {
    const win = window as any;

    if (typeof win.gtag === 'function') {
      win.gtag('event', 'click', {
        event_category: 'CTA Button',
        event_label: payload.buttonText,
        button_type: payload.buttonType,
        target_url: payload.targetUrl,
        page_location: payload.currentPath,
        campaign_source: attribution.utmSource,
      });

      // If it's a direct phone or WhatsApp lead interaction, track as contact conversion
      if (payload.buttonType === 'phone' || payload.buttonType === 'whatsapp') {
        win.gtag('event', 'contact', {
          method: payload.buttonType,
          target: payload.targetUrl,
          page_location: payload.currentPath,
        });
      }
    }
  }

  // Also send lightweight beacon/event to server endpoint for campaign analytics
  try {
    fetch('/api/track-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'button_click',
        ...payload,
        attribution,
      }),
    }).catch(() => {});
  } catch (e) {
    // Ignore async beacon errors
  }
}

interface LeadConversionTrackerProps {
  gaMeasurementId?: string;
  webhookUrl?: string;
  debug?: boolean;
}

/**
 * LeadConversionTracker Component:
 * Tracks successful QuoteForm submissions, phone call clicks, WhatsApp taps, and CTA button clicks.
 * Relays conversion events to Google Analytics (GA4) and forwards lead payloads to the Lead Notification Webhook.
 * Preserves UTM campaign attribution parameters across multi-page user journeys.
 */
export function LeadConversionTracker({
  gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID,
  webhookUrl = import.meta.env.VITE_LEAD_WEBHOOK_URL,
  debug = false,
}: LeadConversionTrackerProps) {
  const initialized = useRef(false);

  useEffect(() => {
    // 1. Initialize UTM Campaign Attribution on Mount
    const attribution = getOrCreateCampaignAttribution();
    if (debug) {
      console.log('[LeadConversionTracker] Active Attribution:', attribution);
    }

    // 2. Dynamically Inject Google Analytics Script if Measurement ID is provided
    if (gaMeasurementId && typeof document !== 'undefined') {
      const scriptId = 'google-analytics-gtag';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
        document.head.appendChild(script);

        const inlineScript = document.createElement('script');
        inlineScript.id = 'google-analytics-inline';
        inlineScript.textContent = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaMeasurementId}', {
            send_page_view: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        `;
        document.head.appendChild(inlineScript);
      }
    }

    if (initialized.current) return;
    initialized.current = true;

    // 3. Listen to Custom Event Bus ('septic_pro_analytics')
    const handleAnalyticsEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        event: string;
        properties: any;
        timestamp: number;
      }>;

      if (!customEvent.detail) return;
      const { event, properties } = customEvent.detail;

      // Handle successful quote submissions
      if (event === 'quote_request_submitted') {
        const leadPayload: LeadConversionPayload = {
          leadId: properties.leadId || `SPD-HOU-${Math.floor(100000 + Math.random() * 900000)}`,
          service: properties.service,
          zipCode: properties.zipCode,
          propertyType: properties.propertyType,
          tankSizeEstimated: properties.tankSizeEstimated,
          fullName: properties.fullName,
          phone: properties.phone,
          email: properties.email,
          value: 450, // Standard Houston pumping conversion value
          currency: 'USD',
          conversionType: 'quote_form_submission',
          timestamp: new Date().toISOString(),
        };

        dispatchConversionToAnalyticsAndWebhook(leadPayload, webhookUrl);

        if (debug) {
          console.log('[LeadConversionTracker] Quote Submission Converted & Dispatched:', leadPayload);
        }
      }

      // Handle phone clicks
      if (event === 'phone_click') {
        dispatchButtonClickToAnalytics({
          buttonText: `Call Phone: ${properties.phoneNumber || 'Main Line'}`,
          buttonType: 'phone',
          targetUrl: properties.phoneNumber,
          currentPath: window.location.pathname,
          timestamp: new Date().toISOString(),
        });
      }

      // Handle cost estimator calculations
      if (event === 'estimator_calculated') {
        dispatchButtonClickToAnalytics({
          buttonText: `Calculated Estimate: ${properties.tankSize || 'Unknown Tank'}`,
          buttonType: 'cta_estimate',
          targetUrl: properties.estCost,
          currentPath: window.location.pathname,
          timestamp: new Date().toISOString(),
        });
      }
    };

    window.addEventListener('septic_pro_analytics', handleAnalyticsEvent);

    // 4. Delegated Click Listener for Phone, WhatsApp, and Primary Action Buttons
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Find nearest anchor or button element
      const interactiveEl = target.closest('a, button');
      if (!interactiveEl) return;

      const href = interactiveEl.getAttribute('href') || '';
      const text = (interactiveEl.textContent || '').trim().replace(/\s+/g, ' ');

      // A. Phone call clicks (tel:)
      if (href.startsWith('tel:')) {
        dispatchButtonClickToAnalytics({
          buttonText: text || 'Click to Call',
          buttonType: 'phone',
          targetUrl: href,
          currentPath: window.location.pathname,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // B. WhatsApp clicks
      if (href.includes('whatsapp') || href.includes('wa.me')) {
        dispatchButtonClickToAnalytics({
          buttonText: text || 'WhatsApp Chat',
          buttonType: 'whatsapp',
          targetUrl: href,
          currentPath: window.location.pathname,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // C. High-intent CTA buttons
      const isQuoteCta =
        href.includes('quote') ||
        interactiveEl.hasAttribute('data-track-quote') ||
        /request.*quote|get.*quote|free.*estimate|claim.*estimate|book.*now/i.test(text);

      if (isQuoteCta && (interactiveEl.tagName === 'BUTTON' || href.startsWith('#') || href.includes('quote'))) {
        dispatchButtonClickToAnalytics({
          buttonText: text || 'Request Quote CTA',
          buttonType: 'cta_quote',
          targetUrl: href || '#quote-form',
          currentPath: window.location.pathname,
          timestamp: new Date().toISOString(),
        });
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });

    return () => {
      window.removeEventListener('septic_pro_analytics', handleAnalyticsEvent);
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [gaMeasurementId, webhookUrl, debug]);

  return null;
}
