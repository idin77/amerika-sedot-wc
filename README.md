# SepticProDirect — Houston Septic Tank Pumping & Lead Generation Platform

A high-converting, professional lead generation and marketing website for residential septic tank pumping, cleaning, inspection, and maintenance in the Greater Houston, Texas metropolitan area.

## 1. Project Overview & Business Model

**SepticProDirect** operates as a specialized digital marketing and contractor dispatch platform:
- **Management:** Digital marketing, SEO, and lead routing managed remotely.
- **Field Operations:** All physical on-site pumping, inspections, sludge haulage, and maintenance are executed exclusively by independent, licensed, and insured local contractor partners operating in Greater Houston.
- **Texas Regulatory Compliance:** Partner pumpers hold active On-Site Sewage Facility (OSSF) registrations and Registered Sludge Transporter credentials with the Texas Commission on Environmental Quality (TCEQ) under 30 TAC Chapter 285.
- **Honest Pricing Policy:** We avoid bait-and-switch flat rates. Pricing is transparently explained based on actual engineering variables (tank capacity in gallons, lid digging depth, effluent filter cleaning, and distance to driveway).

---

## 2. Page & URL Architecture

| URL Route | Page Title & Intent | Target Local Keywords |
| :--- | :--- | :--- |
| `/` | **Home** — Value proposition, service summaries, how it works, pricing guide, FAQ, lead form | *septic tank pumping Houston TX, septic tank service Houston TX* |
| `/septic-tank-pumping-houston-tx/` | **Septic Tank Pumping** — Complete residential vacuum pump-out guide | *septic tank pumping Houston TX, residential septic tank pumping* |
| `/septic-tank-cleaning-houston/` | **Septic Tank Cleaning** — Deep interior wall hydro-washing & sludge breakdown | *septic tank cleaning Houston, sludge removal Houston* |
| `/septic-tank-inspection-houston/` | **Septic Tank Inspection** — Real estate & TCEQ compliance inspections | *septic tank inspection Houston TX, real estate septic inspection* |
| `/septic-tank-maintenance-houston/` | **Septic Maintenance** — Effluent filters & aerobic unit care | *septic tank maintenance Houston, septic filter cleaning* |
| `/emergency-septic-service-houston/` | **Emergency Septic Service** — Urgent backup dispatch triage | *emergency septic pumping Houston, urgent sewage backup Houston* |
| `/service-areas/` | **Service Areas Directory** — County & city coverage index | *septic tank pumping near me, Houston septic service areas* |
| `/service-areas/:citySlug/` | **Localized City Pages** — Bespoke soil, county, and system notes (Katy, Sugar Land, The Woodlands, Pearland, Cypress, Spring, Conroe, Tomball, Richmond, Friendswood, League City, Humble) | *septic pumping Katy TX, septic cleaning Sugar Land TX, etc.* |
| `/about-us/` | **About Us** — Transparent referral & contractor matching model | *about SepticProDirect, Houston septic contractor network* |
| `/contact/` | **Contact** — Phone dispatch, operating hours, service inquiry | *septic company Houston phone, contact septic dispatch* |
| `/request-a-quote/` | **Request a Quote** — High-conversion quote request + cost estimator | *free septic quote Houston, septic pumping cost estimate* |
| `/privacy-policy/` | **Privacy Policy** — US privacy & Texas TDPSA disclosures | *data protection, privacy policy* |
| `/terms-of-service/` | **Terms of Service** — Platform rules, contractor independence disclaimer | *terms of service, legal disclaimers* |

---

## 3. Key Features & Implementation Details

1. **Top Bar Contract Compliance:**
   - 3-zone clean header: Wordmark brand on left, clean navigation links with hover states in center, telephone click-to-call + primary CTA on right.
   - Zero pill clutter, no code comments, no fake badges.

2. **Lead Generation Form & Server-Side Validation:**
   - Client and server-side validation for Full Name, Phone (10 digits), ZIP Code (5 digits), Service selection, Property type, Preferred date, and explicit Consent.
   - Dual-layer anti-spam protection: Hidden honeypot field + submission timing verification (< 1.5s rejection).
   - Generates formatted lead tracking IDs (`SPD-HOU-XXXXX`).
   - Integrated webhook forwarding via `LEAD_NOTIFICATION_WEBHOOK_URL` to Zapier, Make, Slack, or any CRM.

3. **Interactive Septic Pumping Cost Estimator:**
   - Allows homeowners to estimate costs by selecting tank size (750, 1,000, 1,500 gal), lid depth (surface riser vs buried), effluent filter cleaning, and hose run distance.

4. **Mobile-First Conversion:**
   - Floating mobile contact bar (Call Now + Free Quote) strictly respecting the $\le 15\%$ viewport cap rule.
   - Click-to-call configured with clean tracking events (`phone_click`, `quote_request_submitted`).

5. **Technical SEO & Structured Data:**
   - Dynamic canonical links and Open Graph tags.
   - Automatic `sitemap.xml` and `robots.txt` endpoints generated via server.
   - Schema.org JSON-LD implementations: `WebSite`, `Organization`, `Service`, `BreadcrumbList`, and `FAQPage`.

---

## 4. Local Development & Installation

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation Steps
```bash
# 1. Clone or navigate to the repository directory
cd septicprodirect

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env

# 4. Start the development server
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 5. Environment Variables Configuration

Configure the following variables in your `.env` or deployment environment:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Local server port | `3000` |
| `APP_URL` | Canonical public URL of the deployed application | `https://www.septicprodirect.com` |
| `VITE_BUSINESS_PHONE` | Business telephone displayed for click-to-call | `(281) 899-0294` |
| `LEAD_NOTIFICATION_WEBHOOK_URL` | Optional webhook endpoint to receive leads instantly (Zapier, Make, Slack) | `https://hooks.zapier.com/hooks/catch/...` |
| `LEAD_EMAIL_RECIPIENT` | Dispatch email address for notifications | `dispatch@septicprodirect.com` |

---

## 6. Deployment to Vercel

### Option A: Direct Vercel Git Integration
1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. Vercel automatically detects the Vite / React framework.
4. Set **Build Command:** `npm run build`
5. Set **Output Directory:** `dist`
6. Add the environment variables (`APP_URL`, `VITE_BUSINESS_PHONE`, `LEAD_NOTIFICATION_WEBHOOK_URL`).
7. For serverless API route support on Vercel, the `/api/quote` endpoint can also be deployed using Vercel Serverless Functions (`/api/quote.ts`) or via the Node.js Express server.
8. Add a `vercel.json` rewrite file to ensure SPA routing works seamlessly:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/sitemap.xml", "destination": "/sitemap.xml" },
    { "source": "/robots.txt", "destination": "/robots.txt" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Option B: Cloud Run / Node.js Host (Docker / Full-Stack)
```bash
# Build client assets
npm run build

# Start the full-stack server
npm run start
```

---

## 7. Pre-Launch Verification Checklist

- [x] **Single H1 per page** and logical semantic hierarchy.
- [x] **Canonical URLs** matched to path.
- [x] **Dynamic Title & Meta Descriptions** matching local search intent.
- [x] **Zero-Pill discipline** and anti-AI slop compliance.
- [x] **Touch targets** $\ge 44\text{px}$ on mobile.
- [x] **Lead form client & server validation** with anti-spam protections.
- [x] **Real photographic assets** of commercial vacuum pump trucks, technicians, and Houston suburban homes.
- [x] **Clean 404 page** with navigation back to key services.
- [x] **Sitemap.xml and robots.txt** configured and validated.
- [x] **TCEQ & Texas legal transparency notices** fully visible on all pages and footer.
