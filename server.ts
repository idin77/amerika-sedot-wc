import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Parse JSON request bodies
app.use(express.json());

// In-memory leads storage for inspection/export
interface StoredLead {
  leadId: string;
  fullName: string;
  phone: string;
  email?: string;
  zipCode: string;
  serviceNeeded: string;
  propertyType: string;
  preferredDate?: string;
  tankSizeEstimated?: string;
  description?: string;
  timestamp: string;
  status: string;
}

const submittedLeads: StoredLead[] = [];

// 1. Lead Generation Quote Submission Endpoint
app.post('/api/quote', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      phone,
      email,
      zipCode,
      serviceNeeded,
      propertyType,
      preferredDate,
      tankSizeEstimated,
      description,
      consent,
      website_honeypot,
      formRenderTime,
    } = req.body;

    // Spam Protection 1: Honeypot check
    if (website_honeypot && website_honeypot.trim() !== '') {
      console.warn('[SPAM BLOCKED] Honeypot field was filled:', website_honeypot);
      res.status(400).json({
        success: false,
        message: 'Spam detected. Request rejected.',
      });
      return;
    }

    // Spam Protection 2: Minimum submission time check (under 1.5 seconds indicates bot)
    if (formRenderTime && Date.now() - Number(formRenderTime) < 1500) {
      console.warn('[SPAM BLOCKED] Form submitted too quickly (< 1.5s)');
      res.status(400).json({
        success: false,
        message: 'Submission was too fast. Please retry.',
      });
      return;
    }

    // Validation
    const errors: Record<string, string> = {};

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      errors.fullName = 'Valid full name is required.';
    }

    const cleanPhone = phone ? String(phone).replace(/\D/g, '') : '';
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Valid 10-digit US phone number is required.';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      errors.email = 'Valid email address format required.';
    }

    const cleanZip = zipCode ? String(zipCode).trim() : '';
    if (!/^\d{5}$/.test(cleanZip)) {
      errors.zipCode = 'Valid 5-digit US ZIP code is required.';
    }

    if (!serviceNeeded) {
      errors.serviceNeeded = 'Service selection is required.';
    }

    if (!consent) {
      errors.consent = 'Consent to contractor matching is required.';
    }

    if (Object.keys(errors).length > 0) {
      res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors,
      });
      return;
    }

    // Generate unique Houston dispatch lead ID
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const leadId = `SPD-HOU-${randomSuffix}`;

    const leadRecord: StoredLead = {
      leadId,
      fullName: String(fullName).trim(),
      phone: cleanPhone,
      email: email ? String(email).trim() : undefined,
      zipCode: cleanZip,
      serviceNeeded: String(serviceNeeded),
      propertyType: propertyType || 'Single-Family Residential',
      preferredDate: preferredDate || undefined,
      tankSizeEstimated: tankSizeEstimated || undefined,
      description: description ? String(description).trim() : undefined,
      timestamp: new Date().toISOString(),
      status: 'Queued for Local Partner Dispatch',
    };

    submittedLeads.push(leadRecord);
    console.log(`[NEW LEAD] ${leadId} received: ${leadRecord.fullName}, ${leadRecord.zipCode}, ${leadRecord.serviceNeeded}`);

    // Optional CRM / Webhook integration via environment variable
    const webhookUrl = process.env.LEAD_NOTIFICATION_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadRecord),
        });
        console.log(`[LEAD WEBHOOK] Dispatched lead ${leadId} to ${webhookUrl}`);
      } catch (webhookErr) {
        console.error('[LEAD WEBHOOK ERROR]', webhookErr);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Service request queued successfully. An available local partner will contact you.',
      leadId,
      dispatchStatus: 'Queued for Local Partner Dispatch',
    });
  } catch (error: any) {
    console.error('[API ERROR /api/quote]', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error processing quote request.',
    });
  }
});

// 2. Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brand: 'SepticProDirect',
    market: 'Houston, TX',
    timestamp: new Date().toISOString(),
    totalLeadsProcessed: submittedLeads.length,
  });
});

// 3. Technical SEO: XML Sitemap
app.get('/sitemap.xml', (req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;

  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/septic-tank-pumping-houston-tx/', priority: '0.9', changefreq: 'weekly' },
    { loc: '/septic-tank-cleaning-houston/', priority: '0.9', changefreq: 'weekly' },
    { loc: '/septic-tank-inspection-houston/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/septic-tank-maintenance-houston/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/emergency-septic-service-houston/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/service-areas/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/service-areas/houston-tx/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/service-areas/katy-tx/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/service-areas/sugar-land-tx/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/service-areas/the-woodlands-tx/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/service-areas/pearland-tx/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/service-areas/cypress-tx/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/service-areas/spring-tx/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/service-areas/conroe-tx/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/service-areas/tomball-tx/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/service-areas/richmond-tx/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/service-areas/friendswood-tx/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/service-areas/league-city-tx/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/service-areas/humble-tx/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/about-us/', priority: '0.6', changefreq: 'monthly' },
    { loc: '/contact/', priority: '0.7', changefreq: 'monthly' },
    { loc: '/request-a-quote/', priority: '0.9', changefreq: 'weekly' },
    { loc: '/privacy-policy/', priority: '0.3', changefreq: 'monthly' },
    { loc: '/terms-of-service/', priority: '0.3', changefreq: 'monthly' },
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(sitemapXml);
});

// 4. Technical SEO: robots.txt
app.get('/robots.txt', (req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

// 5. Mount Vite or Static Distribution
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SepticProDirect Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
