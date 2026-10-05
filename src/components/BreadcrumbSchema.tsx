import { useEffect, useMemo } from 'react';
import { SERVICES, SERVICE_AREAS, BUSINESS_CONFIG } from '../config/business';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BreadcrumbSchemaProps {
  items?: BreadcrumbItem[];
  path?: string;
}

/**
 * Helper to dynamically generate a breadcrumb list from any given URL pathname
 */
export function deriveBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  // 1. Home root
  if (cleanPath === '/' || cleanPath === '') {
    return [{ name: 'Home', url: '/' }];
  }

  // 2. Exact match static pages
  if (cleanPath === '/service-areas') {
    return [
      { name: 'Home', url: '/' },
      { name: 'Service Areas', url: '/service-areas/' },
    ];
  }

  if (cleanPath === '/about-us') {
    return [
      { name: 'Home', url: '/' },
      { name: 'About Us', url: '/about-us/' },
    ];
  }

  if (cleanPath === '/contact') {
    return [
      { name: 'Home', url: '/' },
      { name: 'Contact Us', url: '/contact/' },
    ];
  }

  if (cleanPath === '/request-a-quote') {
    return [
      { name: 'Home', url: '/' },
      { name: 'Request a Quote', url: '/request-a-quote/' },
    ];
  }

  if (cleanPath === '/privacy-policy') {
    return [
      { name: 'Home', url: '/' },
      { name: 'Privacy Policy', url: '/privacy-policy/' },
    ];
  }

  if (cleanPath === '/terms-of-service') {
    return [
      { name: 'Home', url: '/' },
      { name: 'Terms of Service', url: '/terms-of-service/' },
    ];
  }

  if (cleanPath === '/sitemap') {
    return [
      { name: 'Home', url: '/' },
      { name: 'HTML Sitemap', url: '/sitemap/' },
    ];
  }

  // 3. Match Service Pages (e.g., /septic-tank-pumping-houston-tx/)
  const serviceSlug = cleanPath.replace(/^\//, '');
  const matchedService = SERVICES.find((s) => s.slug === serviceSlug);
  if (matchedService) {
    return [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/' },
      { name: matchedService.name, url: `/${matchedService.slug}/` },
    ];
  }

  // 4. Match City Pages (e.g., /service-areas/katy-tx/)
  const cityMatch = cleanPath.match(/^\/service-areas\/([^/]+)$/);
  if (cityMatch) {
    const citySlug = cityMatch[1];
    const matchedCity = SERVICE_AREAS.find(
      (c) => c.slug === citySlug || c.id === citySlug.replace('-tx', '')
    );

    if (matchedCity) {
      return [
        { name: 'Home', url: '/' },
        { name: 'Service Areas', url: '/service-areas/' },
        { name: `${matchedCity.name}, TX`, url: `/service-areas/${matchedCity.slug}/` },
      ];
    }
  }

  // 5. Fallback for any hierarchical sub-path
  const segments = cleanPath.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ name: 'Home', url: '/' }];
  let accumulatedPath = '';

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    accumulatedPath += `/${seg}`;

    // Format human-readable title from kebab-case segment
    const formattedName = seg
      .replace(/-tx$/, ', TX')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    breadcrumbs.push({
      name: formattedName,
      url: `${accumulatedPath}/`,
    });
  }

  return breadcrumbs;
}

/**
 * BreadcrumbSchema Component:
 * Injects Schema.org JSON-LD BreadcrumbList structured data into <head>
 * dynamically for any route or explicit breadcrumb items array.
 * Ensures Google, Bing, and other search engines crawl site hierarchy
 * and render breadcrumb navigation trails in search result snippets.
 */
export function BreadcrumbSchema({ items, path }: BreadcrumbSchemaProps) {
  // Determine breadcrumbs list: use explicit items or dynamically derive from path/location
  const resolvedItems = useMemo(() => {
    if (items && items.length > 0) {
      // Ensure 'Home' is root position 1 if not already provided
      const hasHome = items.some(
        (it) => it.url === '/' || it.name.trim().toLowerCase() === 'home'
      );
      return hasHome ? items : [{ name: 'Home', url: '/' }, ...items];
    }

    const currentPath =
      path ||
      (typeof window !== 'undefined' ? window.location.pathname : '/');

    return deriveBreadcrumbsFromPath(currentPath);
  }, [items, path]);

  // Inject or update JSON-LD Schema in <head>
  useEffect(() => {
    if (typeof document === 'undefined' || !resolvedItems || resolvedItems.length === 0) {
      return;
    }

    const SCRIPT_ID = 'jsonld-breadcrumb-schema';
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = SCRIPT_ID;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://www.septicprodirect.com';

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: resolvedItems.map((item, index) => {
        let fullUrl = item.url;
        if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
          const cleanPath = fullUrl.startsWith('/') ? fullUrl : `/${fullUrl}`;
          fullUrl = `${origin}${cleanPath}`;
        }

        return {
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: fullUrl,
        };
      }),
    };

    scriptTag.textContent = JSON.stringify(schemaData, null, 2);

    return () => {
      const tagToRemove = document.getElementById(SCRIPT_ID);
      if (tagToRemove && tagToRemove.parentNode) {
        tagToRemove.parentNode.removeChild(tagToRemove);
      }
    };
  }, [resolvedItems]);

  return null;
}
