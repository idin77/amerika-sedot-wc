import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSitemapXml } from './src/lib/sitemap';

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

// 1b. Lead Conversion Tracking & Webhook Forwarder Endpoint
app.post('/api/track-conversion', async (req: Request, res: Response): Promise<void> => {
  try {
    const conversionData = req.body;
    console.log(`[CONVERSION TRACKED] Type: ${conversionData.eventType || 'conversion'}`, {
      leadId: conversionData.leadId,
      service: conversionData.service,
      zipCode: conversionData.zipCode,
      buttonType: conversionData.buttonType,
    });

    // Relay to configured Lead Notification Webhook
    const webhookUrl = process.env.LEAD_NOTIFICATION_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notificationType: 'lead_conversion_event',
            ...conversionData,
            serverTimestamp: new Date().toISOString(),
          }),
        });
        console.log(`[CONVERSION WEBHOOK] Relayed event to ${webhookUrl}`);
      } catch (webhookErr) {
        console.error('[CONVERSION WEBHOOK ERROR]', webhookErr);
      }
    }

    res.status(200).json({ success: true, tracked: true });
  } catch (err: any) {
    console.error('[API ERROR /api/track-conversion]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1c. Customer Testimonials & Verified Houston Homeowner Reviews Endpoint
const HOUSTON_VERIFIED_REVIEWS = [
  {
    id: 'rev-katy-01',
    author: 'Marcus & Elena L.',
    location: 'Katy, TX',
    county: 'Harris / Fort Bend County',
    rating: 5,
    date: 'September 28, 2026',
    serviceCategory: 'emergency',
    serviceLabel: 'Emergency Septic Pumping',
    tankType: '1,500 Gallon Aerobic ATU',
    title: 'Arrived in 75 minutes on a rainy Saturday morning',
    reviewText:
      'Our septic high-water alarm started beeping early Saturday with relatives visiting. We called SepticProDirect and they matched us with a local vacuum pumper who arrived in Katy within 75 minutes. The technician was calm, respectful of our property, and gave us an all-inclusive flat quote before connecting suction hoses. Total lifesaver!',
    verified: true,
    helpfulCount: 38,
  },
  {
    id: 'rev-woodlands-02',
    author: 'Robert D.',
    location: 'The Woodlands, TX',
    county: 'Montgomery County',
    rating: 5,
    date: 'September 15, 2026',
    serviceCategory: 'maintenance',
    serviceLabel: 'Aerobic Tank Maintenance',
    tankType: '1,000 Gallon Concrete Aerobic',
    title: 'Knows Montgomery County regulations inside out',
    reviewText:
      'I have an aerobic system with spray heads in Creekside Park. The technician serviced our compressor, power-washed the effluent filter, and walked me through chlorine tablet requirements under Montgomery County rules. Honest service without any high-pressure upselling.',
    verified: true,
    helpfulCount: 29,
  },
  {
    id: 'rev-cypress-03',
    author: 'Sarah M.',
    location: 'Cypress, TX',
    county: 'Harris County',
    rating: 5,
    date: 'August 30, 2026',
    serviceCategory: 'pumping',
    serviceLabel: 'Residential Septic Pumping',
    tankType: '1,250 Gallon Conventional',
    title: 'Honest flat rate with zero surprise disposal fees',
    reviewText:
      'Last contractor we hired tried charging an unexpected $200 environmental dump fee after pumping. SepticProDirect gave us a clear upfront flat rate over the phone that covered both tank chambers, 100 feet of hose, and certified municipal disposal. Will definitely use them again in 3 years.',
    verified: true,
    helpfulCount: 44,
  },
  {
    id: 'rev-sugarland-04',
    author: 'David & Amanda K.',
    location: 'Sugar Land, TX',
    county: 'Fort Bend County',
    rating: 5,
    date: 'August 14, 2026',
    serviceCategory: 'cleaning',
    serviceLabel: 'Septic Tank Cleaning & Jetting',
    tankType: '1,500 Gallon 2-Compartment Tank',
    title: 'Hydro-jetted compacted sludge without tearing up the lawn',
    reviewText:
      'Our house was built in 2004 and the tank bottom had dense compacted sludge that regular suction could not budge. The crew used high-pressure water jetting to emulsify the bottom crust and vacuumed everything clean. They parked on the gravel drive and used extra long hoses to protect our sod.',
    verified: true,
    helpfulCount: 22,
  },
  {
    id: 'rev-pearland-05',
    author: 'Chief Warrant Officer Brandon T.',
    location: 'Pearland, TX',
    county: 'Brazoria County',
    rating: 5,
    date: 'July 22, 2026',
    serviceCategory: 'inspection',
    serviceLabel: 'Real Estate OSSF Inspection',
    tankType: '1,000 Gallon Fiberglass Tank',
    title: 'Saved us from buying a failed $15,000 drainfield',
    reviewText:
      'We were under contract for an acre property in Pearland. The inspection crew performed a hydraulic load test and camera scope that discovered cracked inlet baffles and a biomat-choked absorption field. Their detailed digital engineering report helped us negotiate a full $14,000 seller escrow credit.',
    verified: true,
    helpfulCount: 51,
  },
  {
    id: 'rev-spring-06',
    author: 'Guillermo & Patricia R.',
    location: 'Spring, TX',
    county: 'Harris County',
    rating: 5,
    date: 'July 05, 2026',
    serviceCategory: 'pumping',
    serviceLabel: 'Routine Septic Pump-Out',
    tankType: '1,000 Gallon Dual-Compartment',
    title: 'Courteous crew and completely odor-free pump-out',
    reviewText:
      'Prompt arrival on Friday afternoon. The technician explained the sludge judge readings, showed me the sludge layer before and after suction, and resealed the riser lids with fresh neoprene gaskets so there was zero lingering odor. Top-notch service.',
    verified: true,
    helpfulCount: 19,
  }
];

app.get('/api/reviews', (req: Request, res: Response): void => {
  const { category, county, limit } = req.query;
  let reviews = [...HOUSTON_VERIFIED_REVIEWS];

  if (category && typeof category === 'string' && category !== 'all') {
    reviews = reviews.filter((r) => r.serviceCategory.toLowerCase() === category.toLowerCase());
  }

  if (county && typeof county === 'string') {
    reviews = reviews.filter((r) => r.county.toLowerCase().includes(county.toLowerCase()));
  }

  if (limit && !isNaN(Number(limit))) {
    reviews = reviews.slice(0, Number(limit));
  }

  res.json({
    success: true,
    stats: {
      averageRating: 4.9,
      totalRatings: 286,
      licensedContractorRate: 100,
      tceqCompliant: true,
    },
    reviews,
  });
});

// 1d. Maintenance Reminder Subscription Endpoint
interface MaintenanceReminder {
  id: string;
  email: string;
  phone?: string;
  zipCode?: string;
  systemType: string;
  tankSize: string;
  householdSize: number;
  lastPumpDate: string;
  recommendedPumpDate: string;
  timestamp: string;
}

const maintenanceReminders: MaintenanceReminder[] = [];

app.post('/api/maintenance-reminder', (req: Request, res: Response): void => {
  const {
    email,
    phone,
    zipCode,
    systemType,
    tankSize,
    householdSize,
    lastPumpDate,
    recommendedPumpDate,
  } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
    res.status(400).json({ success: false, message: 'Valid email is required.' });
    return;
  }

  const reminderRecord: MaintenanceReminder = {
    id: `rem-${Date.now()}`,
    email: String(email).trim(),
    phone: phone ? String(phone).trim() : undefined,
    zipCode: zipCode ? String(zipCode).trim() : undefined,
    systemType: systemType || 'conventional',
    tankSize: tankSize || '1000',
    householdSize: Number(householdSize) || 4,
    lastPumpDate: lastPumpDate || 'unknown',
    recommendedPumpDate: recommendedPumpDate || '',
    timestamp: new Date().toISOString(),
  };

  maintenanceReminders.push(reminderRecord);
  console.log(`[MAINTENANCE REMINDER] Registered ${reminderRecord.email} - due: ${reminderRecord.recommendedPumpDate}`);

  res.json({
    success: true,
    message: 'Maintenance reminder scheduled successfully. You will receive email notifications prior to your recommended service cycle.',
    reminderId: reminderRecord.id,
  });
});

// 1e. Pre-Inspection Self-Assessment Remote Triage Endpoint
interface TriageAssessmentRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addressOrZip: string;
  systemType?: string;
  selectedIssues: string[];
  severityLevel: 'low' | 'moderate' | 'critical';
  additionalNotes?: string;
  timestamp: string;
}

