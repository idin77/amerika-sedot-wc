import { useEffect } from 'react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

/**
 * Reusable SEO component that injects Schema.org BreadcrumbList JSON-LD structured data
 * into the document head to improve search engine result navigation trails.
 */
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  useEffect(() => {
    if (typeof document === 'undefined' || !items || items.length === 0) return;

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

    // Normalize list: prepend 'Home' as position 1 if not already present
    const hasHome = items.some(
      (item) => item.url === '/' || item.name.trim().toLowerCase() === 'home'
    );
    const fullList: BreadcrumbItem[] = hasHome
      ? items
      : [{ name: 'Home', url: '/' }, ...items];

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: fullList.map((item, index) => {
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
  }, [items]);

  return null;
}
