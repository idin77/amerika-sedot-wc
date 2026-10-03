import { useEffect } from 'react';
import { BUSINESS_CONFIG, SERVICE_AREAS } from '../config/business';

interface LocalBusinessSchemaProps {
  customDescription?: string;
}

/**
 * Reusable SEO component that injects Schema.org LocalBusiness / PlumbingService
 * JSON-LD structured data into the document head using details defined in config/business.
 */
export function LocalBusinessSchema({ customDescription }: LocalBusinessSchemaProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const SCRIPT_ID = 'jsonld-local-business-schema';
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = SCRIPT_ID;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const currentOrigin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : BUSINESS_CONFIG.domain;

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'PlumbingService'],
      '@id': `${currentOrigin}/#localbusiness`,
      name: BUSINESS_CONFIG.brandName,
      legalName: BUSINESS_CONFIG.legalName,
      url: currentOrigin,
      telephone: BUSINESS_CONFIG.phoneRaw,
      email: BUSINESS_CONFIG.email,
      description:
        customDescription ||
        'Professional residential septic tank pumping, cleaning, inspection, and maintenance marketing and contractor dispatch network in Greater Houston, TX.',
      priceRange: '$$ ($325 - $725)',
      currenciesAccepted: BUSINESS_CONFIG.currency,
      paymentAccepted: 'Cash, Credit Card, Check, Invoice',
      address: {
        '@type': 'PostalAddress',
        addressLocality: BUSINESS_CONFIG.primaryCity,
        addressRegion: BUSINESS_CONFIG.state,
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
          name: BUSINESS_CONFIG.targetMarket,
        },
        ...SERVICE_AREAS.map((city) => ({
          '@type': 'City',
          name: `${city.name}, TX`,
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
    };

    scriptTag.textContent = JSON.stringify(schemaData, null, 2);

    return () => {
      // Remove tag when leaving the page if necessary
      const tagToRemove = document.getElementById(SCRIPT_ID);
      if (tagToRemove && tagToRemove.parentNode) {
        tagToRemove.parentNode.removeChild(tagToRemove);
      }
    };
  }, [customDescription]);

  return null;
}