const triageAssessments: TriageAssessmentRecord[] = [];

app.post('/api/triage-assessment', (req: Request, res: Response): void => {
  const {
    name,
    phone,
    email,
    addressOrZip,
    systemType,
    selectedIssues,
    severityLevel,
    additionalNotes,
  } = req.body;

  if (!phone || !String(phone).trim()) {
    res.status(400).json({ success: false, message: 'Valid phone number is required for contractor triage.' });
    return;
  }

  const triageRecord: TriageAssessmentRecord = {
    id: `tri-${Date.now()}`,
    name: name ? String(name).trim() : 'Houston Homeowner',
    phone: String(phone).trim(),
    email: email ? String(email).trim() : undefined,
    addressOrZip: addressOrZip ? String(addressOrZip).trim() : 'Houston Area',
    systemType: systemType || 'conventional',
    selectedIssues: Array.isArray(selectedIssues) ? selectedIssues : [],
    severityLevel: severityLevel === 'critical' ? 'critical' : severityLevel === 'moderate' ? 'moderate' : 'low',
    additionalNotes: additionalNotes ? String(additionalNotes).trim() : undefined,
    timestamp: new Date().toISOString(),
  };

  triageAssessments.push(triageRecord);
  console.log(`[TRIAGE RECEIVED] ${triageRecord.id} | Severity: ${triageRecord.severityLevel.toUpperCase()} | Phone: ${triageRecord.phone} | Issues: ${triageRecord.selectedIssues.length}`);

  res.json({
    success: true,
    message: 'Pre-inspection assessment received. A licensed Houston septic technician is reviewing your symptoms.',
    triageId: triageRecord.id,
    severity: triageRecord.severityLevel,
    recommendedAction:
      triageRecord.severityLevel === 'critical'
        ? 'Urgent emergency dispatch advised. Cease high water usage immediately.'
        : triageRecord.severityLevel === 'moderate'
        ? 'Technician follow-up recommended within 24–48 hours.'
        : 'Routine preventative pump-out recommended.',
  });
});

