import { useEffect } from 'react';
import { BUSINESS_CONFIG, SERVICE_AREAS } from '../config/business';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  schemaType?: 'WebSite' | 'Service' | 'AboutPage' | 'ContactPage' | 'FAQPage' | 'LocalBusiness';
  serviceData?: {
    name: string;
    description: string;
    areaServed?: string;
  };
  breadcrumbs?: BreadcrumbItem[];
  faqItems?: { question: string; answer: string }[];
  includeLocalBusiness?: boolean;
}

export function SEOHead({
  title,
  description,
  canonicalPath = '',
  schemaType = 'WebSite',
  serviceData,
  breadcrumbs,
  faqItems,
  includeLocalBusiness = false,
}: SEOHeadProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Update OpenGraph Tags
    const updateOrCreateMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const updateOrCreateNameMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const fullUrl = `${window.location.origin}${canonicalPath}`;
    updateOrCreateMeta('og:title', title);
    updateOrCreateMeta('og:description', description);
    updateOrCreateMeta('og:url', fullUrl);
    updateOrCreateNameMeta('twitter:title', title);
    updateOrCreateNameMeta('twitter:description', description);

    // 4. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // 5. Inject Structured Data JSON-LD
    const jsonLdId = 'dynamic-json-ld';
    let scriptTag = document.getElementById(jsonLdId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = jsonLdId;
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const structuredData: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: BUSINESS_CONFIG.brandName,
        url: window.location.origin,
        description:
          'Independent marketing and dispatch network connecting Texas homeowners with verified, licensed local septic contractor partners.',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: BUSINESS_CONFIG.phoneRaw,
          contactType: 'customer support',
          areaServed: 'US-TX',
          availableLanguage: 'English',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: BUSINESS_CONFIG.brandName,
        url: window.location.origin,
      },
    ];

    // If Service
    if (schemaType === 'Service' && serviceData) {
      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: serviceData.name,
        description: serviceData.description,
        provider: {
          '@type': 'Organization',
          name: BUSINESS_CONFIG.brandName,
          url: window.location.origin,
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: serviceData.areaServed || 'Greater Houston Area, Texas',
        },
      });
    }

    // If Breadcrumbs
    if (breadcrumbs && breadcrumbs.length > 0) {
      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: `${window.location.origin}${b.url}`,
        })),
      });
    }

    // If LocalBusiness requested (e.g. Home and About pages)
    if (includeLocalBusiness || schemaType === 'LocalBusiness') {
      structuredData.push({
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'PlumbingService'],
        '@id': `${window.location.origin}/#localbusiness`,
        name: BUSINESS_CONFIG.brandName,
        legalName: BUSINESS_CONFIG.legalName,
        url: window.location.origin,
        telephone: BUSINESS_CONFIG.phoneRaw,
        email: BUSINESS_CONFIG.email,
        description:
          'Professional residential septic tank pumping, cleaning, inspection, and maintenance contractor dispatch network in Greater Houston, TX.',
        priceRange: '$$ ($325 - $725)',
        currenciesAccepted: 'USD',
        paymentAccepted: 'Cash, Credit Card, Check, Invoice',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Houston',
          addressRegion: 'TX',
          postalCode: '77002',
          addressCountry: 'US',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '29.7604',
          longitude: '-95.3698',
        },
        areaServed: [
          {
            '@type': 'AdministrativeArea',
            name: 'Greater Houston Metropolitan Area, TX',
          },
          ...SERVICE_AREAS.slice(0, 10).map((a) => ({
            '@type': 'City',
            name: `${a.name}, TX`,
          })),
        ],
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ],
            opens: '07:00',
            closes: '18:00',
          },
        ],
        sameAs: [BUSINESS_CONFIG.whatsappUrl],
      });
    }

    // If FAQ
    if (faqItems && faqItems.length > 0) {
      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      });
    }

    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      // Optional cleanup on unmount
    };
  }, [title, description, canonicalPath, schemaType, serviceData, breadcrumbs, faqItems, includeLocalBusiness]);

  return null;
}
