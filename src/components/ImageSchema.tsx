import { useEffect } from 'react';
import { BUSINESS_CONFIG } from '../config/business';

export interface ImageMetadata {
  url: string;
  name?: string;
  caption?: string;
  description?: string;
  width?: number;
  height?: number;
}

interface ImageSchemaProps {
  images: ImageMetadata | ImageMetadata[];
  pageUrl?: string;
}

/**
 * Reusable SEO component that injects Schema.org ImageObject structured data
 * into the document head to enhance Google Image Search indexing and rich results.
 */
export function ImageSchema({ images, pageUrl }: ImageSchemaProps) {
  useEffect(() => {
    if (typeof document === 'undefined' || !images) return;

    const SCRIPT_ID = 'jsonld-image-schema';
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
        : BUSINESS_CONFIG.domain;

    const imageList: ImageMetadata[] = Array.isArray(images) ? images : [images];

    const formattedObjects = imageList.map((img) => {
      const fullImageUrl = img.url.startsWith('http')
        ? img.url
        : `${origin}${img.url.startsWith('/') ? img.url : `/${img.url}`}`;

      return {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        contentUrl: fullImageUrl,
        url: fullImageUrl,
        name: img.name || `${BUSINESS_CONFIG.brandName} Houston Septic Service`,
        caption: img.caption || img.name,
        description:
          img.description ||
          img.caption ||
          img.name ||
          'Professional residential septic tank pumping and maintenance services in Houston, TX.',
        creditText: BUSINESS_CONFIG.brandName,
        copyrightNotice: `© ${new Date().getFullYear()} ${BUSINESS_CONFIG.legalName}`,
        creator: {
          '@type': 'Organization',
          name: BUSINESS_CONFIG.brandName,
          url: origin,
        },
        acquireLicensePage: `${origin}/terms-of-service/`,
        license: `${origin}/terms-of-service/`,
        ...(img.width && { width: img.width }),
        ...(img.height && { height: img.height }),
        ...(pageUrl && {
          representativeOfPage: true,
          mainEntityOfPage: pageUrl.startsWith('http') ? pageUrl : `${origin}${pageUrl}`,
        }),
      };
    });

    const schemaData =
      formattedObjects.length === 1
        ? formattedObjects[0]
        : {
            '@context': 'https://schema.org',
            '@graph': formattedObjects,
          };

    scriptTag.textContent = JSON.stringify(schemaData, null, 2);

    return () => {
      const tagToRemove = document.getElementById(SCRIPT_ID);
      if (tagToRemove && tagToRemove.parentNode) {
        tagToRemove.parentNode.removeChild(tagToRemove);
      }
    };
  }, [images, pageUrl]);

  return null;
}