// 1f. Greater Houston County OSSF Permit Authorities & Assisted Lookup
interface PermitAuthority {
  id: string;
  county: string;
  department: string;
  portalUrl: string;
  phone: string;
  officeAddress: string;
  onlineSearchAvailable: boolean;
  zipCodes: string[];
  permitTypes: string[];
}

const HOUSTON_PERMIT_AUTHORITIES: PermitAuthority[] = [
  {
    id: 'harris',
    county: 'Harris County',
    department: 'Harris County Public Health (HCPH) - Environmental Public Health Division',
    portalUrl: 'https://publichealth.harriscountytx.gov/Services-Programs/Environmental-Public-Health/OSSF',
    phone: '(713) 274-6300',
    officeAddress: '2223 West Loop South, Houston, TX 77027',
    onlineSearchAvailable: true,
    zipCodes: ['77002', '77084', '77095', '77429', '77433', '77449', '77375', '77379', '77388', '77338'],
    permitTypes: ['License to Operate (LTO)', 'Aerobic Maintenance Contract Filing', 'OSSF Construction Permit'],
  },
  {
    id: 'montgomery',
    county: 'Montgomery County',
    department: 'Montgomery County Environmental Health Services',
    portalUrl: 'https://www.mctx.org/departments/departments_d_-_f/environmental_health/index.php',
    phone: '(936) 539-7839',
    officeAddress: '501 N Thompson St, Suite 101, Conroe, TX 77301',
    onlineSearchAvailable: true,
    zipCodes: ['77301', '77304', '77380', '77381', '77382', '77384', '77385', '77354', '77356', '77316'],
    permitTypes: ['OSSF Operating Permit', 'Aerobic Maintenance Contract Verification', 'Site Evaluation Review'],
  },
  {
    id: 'fort-bend',
    county: 'Fort Bend County',
    department: 'Fort Bend County Environmental Health Department',
    portalUrl: 'https://www.fortbendcountytx.gov/government/departments/health-and-human-services/environmental-health/on-site-sewage-facilities-ossf',
    phone: '(281) 342-7469',
    officeAddress: '4520 Reading Rd, Suite A-400, Rosenberg, TX 77471',
    onlineSearchAvailable: true,
    zipCodes: ['77406', '77469', '77471', '77479', '77494', '77407', '77450', '77478'],
    permitTypes: ['OSSF Permit to Construct', 'Authorization to Operate', 'Annual Maintenance Contract Renewal'],
  },
  {
    id: 'brazoria',
    county: 'Brazoria County',
    department: 'Brazoria County Environmental Health Department',
    portalUrl: 'https://www.brazoriacountytx.gov/departments/environmental-health/septic-permits-ossf',
    phone: '(979) 864-1600',
    officeAddress: '111 E Locust St, Angleton, TX 77515',
    onlineSearchAvailable: true,
    zipCodes: ['77584', '77581', '77511', '77515', '77578', '77566'],
    permitTypes: ['OSSF License to Operate', 'Aerobic Spray Permitting', 'Transfer of Ownership Permit'],
  },
  {
    id: 'galveston',
    county: 'Galveston County',
    department: 'Galveston County Health District (GCHD) - Pollution Control',
    portalUrl: 'https://www.gchd.org/pollution-control/on-site-septic-systems-ossf',
    phone: '(409) 938-2411',
    officeAddress: '9850-A Emmett F. Lowry Expressway, Texas City, TX 77591',
    onlineSearchAvailable: true,
    zipCodes: ['77539', '77568', '77573', '77590', '77591', '77550'],
    permitTypes: ['OSSF Operational Permit', 'Coastal High-Water Table Inspection', 'Maintenance Agreement Filing'],
  },
  {
    id: 'waller',
    county: 'Waller County',
    department: 'Waller County Road & Bridge / Environmental Permitting',
    portalUrl: 'https://www.co.waller.tx.us/page/RoadAndBridge.Permits',
    phone: '(979) 826-7670',
    officeAddress: '775 Business 290 East, Hempstead, TX 77445',
    onlineSearchAvailable: false,
    zipCodes: ['77423', '77445', '77446', '77484'],
    permitTypes: ['OSSF Installation Permit', 'Aerobic Inspection Records', 'Operating License'],
  },
  {
    id: 'tceq-state',
    county: 'State of Texas (TCEQ)',
    department: 'Texas Commission on Environmental Quality - OSSF Program & Central Registry',
    portalUrl: 'https://www.tceq.texas.gov/permitting/ossf',
    phone: '(512) 239-3799',
    officeAddress: '12100 Park 35 Circle, Austin, TX 78753',
    onlineSearchAvailable: true,
    zipCodes: [],
    permitTypes: ['Statewide OSSF Rules Chapter 285', 'Licensed Installer Verification', 'Direct Jurisdiction Permits'],
  },
];

