import { BUSINESS_CONFIG, SERVICES, SERVICE_AREAS } from '../config/business';

export interface SitemapUrlEntry {
  loc: string;
  path: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  category: 'core' | 'service' | 'city' | 'legal' | 'company';
  title: string;
}

/**
 * Returns an exhaustive list of all routes across the SepticProDirect web application,
 * categorized with appropriate crawling priority and update frequency.
 */
export function getAllSiteRoutes(baseUrl?: string): SitemapUrlEntry[] {
  const origin = (baseUrl || BUSINESS_CONFIG.domain).replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  const routes: SitemapUrlEntry[] = [
    // 1. Core Homepage
    {
      loc: `${origin}/`,
      path: '/',
      lastmod: today,
      changefreq: 'daily',
      priority: '1.0',
      category: 'core',
      title: 'Houston Septic Tank Pumping & Contractor Dispatch - Home',
    },

    // 2. High-Priority Conversion Pages
    {
      loc: `${origin}/request-a-quote/`,
      path: '/request-a-quote/',
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.9',
      category: 'core',
      title: 'Request a Free Houston Septic Quote',
    },
    {
      loc: `${origin}/contact/`,
      path: '/contact/',
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8',
      category: 'company',
      title: 'Contact Dispatch & Customer Service',
    },
    {
      loc: `${origin}/about-us/`,
      path: '/about-us/',
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7',
      category: 'company',
      title: 'About SepticProDirect & Partner Network',
    },

    // 3. Service Areas Hub
    {
      loc: `${origin}/service-areas/`,
      path: '/service-areas/',
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.9',
      category: 'city',
      title: 'Greater Houston Service Areas Directory',
    },
  ];

  // 4. Individual Service Landing Pages
  SERVICES.forEach((service) => {
    routes.push({
      loc: `${origin}/${service.slug}/`,
      path: `/${service.slug}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: service.id === 'emergency' ? '0.9' : '0.8',
      category: 'service',
      title: `${service.name} - Houston, TX`,
    });
  });

  // 5. Individual City / Suburb Service Pages
  SERVICE_AREAS.forEach((city) => {
    routes.push({
      loc: `${origin}/service-areas/${city.slug}/`,
      path: `/service-areas/${city.slug}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
      category: 'city',
      title: `Septic Tank Pumping in ${city.name}, TX (${city.county})`,
    });
  });

  // 6. Legal & Policy Pages
  routes.push(
    {
      loc: `${origin}/privacy-policy/`,
      path: '/privacy-policy/',
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.3',
      category: 'legal',
      title: 'Privacy Policy & Data Security',
    },
    {
      loc: `${origin}/terms-of-service/`,
      path: '/terms-of-service/',
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.3',
      category: 'legal',
      title: 'Terms of Service & Platform Disclosures',
    }
  );

  return routes;
}

/**
 * Generates standards-compliant XML sitemap conforming to https://www.sitemaps.org/schemas/sitemap/0.9
 */
export function generateSitemapXml(baseUrl?: string): string {
  const routes = getAllSiteRoutes(baseUrl);

  const xmlEntries = routes
    .map(
      (route) => `  <url>
    <loc>${route.loc}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlEntries}
</urlset>`;
}
