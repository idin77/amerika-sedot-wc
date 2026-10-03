import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSitemapXml, getAllSiteRoutes } from '../src/lib/sitemap';
import { BUSINESS_CONFIG } from '../src/config/business';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function run() {
  const rootDir = path.resolve(__dirname, '..');
  const publicDir = path.resolve(rootDir, 'public');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const xml = generateSitemapXml(BUSINESS_CONFIG.domain);
  const sitemapPath = path.resolve(publicDir, 'sitemap.xml');

  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`[SITEMAP GENERATOR] Successfully generated sitemap.xml at: ${sitemapPath}`);

  const routes = getAllSiteRoutes(BUSINESS_CONFIG.domain);
  console.log(`[SITEMAP GENERATOR] Total routes indexed: ${routes.length}`);

  // Also ensure robots.txt exists and points to sitemap
  const robotsContent = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${BUSINESS_CONFIG.domain}/sitemap.xml
`;
  const robotsPath = path.resolve(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsContent, 'utf8');
  console.log(`[SITEMAP GENERATOR] Successfully updated robots.txt at: ${robotsPath}`);
}

run();