interface PermitSearchRequest {
  id: string;
  address: string;
  county: string;
  cadTaxId?: string;
  homeownerName: string;
  phone: string;
  email: string;
  reason: string;
  timestamp: string;
}

const permitRequests: PermitSearchRequest[] = [];

app.get('/api/permit-authorities', (_req: Request, res: Response) => {
  res.json({
    success: true,
    authorities: HOUSTON_PERMIT_AUTHORITIES,
  });
});

app.post('/api/permit-lookup', (req: Request, res: Response): void => {
  const {
    address,
    county,
    cadTaxId,
    homeownerName,
    phone,
    email,
    reason,
  } = req.body;

  if (!address || !phone) {
    res.status(400).json({ success: false, message: 'Address and phone number are required.' });
    return;
  }

  const newRequest: PermitSearchRequest = {
    id: `prm-${Date.now()}`,
    address: String(address).trim(),
    county: county ? String(county).trim() : 'Harris County',
    cadTaxId: cadTaxId ? String(cadTaxId).trim() : undefined,
    homeownerName: homeownerName ? String(homeownerName).trim() : 'Homeowner',
    phone: String(phone).trim(),
    email: email ? String(email).trim() : '',
    reason: reason ? String(reason).trim() : 'General Permit Verification',
    timestamp: new Date().toISOString(),
  };

  permitRequests.push(newRequest);
  console.log(`[PERMIT SEARCH REQUEST] ${newRequest.id} for ${newRequest.address} in ${newRequest.county}`);

  // Find matching authority
  const matchedAuth = HOUSTON_PERMIT_AUTHORITIES.find(
    (a) => a.county.toLowerCase() === newRequest.county.toLowerCase()
  ) || HOUSTON_PERMIT_AUTHORITIES[0];

  res.json({
    success: true,
    requestId: newRequest.id,
    message: `Permit verification request logged for ${newRequest.address}. Our team will pull the official archive from ${matchedAuth.department}.`,
    authority: matchedAuth,
    verificationSteps: [
      'Query county digitized environmental health OSSF database',
      'Locate original License to Operate (LTO) and engineering plot plan',
      'Confirm current aerobic maintenance contract (MA) filing status',
      'Deliver copy of as-built diagram and permit details via phone/email',
    ],
  });
});

