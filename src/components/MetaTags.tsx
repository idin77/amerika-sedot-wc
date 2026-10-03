import { useEffect } from 'react';
import { BUSINESS_CONFIG, SERVICES, SERVICE_AREAS } from '../config/business';

export interface MetaTagsProps {
  currentPath?: string;
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'business.business';
}

interface RouteMetaData {
  title: string;
  description: string;
  canonicalPath: string;
}

/**
 * Resolves unique, SEO-friendly meta title and description for any given path in the app.
 */
export function getRouteMetaData(pathname: string): RouteMetaData {
  const cleanPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : BUSINESS_CONFIG.domain;

  // 1. Home Root
  if (cleanPath === '/' || cleanPath === '') {
    return {
      title: 'Professional Septic Tank Pumping Houston TX | SepticProDirect',
      description:
        'Connect with licensed local septic service professionals for residential septic pumping, cleaning, inspection, and emergency dispatch across Greater Houston, TX.',
      canonicalPath: '/',
    };
  }

  // 2. Specific Service Pages (e.g., /septic-tank-pumping-houston-tx/)
  const matchedService = SERVICES.find((s) => {
    const sSlug = s.slug.replace(/^\/+|\/+$/g, '');
    const pSlug = cleanPath.replace(/^\/+|\/+$/g, '');
    return sSlug === pSlug;
  });

  if (matchedService) {
    return {
      title: matchedService.seoTitle,
      description: matchedService.metaDesc,
      canonicalPath: `/${matchedService.slug}/`,
    };
  }

  // 3. Service Areas Directory
  if (cleanPath === '/service-areas/') {
    return {
      title: 'Septic Tank Pumping Service Areas in Greater Houston, TX | SepticProDirect',
      description:
        'Find professional residential septic tank pumping and cleaning services across Houston, Katy, Sugar Land, The Woodlands, Pearland, Cypress, and surrounding Texas cities.',
      canonicalPath: '/service-areas/',
    };
  }

  // 4. Individual City Pages (e.g., /service-areas/katy-tx/)
  const cityMatch = cleanPath.match(/^\/service-areas\/([^/]+)\/?$/);
  if (cityMatch) {
    const citySlug = cityMatch[1];
    const matchedCity = SERVICE_AREAS.find(
      (c) => c.slug === citySlug || c.id === citySlug.replace('-tx', '')
    );

    if (matchedCity) {
      return {
        title: `Septic Tank Pumping in ${matchedCity.name}, TX | Local Service & Cleaning | SepticProDirect`,
        description:
          matchedCity.metaDesc ||
          `Professional residential septic tank pumping, cleaning, and inspections in ${matchedCity.name}, TX. Connect with trusted licensed pumpers in ${matchedCity.county}.`,
        canonicalPath: `/service-areas/${matchedCity.slug}/`,
      };
    }
  }

  // 5. About Us
  if (cleanPath === '/about-us/') {
    return {
      title: 'About SepticProDirect | Transparent Septic Dispatch in Houston, TX',
      description:
        'Learn about SepticProDirect: our mission, transparent contractor referral model, and commitment to connecting Houston homeowners with licensed local septic pumpers.',
      canonicalPath: '/about-us/',
    };
  }

  // 6. Contact
  if (cleanPath === '/contact/') {
    return {
      title: 'Contact SepticProDirect | Houston TX Septic Service & Dispatch',
      description:
        'Contact SepticProDirect for residential septic tank pumping, cleaning, and inspections in Houston, TX. Speak with our dispatch desk or submit an inquiry online.',
      canonicalPath: '/contact/',
    };
  }

  // 7. Request a Quote
  if (cleanPath === '/request-a-quote/') {
    return {
      title: 'Request a Free Septic Tank Pumping Quote | Houston, TX | SepticProDirect',
      description:
        'Request a free, transparent quote for septic tank pumping, cleaning, inspection, or maintenance in Greater Houston, TX. Fast local contractor matching with upfront pricing.',
      canonicalPath: '/request-a-quote/',
    };
  }

  // 8. Privacy Policy
  if (cleanPath === '/privacy-policy/') {
    return {
      title: 'Privacy Policy | SepticProDirect Houston TX',
      description:
        'Privacy policy and data protection disclosures for SepticProDirect. Learn how we handle your personal information and service requests.',
      canonicalPath: '/privacy-policy/',
    };
  }

  // 9. Terms of Service
  if (cleanPath === '/terms-of-service/') {
    return {
      title: 'Terms of Service | SepticProDirect Houston TX',
      description:
        'Terms of Service and user agreement for SepticProDirect. Understand our dispatch platform rules, contractor relationships, and estimate policies.',
      canonicalPath: '/terms-of-service/',
    };
  }

  // 10. Default / 404 Fallback
  return {
    title: 'Page Not Found (404) | SepticProDirect Houston TX',
    description:
      'The requested septic service page could not be found. Navigate back to our home page or call our Houston dispatch desk for assistance.',
    canonicalPath: cleanPath,
  };
}

/**
 * MetaTags Component:
 * Dynamically updates document.title, meta description, canonical link,
 * and OpenGraph/Twitter social cards based on the active route or custom props.
 */
export function MetaTags({
  currentPath,
  title: customTitle,
  description: customDescription,
  canonicalPath: customCanonicalPath,
  ogType = 'website',
}: MetaTagsProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const path =
      currentPath ||
      (typeof window !== 'undefined' ? window.location.pathname : '/');

    const defaultMeta = getRouteMetaData(path);

    const activeTitle = customTitle || defaultMeta.title;
    const activeDescription = customDescription || defaultMeta.description;
    const activeCanonicalPath = customCanonicalPath || defaultMeta.canonicalPath;

    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : BUSINESS_CONFIG.domain;

    const fullCanonicalUrl = activeCanonicalPath.startsWith('http')
      ? activeCanonicalPath
      : `${origin}${activeCanonicalPath.startsWith('/') ? activeCanonicalPath : `/${activeCanonicalPath}`}`;

    // 1. Update Document Title
    document.title = activeTitle;

    // 2. Helper to set/update <meta> tags
    const setMeta = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard Meta Tags
    setMeta('name', 'description', activeDescription);
    setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // OpenGraph Meta Tags
    setMeta('property', 'og:title', activeTitle);
    setMeta('property', 'og:description', activeDescription);
    setMeta('property', 'og:url', fullCanonicalUrl);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', BUSINESS_CONFIG.brandName);
    setMeta('property', 'og:locale', 'en_US');

    // Twitter Card Meta Tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', activeTitle);
    setMeta('name', 'twitter:description', activeDescription);

    // 3. Helper to set/update <link rel="canonical">
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', fullCanonicalUrl);
  }, [currentPath, customTitle, customDescription, customCanonicalPath, ogType]);

  return null;
}