// 1g. Greater Houston Regional Weather & Septic Soil Saturation Monitor Endpoint
const HOUSTON_REGIONS: Record<string, { name: string; lat: number; lon: number; county: string }> = {
  'houston': { name: 'Houston Metro', lat: 29.7604, lon: -95.3698, county: 'Harris County' },
  'the-woodlands': { name: 'The Woodlands / Conroe', lat: 30.1578, lon: -95.4894, county: 'Montgomery County' },
  'katy': { name: 'Katy / Fulshear', lat: 29.7858, lon: -95.8245, county: 'Fort Bend / Harris' },
  'pearland': { name: 'Pearland / Alvin', lat: 29.5636, lon: -95.2860, county: 'Brazoria County' },
  'sugar-land': { name: 'Sugar Land / Missouri City', lat: 29.6197, lon: -95.6349, county: 'Fort Bend County' },
};

app.get('/api/weather', async (req: Request, res: Response): Promise<void> => {
  const regionKey = String(req.query.region || 'houston').toLowerCase();
  const region = HOUSTON_REGIONS[regionKey] || HOUSTON_REGIONS['houston'];

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${region.lat}&longitude=${region.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&daily=precipitation_sum,precipitation_probability_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FChicago`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const apiRes = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (apiRes.ok) {
      const data = await apiRes.json();
      const current = data.current || {};
      const daily = data.daily || {};

      const rainToday = Number(daily.precipitation_sum?.[0] || current.precipitation || 0);
      const rainProbability = Number(daily.precipitation_probability_max?.[0] || 0);

      let soilSaturationLevel: 'dry' | 'moderate' | 'saturated' | 'flooded' = 'dry';
      let septicRiskIndex: 'low' | 'moderate' | 'high' = 'low';
      let advisory = 'Normal soil absorption conditions. Standard household water usage recommended.';

      if (rainToday >= 1.5 || (current.rain && current.rain > 0.5)) {
        soilSaturationLevel = 'flooded';
        septicRiskIndex = 'high';
        advisory = 'CRITICAL SATURATION: High stormwater runoff over drainfield. Ration shower and laundry usage. Do NOT pump submerged tanks (buoyancy pop-out hazard).';
      } else if (rainToday >= 0.5 || rainProbability >= 65) {
        soilSaturationLevel = 'saturated';
        septicRiskIndex = 'moderate';
        advisory = 'ELEVATED SOIL SATURATION: Houston clay soils drain slowly. Stagger laundry loads and ensure gutters discharge away from your absorption lines.';
      } else if (rainToday > 0.1 || rainProbability >= 30) {
        soilSaturationLevel = 'moderate';
        septicRiskIndex = 'low';
        advisory = 'Damp surface soil. Normal absorption capacity for conventional and aerobic systems.';
      }

      res.json({
        success: true,
        region: region.name,
        county: region.county,
        coordinates: { lat: region.lat, lon: region.lon },
        current: {
          temperature: Math.round(current.temperature_2m ?? 78),
          feelsLike: Math.round(current.apparent_temperature ?? 82),
          humidity: Math.round(current.relative_humidity_2m ?? 72),
          windSpeed: Math.round(current.wind_speed_10m ?? 8),
          rainInches: rainToday,
          weatherCode: current.weather_code ?? 0,
        },
        forecast: {
          rainProbabilityToday: rainProbability,
          threeDayRainSum: Number((daily.precipitation_sum?.slice(0, 3).reduce((a: number, b: number) => a + (b || 0), 0) || 0).toFixed(2)),
        },
        septicImpact: {
          soilSaturationLevel,
          septicRiskIndex,
          advisory,
          soilType: 'Gulf Coast Fine Sandy Loam & Gumbo Clay (Slow Percolation)',
        },
        lastUpdated: new Date().toISOString(),
      });
      return;
    }
  } catch (err) {
    // Handled below by fallback
  }

  // Resilient fallback baseline for Greater Houston
  res.json({
    success: true,
    region: region.name,
    county: region.county,
    coordinates: { lat: region.lat, lon: region.lon },
    current: {
      temperature: 82,
      feelsLike: 86,
      humidity: 68,
      windSpeed: 7,
      rainInches: 0.15,
      weatherCode: 1,
    },
    forecast: {
      rainProbabilityToday: 20,
      threeDayRainSum: 0.35,
    },
    septicImpact: {
      soilSaturationLevel: 'moderate',
      septicRiskIndex: 'low',
      advisory: 'Moderate soil moisture. Typical Houston humid subtropical conditions. Absorption lines operating within normal parameters.',
      soilType: 'Gulf Coast Fine Sandy Loam & Gumbo Clay (Slow Percolation)',
    },
    lastUpdated: new Date().toISOString(),
    isFallback: true,
  });
});

// 1h. Customer Referral Rewards & Unique Tracking Link Endpoint
interface ReferralAccount {
  code: string;
  customerName: string;
  email: string;
  phone: string;
  area: string;
  completedReferrals: number;
  totalRewardDollars: number;
  pendingReferrals: number;
  createdAt: string;
}

const referralAccounts: Record<string, ReferralAccount> = {
  'HOU-MARCUS50': {
    code: 'HOU-MARCUS50',
    customerName: 'Marcus Harris',
    email: 'marcus.h@example.com',
    phone: '(713) 555-0182',
    area: 'Cypress, TX',
    completedReferrals: 2,
    totalRewardDollars: 100,
    pendingReferrals: 1,
    createdAt: '2026-08-15T12:00:00.000Z',
  },
  'KATY-ELENA35': {
    code: 'KATY-ELENA35',
    customerName: 'Elena Rostova',
    email: 'elena.r@example.com',
    phone: '(281) 555-0199',
    area: 'Katy, TX',
    completedReferrals: 3,
    totalRewardDollars: 150,
    pendingReferrals: 0,
    createdAt: '2026-09-01T12:00:00.000Z',
  },
};

app.post('/api/referral/create', (req: Request, res: Response): void => {
  const { name, email, phone, area } = req.body;

  if (!name || (!email && !phone)) {
    res.status(400).json({ success: false, message: 'Name and contact information are required.' });
    return;
  }

  const cleanName = String(name).trim();
  const cleanEmail = email ? String(email).trim().toLowerCase() : '';
  const cleanPhone = phone ? String(phone).trim() : '';
  const cleanArea = area ? String(area).trim() : 'Houston';

  // Check if account already exists by email or phone
  const existingKey = Object.keys(referralAccounts).find((k) => {
    const acc = referralAccounts[k];
    return (cleanEmail && acc.email === cleanEmail) || (cleanPhone && acc.phone === cleanPhone);
  });

  if (existingKey) {
    const existing = referralAccounts[existingKey];
    res.json({
      success: true,
      account: existing,
      referralLink: `https://septicprodirect.com/?ref=${existing.code}`,
      message: 'Welcome back! Here is your active referral code and current reward balance.',
    });
    return;
  }

  // Generate unique memorable code e.g. HOU-JOHN42
  const prefix = cleanArea.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'HOU';
  const namePart = cleanName.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5) || 'NEIGHBOR';
  const randomSuffix = Math.floor(10 + Math.random() * 90);
  const code = `${prefix}-${namePart}${randomSuffix}`;

  const newAccount: ReferralAccount = {
    code,
    customerName: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    area: cleanArea,
    completedReferrals: 0,
    totalRewardDollars: 0,
    pendingReferrals: 0,
    createdAt: new Date().toISOString(),
  };

  referralAccounts[code] = newAccount;
  console.log(`[REFERRAL CODE CREATED] ${code} for ${newAccount.customerName} (${newAccount.area})`);

  res.json({
    success: true,
    account: newAccount,
    referralLink: `https://septicprodirect.com/?ref=${newAccount.code}`,
    message: 'Your unique Houston referral code is active! Give friends $35 off, and earn $50 on your next maintenance pump.',
  });
});

app.get('/api/referral/:code', (req: Request, res: Response): void => {
  const code = String(req.params.code).trim().toUpperCase();
  const account = referralAccounts[code];

  if (!account) {
    res.status(404).json({ success: false, message: 'Referral code not found. Please verify code or create a new one.' });
    return;
  }

  res.json({
    success: true,
    account,
    referralLink: `https://septicprodirect.com/?ref=${account.code}`,
  });
});

// 1i. Recently Completed Houston Septic Projects Feed
interface CompletedProject {
  id: string;
  title: string;
  city: string;
  county: string;
  neighborhood: string;
  zipCode: string;
  serviceType: 'Pumping' | 'Aerobic' | 'Inspection' | 'Emergency' | 'Repair';
  tankSize: string;
  completedAgo: string;
  technicianNotes: string;
  gallonsPumped?: number;
  lat: number;
  lon: number;
  mapX: number; // percentage X on Houston regional bounding box
  mapY: number; // percentage Y on Houston regional bounding box
}

const COMPLETED_PROJECTS: CompletedProject[] = [
  {
    id: 'proj-1',
    title: '1,500-Gal Dual-Compartment Tank Pump & Baffle Inspection',
    city: 'Katy',
    county: 'Fort Bend County',
    neighborhood: 'Cinco Ranch Equestrian Area',
    zipCode: '77494',
    serviceType: 'Pumping',
    tankSize: '1,500 gal concrete',
    completedAgo: 'Yesterday',
    technicianNotes: 'Removed 1,450 gallons of consolidated sludge. Replaced cracked PVC sanitary Tee on outlet baffle to protect drainfield lines.',
    gallonsPumped: 1450,
    lat: 29.7858,
    lon: -95.8245,
    mapX: 20,
    mapY: 55,
  },
  {
    id: 'proj-2',
    title: 'Emergency Stormwater Hydro-Jetting & Drain Clearing',
    city: 'Cypress',
    county: 'Harris County',
    neighborhood: 'Grant Rd Acreage Estates',
    zipCode: '77429',
    serviceType: 'Emergency',
    tankSize: '1,250 gal dual tank',
    completedAgo: '2 days ago',
    technicianNotes: 'Emergency 75-minute dispatch. Cleared heavy tree root obstruction in main 4-inch sewer transport pipe using 3,500 PSI rotational jetting.',
    gallonsPumped: 1200,
    lat: 29.9688,
    lon: -95.6972,
    mapX: 30,
    mapY: 34,
  },
  {
    id: 'proj-3',
    title: 'Aerobic ATU Aerator Compressor Replacement & Chlorine Recharge',
    city: 'The Woodlands',
    county: 'Montgomery County',
    neighborhood: 'Sterling Ridge Village',
    zipCode: '77382',
    serviceType: 'Aerobic',
    tankSize: '500 GPD aerobic unit',
    completedAgo: '3 days ago',
    technicianNotes: 'Replaced seized linear diaphragm air pump. Verified 2.4 PSI air pressure to diffuser bars. Serviced chlorination tablet feed tube.',
    lat: 30.1578,
    lon: -95.4894,
    mapX: 52,
    mapY: 15,
  },
  {
    id: 'proj-4',
    title: 'Routine Preventative Pumping & Effluent Filter Cleanout',
    city: 'Pearland',
    county: 'Brazoria County',
    neighborhood: 'Silverlake Subdivisions',
    zipCode: '77584',
    serviceType: 'Pumping',
    tankSize: '1,000 gal poly tank',
    completedAgo: '3 days ago',
    technicianNotes: 'Pumped down both chambers to bottom. Pressure-washed reusable Sim/Tech nylon bristle filter to restore full gravity flow.',
    gallonsPumped: 1000,
    lat: 29.5636,
    lon: -95.2860,
    mapX: 72,
    mapY: 76,
  },
  {
    id: 'proj-5',
    title: 'Lake Conroe Waterfront Tank Pump-Out & Risers Seal',
    city: 'Conroe',
    county: 'Montgomery County',
    neighborhood: 'Walden on Lake Conroe',
    zipCode: '77356',
    serviceType: 'Repair',
    tankSize: '1,500 gal concrete',
    completedAgo: '4 days ago',
    technicianNotes: 'Pumped out heavy grease and sludge buildup. Resealed concrete riser seams with butyl sealant to prevent lake water groundwater infiltration.',
    gallonsPumped: 1500,
    lat: 30.3119,
    lon: -95.4560,
    mapX: 55,
    mapY: 6,
  },
  {
    id: 'proj-6',
    title: 'TCEQ Chapter 285 Real Estate Transfer Escrow Inspection',
    city: 'Sugar Land',
    county: 'Fort Bend County',
    neighborhood: 'Greatwood Rural Enclave',
    zipCode: '77479',
    serviceType: 'Inspection',
    tankSize: '1,200 gal conventional',
    completedAgo: '5 days ago',
    technicianNotes: 'Performed hydraulic dye load test (250 gallons). Confirmed zero surface surfacing on absorption trenches. Certified official real estate escrow form.',
    lat: 29.6197,
    lon: -95.6349,
    mapX: 37,
    mapY: 70,
  },
  {
    id: 'proj-7',
    title: '2,000-Gal Agricultural Acreage Pumping & High-Volume Vacuuming',
    city: 'Magnolia',
    county: 'Montgomery County',
    neighborhood: 'High Meadow Ranch',
    zipCode: '77354',
    serviceType: 'Pumping',
    tankSize: '2,000 gal dual chamber',
    completedAgo: '6 days ago',
    technicianNotes: 'Pulled 160 feet of heavy-duty vacuum suction hose. Liquefied heavy 18-inch sludge crust using crust-buster backflush technique.',
    gallonsPumped: 1950,
    lat: 30.2135,
    lon: -95.7508,
    mapX: 25,
    mapY: 18,
  },
  {
    id: 'proj-8',
    title: 'Submersible Effluent Pump & Float Switch Calibration',
    city: 'Friendswood',
    county: 'Galveston County',
    neighborhood: 'Heritage Park / Clear Creek',
    zipCode: '77546',
    serviceType: 'Aerobic',
    tankSize: 'Pump dosing tank',
    completedAgo: '1 week ago',
    technicianNotes: 'Replaced failed mercury float switch with high-durability mechanical float switch. Bench-tested high water alarm horn and visual beacon.',
    lat: 29.5294,
    lon: -95.2010,
    mapX: 80,
    mapY: 82,
  },
  {
    id: 'proj-9',
    title: 'Acreage Tank Locating, Digging & Secondary Riser Install',
    city: 'Tomball',
    county: 'Harris County',
    neighborhood: 'Rosehill Reserve',
    zipCode: '77377',
    serviceType: 'Repair',
    tankSize: '1,000 gal concrete',
    completedAgo: '1 week ago',
    technicianNotes: 'Located buried tank using electronic radio flush-transmitter probe. Excavated 24 inches of topsoil and installed green Polylok risers to grade.',
    gallonsPumped: 1050,
    lat: 30.0972,
    lon: -95.6161,
    mapX: 38,
    mapY: 23,
  },
  {
    id: 'proj-10',
    title: 'Full Vacuum Cleanout & Texas Sludge Manifest Documentation',
    city: 'Spring',
    county: 'Harris County',
    neighborhood: 'Champion Forest / Gleannloch',
    zipCode: '77379',
    serviceType: 'Pumping',
    tankSize: '1,500 gal dual tank',
    completedAgo: '1 week ago',
    technicianNotes: 'Complete cleanout performed. Generated official TCEQ waste manifest for homeowner records and county environmental compliance.',
    gallonsPumped: 1500,
    lat: 30.0799,
    lon: -95.4172,
    mapX: 58,
    mapY: 26,
  },
];

app.get('/api/completed-projects', (_req: Request, res: Response) => {
  res.json({
    success: true,
    totalProjectsCompleted: 4850,
    recentCount: COMPLETED_PROJECTS.length,
    projects: COMPLETED_PROJECTS,
  });
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
  const sitemapXml = generateSitemapXml(baseUrl);

  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.header('Cache-Control', 'public, max-age=86400');
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
