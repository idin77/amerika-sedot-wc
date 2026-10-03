import { CityArea, FAQItem, ServiceItem } from '../types';

export const BUSINESS_CONFIG = {
  brandName: 'SepticProDirect',
  legalName: 'SepticProDirect Referral & Dispatch Network',
  tagline: 'Professional Septic Tank Pumping in Houston, TX',
  domain: typeof window !== 'undefined' ? window.location.origin : 'https://www.septicprodirect.com',
  phoneDisplay: '+62 857-1655-1653',
  phoneRaw: '+6285716551653',
  whatsappRaw: '6285716551653',
  whatsappUrl: 'https://wa.me/6285716551653?text=Hello%20SepticProDirect,%20I%20would%20like%20to%20inquire%20about%20septic%20tank%20services%20in%20Houston,%20TX',
  email: 'service@septicprodirect.com',
  targetMarket: 'Greater Houston Metropolitan Area, Texas',
  primaryCity: 'Houston',
  state: 'TX',
  currency: 'USD',
  tceqRegulatoryReference: 'TCEQ (Texas Commission on Environmental Quality) Rule 30 TAC Chapter 285',
  
  // Honest business model disclosure statement
  transparencyNotice:
    'SepticProDirect is an independent marketing and contractor dispatch platform. We connect homeowners in Greater Houston with verified, licensed, and insured local septic contractors. On-site septic tank pumping, inspections, cleaning, and repairs are performed directly by qualified local partners holding valid TCEQ licensing.',

  pricingTransparencyNotice:
    'Exact septic service costs vary based on tank capacity (typically 750 to 1,500 gallons), depth of access lids, ease of truck access from the driveway, effluent filter condition, and municipal disposal fees. Our partners provide clear, upfront quotes before starting any work.',

  typicalPriceRanges: [
    {
      size: '500 – 750 Gallons',
      range: '$325 – $450',
      idealFor: 'Small 1–2 bedroom homes or aerobic trash tanks',
    },
    {
      size: '1,000 Gallons',
      range: '$425 – $575',
      idealFor: 'Standard 3–4 bedroom residential suburban homes',
    },
    {
      size: '1,250 – 1,500 Gallons',
      range: '$525 – $725',
      idealFor: 'Large 4+ bedroom residences or heavy-usage systems',
    },
  ],
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'pumping',
    slug: 'septic-tank-pumping-houston-tx',
    name: 'Septic Tank Pumping',
    headline: 'Reliable Residential Septic Tank Pumping in Houston, TX',
    shortDesc: 'Complete removal of liquid scum and bottom sludge using high-capacity vacuum trucks to prevent drainfield backups.',
    fullDesc:
      'Regular septic tank pumping is essential to keep your onsite wastewater system functioning properly in Southeast Texas clay soils. Our local contractor partners utilize heavy-duty vacuum pump trucks to extract accumulated solid sludge and floating scum layers, ensuring your drainfield remains protected from catastrophic failure.',
    pricingEstimate: '$375 – $650 (depends on tank capacity & access)',
    frequency: 'Every 3 to 5 years for conventional systems (or annually for aerobic trash tanks)',
    commonSigns: [
      'Gurgling sounds in sinks, showers, or toilets',
      'Slow household drains throughout the entire home',
      'Unpleasant sewage odors near the septic tank or drainfield',
      'Spongy, unusually lush green patches over the absorption area',
      'Minor liquid pooling around the tank riser lid',
    ],
    processSteps: [
      {
        title: 'Site Arrival & Access Assessment',
        desc: 'Contractor verifies tank location, checks distance from the driveway, and carefully exposes the main access port or riser lid.',
      },
      {
        title: 'Depth Measurement & Sludge Assessment',
        desc: 'The technician measures scum and sludge layer thickness to evaluate overall system load and inspect the tank liquid level.',
      },
      {
        title: 'Vacuum Extraction & Crust Agitation',
        desc: 'Using high-vacuum suction hoses, the technician empties both scum and sludge layers, breaking up settled solids for complete removal.',
      },
      {
        title: 'Baffle & Flow Inspection',
        desc: 'Inlet and outlet sanitary tees/baffles are visually inspected for integrity, and household water flow is verified before sealing lids.',
      },
    ],
    seoTitle: 'Septic Tank Pumping Houston TX | Fast & Local Pumping Services',
    metaDesc: 'Looking for septic tank pumping in Houston, TX? Connect with vetted local vacuum pumping contractors for residential septic service, sludge removal, and upfront quotes.',
    canonicalUrl: '/septic-tank-pumping-houston-tx/',
  },
  {
    id: 'cleaning',
    slug: 'septic-tank-cleaning-houston',
    name: 'Septic Tank Cleaning',
    headline: 'Thorough Septic Tank Cleaning & Sludge Hydro-Jetting in Houston',
    shortDesc: 'Deep interior tank wall power-washing, heavy sediment breakdown, and complete residue removal.',
    fullDesc:
      'While standard pumping extracts liquid and loose solids, complete septic tank cleaning goes a step further by breaking down hardened sludge crusts, power-washing interior concrete walls, and clearing accumulated organic deposits from baffles and chambers.',
    pricingEstimate: '$450 – $750 (includes wall rinsing & crust agitation)',
    frequency: 'Recommended every second pumping cycle or when heavy buildup occurs',
    commonSigns: [
      'Tank has not been pumped or serviced in over 6 years',
      'Hardened surface crust preventing standard suction',
      'Recurring sluggish drainage shortly after a partial pump',
      'Solid carryover detected near the outlet baffle',
    ],
    processSteps: [
      {
        title: 'Total Liquid & Sludge Evacuation',
        desc: 'Initial high-power vacuum extraction of the primary wastewater and floating scum layers.',
      },
      {
        title: 'Hydro-Jet Agitation & Wall Wash',
        desc: 'High-pressure water washing of interior concrete walls, seams, and corners to dislodge caked sludge.',
      },
      {
        title: 'Bottom Silt & Sand Removal',
        desc: 'Extraction of dense non-biodegradable silt that settles at the very bottom of the tank floor.',
      },
      {
        title: 'Sanitary Component Rinsing',
        desc: 'Thorough spray down of inlet and outlet tees to prevent blockages moving downstream to the drainfield.',
      },
    ],
    seoTitle: 'Septic Tank Cleaning Houston | Deep Tank Wall & Sludge Washing',
    metaDesc: 'Need thorough septic tank cleaning in Houston? Local partner contractors provide deep tank washing, sludge crust agitation, and complete sediment evacuation.',
    canonicalUrl: '/septic-tank-cleaning-houston/',
  },
  {
    id: 'inspection',
    slug: 'septic-tank-inspection-houston',
    name: 'Septic Tank Inspection',
    headline: 'Thorough Real Estate & Routine Septic Inspections in Houston, TX',
    shortDesc: 'Comprehensive mechanical, hydraulic, and structural evaluations complying with Texas TCEQ guidelines.',
    fullDesc:
      'Whether you are purchasing a home in Greater Houston or require routine certification, our independent partner technicians conduct detailed multi-point inspections. We evaluate tank structural integrity, baffle condition, liquid operating levels, and drainfield absorption capacity.',
    pricingEstimate: '$300 – $500 (official real estate transfer reports)',
    frequency: 'Before real estate closing or every 2–3 years for peace of mind',
    commonSigns: [
      'Buying or selling a residential home with an onsite septic system',
      'Mortgage lender or title company requiring a septic inspection letter',
      'Uncertainty about the age, location, or condition of an older tank',
      'Suspected root intrusion or ground settling near the tank',
    ],
    processSteps: [
      {
        title: 'Documentation & Layout Review',
        desc: 'Reviewing county permits, site maps, and locating tank lids, distribution boxes, and drainfield boundaries.',
      },
      {
        title: 'Operating Level & Hydraulic Load Test',
        desc: 'Checking if liquid levels sit at the proper operating height below the outlet invert; testing fixture flow.',
      },
      {
        title: 'Structural & Baffle Verification',
        desc: 'Inspecting interior concrete or poly walls for cracks, root intrusion, and assessing inlet/outlet baffle stability.',
      },
      {
        title: 'Written Condition Report',
        desc: 'Delivering a detailed written report outlining system status, needed repairs, and maintenance recommendations.',
      },
    ],
    seoTitle: 'Septic Tank Inspection Houston TX | Real Estate & TCEQ Compliance',
    metaDesc: 'Professional septic tank inspections in Houston for home buyers, sellers, and property owners. Detailed reports on tank integrity, baffles, and drainfield status.',
    canonicalUrl: '/septic-tank-inspection-houston/',
  },
  {
    id: 'maintenance',
    slug: 'septic-tank-maintenance-houston',
    name: 'Septic Tank Maintenance',
    headline: 'Preventative Septic Maintenance & Effluent Filter Service in Houston',
    shortDesc: 'Routine filter cleaning, aerobic chlorinator checks, and preventative care to maximize system lifespan.',
    fullDesc:
      'Preventative care protects your septic system investment and shields your yard from costly repairs. Our partner contractors service effluent filters, inspect aerobic air pumps and chlorination units, and ensure wastewater is moving properly without stressing local Texas soil absorption fields.',
    pricingEstimate: '$175 – $350 (routine filter & mechanical checks)',
    frequency: 'Every 6 to 12 months for filters; ongoing monitoring for aerobic systems',
    commonSigns: [
      'Water backing up into bathtubs when laundry runs',
      'Effluent filter warning or slow drainage at secondary fixtures',
      'Aerobic system control panel red light or audible warning chime',
      'Routine 1-year service milestone reached',
    ],
    processSteps: [
      {
        title: 'Effluent Screen Cleaning',
        desc: 'Pulling and power-washing the outlet effluent filter inside the tank to restore unrestricted water discharge.',
      },
      {
        title: 'Aerobic & Mechanical Unit Check',
        desc: 'Inspecting air compressors, diffusers, control timers, and chlorine disinfectant levels on aerobic setups.',
      },
      {
        title: 'Drainfield Perimeter Walk',
        desc: 'Checking the absorption field for surface puddling, heavy vehicle compaction, or invasive plant roots.',
      },
      {
        title: 'Homeowner Care Guidelines',
        desc: 'Advising on water conservation and septic-safe products tailored to Southeast Texas water chemistry.',
      },
    ],
    seoTitle: 'Septic Tank Maintenance Houston | Filter Cleaning & Preventative Care',
    metaDesc: 'Keep your Houston septic system running smoothly. Preventative maintenance, effluent filter cleaning, and mechanical checks by local certified septic technicians.',
    canonicalUrl: '/septic-tank-maintenance-houston/',
  },
  {
    id: 'emergency',
    slug: 'emergency-septic-service-houston',
    name: 'Emergency Septic Service',
    headline: 'Urgent Septic Backup Dispatch in Greater Houston, TX',
    shortDesc: 'Prompt assistance for severe wastewater overflows, full tank backups, and high-water emergencies.',
    fullDesc:
      'A septic backup inside your home is a stressful sanitation hazard that requires immediate attention. When you request emergency dispatch, SepticProDirect connects your inquiry with available local contractor partners in the Houston area who have open capacity to pump overfilled tanks and diagnose urgent clogs.',
    pricingEstimate: 'Quotes provided upfront based on dispatch timing and after-hours availability',
    frequency: 'As needed when severe backups or alarms occur',
    commonSigns: [
      'Raw sewage backing up into lowest house drains (showers, toilets)',
      'Continuous septic alarm sounding on aerobic control panels',
      'Septic tank overflowing onto the lawn or driveway',
      'Complete home drainage standstill',
    ],
    processSteps: [
      {
        title: 'Rapid Inquiry Triage',
        desc: 'We immediately review your urgent request and query available partner pumpers within your specific ZIP code.',
      },
      {
        title: 'Direct Contractor Contact',
        desc: 'An available local partner contacts you to confirm ETA, discuss access, and provide transparent after-hours quote details.',
      },
      {
        title: 'Emergency Pumping & Relief',
        desc: 'The technician extracts wastewater from the tank to immediately relieve hydrostatic pressure and stop indoor backups.',
      },
      {
        title: 'Root Cause Diagnosis',
        desc: 'Once the tank is pumped down, the technician pinpoints whether the backup was caused by high solids, a clogged main line, or drainfield saturation.',
      },
    ],
    seoTitle: 'Emergency Septic Service Houston TX | Urgent Backup & Pumping Dispatch',
    metaDesc: 'Experiencing a septic backup in Houston? Connect with local septic contractors for rapid emergency pumping dispatch, urgent tank pump-outs, and upfront pricing.',
    canonicalUrl: '/emergency-septic-service-houston/',
  },
];

export const SERVICE_AREAS: CityArea[] = [
  {
    id: 'houston',
    slug: 'houston-tx',
    name: 'Houston',
    state: 'TX',
    county: 'Harris County',
    zipCodes: ['77002', '77024', '77040', '77044', '77055', '77070', '77079', '77084', '77095'],
    systemTypes: 'Conventional gravity septic, low-pressure dosing, aerobic treatment units (ATU)',
    soilNotes: 'Heavy Beaumont and Lake Charles clay soils requiring proper sizing and regular pumping.',
    dispatchNote: 'Prompt local partner coverage across North, Northwest, and West Houston unincorporated pockets.',
    metaDesc: 'Professional septic tank pumping, cleaning, and inspections in Houston, TX. Connect with trusted local licensed septic contractors in Harris County.',
  },
  {
    id: 'katy',
    slug: 'katy-tx',
    name: 'Katy',
    state: 'TX',
    county: 'Harris & Fort Bend Counties',
    zipCodes: ['77449', '77450', '77493', '77494'],
    systemTypes: 'Residential aerobic spray systems and conventional multi-compartment tanks',
    soilNotes: 'Dense clayey soil with slow percolation, making regular filter checks and tank pump-outs vital.',
    dispatchNote: 'Daily service partner routes covering Old Katy, Cinco Ranch out-parcels, and rural Katy acreage properties.',
    metaDesc: 'Septic tank pumping in Katy, TX. Local licensed contractor dispatch for residential septic cleaning, inspections, and maintenance.',
  },
  {
    id: 'sugar-land',
    slug: 'sugar-land-tx',
    name: 'Sugar Land',
    state: 'TX',
    county: 'Fort Bend County',
    zipCodes: ['77478', '77479', '77498'],
    systemTypes: 'Aerobic treatment systems and older estate conventional tanks',
    soilNotes: 'Brazos River alluvial silt and clay layers with seasonal high-water tables.',
    dispatchNote: 'Experienced partner technicians serving Sugar Land, Greatwood fringe, and New Territory acreage lots.',
    metaDesc: 'Expert septic tank pumping and maintenance in Sugar Land, TX. Reliable Fort Bend County septic contractor matching.',
  },
  {
    id: 'the-woodlands',
    slug: 'the-woodlands-tx',
    name: 'The Woodlands',
    state: 'TX',
    county: 'Montgomery County',
    zipCodes: ['77380', '77381', '77382', '77389'],
    systemTypes: 'Engineered aerobic systems and perimeter conventional absorption fields',
    soilNotes: 'Sandy loam over dense clay; tree root intrusion into tank seams is a frequent maintenance factor.',
    dispatchNote: 'Fast partner response across South Montgomery County and Creekside Park outer residential parcels.',
    metaDesc: 'Septic tank pumping and cleaning in The Woodlands, TX. Certified Montgomery County septic partner dispatch.',
  },
  {
    id: 'pearland',
    slug: 'pearland-tx',
    name: 'Pearland',
    state: 'TX',
    county: 'Brazoria & Harris Counties',
    zipCodes: ['77581', '77584', '77588'],
    systemTypes: 'Conventional gravity systems, aerobic drip irrigation, and pump tanks',
    soilNotes: 'Flat coastal plain heavy clay with slow drainage after heavy Gulf storm events.',
    dispatchNote: 'Serving residential homeowners throughout Pearland, Brookside Village, and surrounding Brazoria areas.',
    metaDesc: 'Septic tank pumping services in Pearland, TX. Quality residential tank pumping, inspections, and emergency assistance.',
  },
  {
    id: 'cypress',
    slug: 'cypress-tx',
    name: 'Cypress',
    state: 'TX',
    county: 'Harris County',
    zipCodes: ['77429', '77433'],
    systemTypes: 'High prevalence of residential aerobic treatment systems with surface spray or drip fields',
    soilNotes: 'Black gumbo clay with low permeability; regular 3-year pumping prevents drainfield choke.',
    dispatchNote: 'Active partner truck routes throughout Cypress, Bridgeland periphery, and Telge/Grant Rd acreage homes.',
    metaDesc: 'Reliable septic tank pumping in Cypress, TX. Connect with licensed local pumpers for tank cleanouts and filter care.',
  },
  {
    id: 'spring',
    slug: 'spring-tx',
    name: 'Spring',
    state: 'TX',
    county: 'Harris & Montgomery Counties',
    zipCodes: ['77373', '77379', '77386', '77388'],
    systemTypes: 'Conventional dual-compartment septic systems and aerobic units',
    soilNotes: 'Mixed piney woods sandy topsoil over hardpan clay; filter maintenance is essential.',
    dispatchNote: 'Prompt dispatch covering Spring, Klein, and Champion Forest outskirts.',
    metaDesc: 'Septic tank pumping & inspection in Spring, TX. Experienced local technicians for residential septic maintenance.',
  },
  {
    id: 'conroe',
    slug: 'conroe-tx',
    name: 'Conroe',
    state: 'TX',
    county: 'Montgomery County',
    zipCodes: ['77301', '77302', '77303', '77304', '77384', '77385'],
    systemTypes: 'Extensive acreage residential septic systems, aerobic sprayers, and larger capacity tanks',
    soilNotes: 'Montgomery County rolling sandy clay soils; larger lot sizes require longer vacuum hose runs.',
    dispatchNote: 'High partner availability for Lake Conroe properties, Conroe rural estates, and timber tracts.',
    metaDesc: 'Septic tank pumping in Conroe, TX. Professional tank cleaning, inspection, and maintenance in Montgomery County.',
  },
  {
    id: 'tomball',
    slug: 'tomball-tx',
    name: 'Tomball',
    state: 'TX',
    county: 'Harris County',
    zipCodes: ['77375', '77377'],
    systemTypes: 'Acreage residential conventional tanks and residential aerobic wastewater units',
    soilNotes: 'Clay loam soils; seasonal wet periods demand proactive preventative pumping.',
    dispatchNote: 'Dedicated partner coverage throughout Tomball, Rosehill, and outer Decker Prairie.',
    metaDesc: 'Septic tank pumping and cleaning in Tomball, TX. Honest quotes and verified local contractor dispatch.',
  },
  {
    id: 'richmond',
    slug: 'richmond-tx',
    name: 'Richmond',
    state: 'TX',
    county: 'Fort Bend County',
    zipCodes: ['77406', '77469'],
    systemTypes: 'Standard residential septic tanks and advanced aerobic drip systems',
    soilNotes: 'Alluvial Brazos clay soils with slow absorption; proper pump maintenance protects drain lines.',
    dispatchNote: 'Local partner coverage for Richmond, Pecan Grove surroundings, and Lamar acreage homes.',
    metaDesc: 'Septic tank pumping services in Richmond, TX. Connect with licensed local pumpers in Fort Bend County.',
  },
  {
    id: 'friendswood',
    slug: 'friendswood-tx',
    name: 'Friendswood',
    state: 'TX',
    county: 'Galveston & Harris Counties',
    zipCodes: ['77546'],
    systemTypes: 'Conventional systems and aerobic treatment setups',
    soilNotes: 'High coastal water table; tight tank lid sealing prevents rainwater infiltration.',
    dispatchNote: 'Dependable service partner routes covering Friendswood residential subdivisions.',
    metaDesc: 'Septic tank pumping in Friendswood, TX. Prompt contractor matching for residential pumping and inspections.',
  },
  {
    id: 'league-city',
    slug: 'league-city-tx',
    name: 'League City',
    state: 'TX',
    county: 'Galveston County',
    zipCodes: ['77573'],
    systemTypes: 'Aerobic treatment units and older residential septic systems',
    soilNotes: 'Coastal plain clay loam; regular maintenance prevents high-water alarm triggers.',
    dispatchNote: 'Serving non-municipal septic properties throughout League City and Clear Creek pockets.',
    metaDesc: 'Septic tank pumping & inspection in League City, TX. Trusted local septic contractors and upfront pricing.',
  },
  {
    id: 'humble',
    slug: 'humble-tx',
    name: 'Humble',
    state: 'TX',
    county: 'Harris County',
    zipCodes: ['77338', '77346', '77396'],
    systemTypes: 'Residential septic tanks and aerobic treatment systems',
    soilNotes: 'San Jacinto River drainage basin soils; periodic tank pumping keeps drainfields healthy.',
    dispatchNote: 'Active partner routes serving Humble, Atascocita periphery, and outer Kingwood borders.',
    metaDesc: 'Septic tank pumping in Humble, TX. Vetted local septic service partners for residential tank cleaning and care.',
  },
];

export const FREQUENTLY_ASKED_QUESTIONS: FAQItem[] = [
  {
    question: 'How often should a residential septic tank be pumped in Houston?',
    answer:
      'For a standard single-family home with a conventional septic system, pumping every 3 to 5 years is recommended by the EPA and TCEQ. If you have an aerobic treatment system, the trash/settling tank usually requires pumping every 2 to 3 years depending on household size and water consumption.',
    category: 'maintenance',
  },
  {
    question: 'How much does septic tank pumping cost in the Houston area?',
    answer:
      'Residential septic tank pumping in Greater Houston typically ranges from $375 to $650 for a standard 1,000-gallon tank. Factors affecting the final price include tank capacity, depth of the access lids (if digging is required to expose buried covers), accessibility from the driveway, condition of the effluent filter, and local waste disposal facility fees. Our local contractor partners provide transparent quotes before starting.',
    category: 'pricing',
  },
  {
    question: 'How does SepticProDirect work?',
    answer:
      'SepticProDirect is a specialized marketing and dispatch platform. When you submit your quote request or call our number, we review your service requirements and connect you with an independent, verified septic contractor partner serving your exact Houston ZIP code. The partner coordinates scheduling, performs on-site work with their specialized equipment, and bills you directly with clear pricing.',
    category: 'general',
  },
  {
    question: 'What are the main warning signs that my septic tank is full?',
    answer:
      'Key warning signs include: gurgling sounds in your plumbing fixtures, multiple slow drains throughout the house, foul sewage smells outdoors around the tank or drainfield, unusually lush, spongy green grass over the absorption area, or wastewater backing up into bathtubs or toilets.',
    category: 'maintenance',
  },
  {
    question: 'Do I need to dig up my yard before the septic truck arrives?',
    answer:
      'If your septic tank has modern risers with green or concrete lids flush with the ground, no digging is necessary. If your tank lids are buried under sod or soil, you can uncover them yourself beforehand to save money, or the technician can locate and uncover them for a reasonable labor charge (typically $50–$120 depending on depth).',
    category: 'general',
  },
  {
    question: 'Are SepticProDirect contractor partners licensed and insured in Texas?',
    answer:
      'Yes. We require all contractor partners in our dispatch network to carry valid Texas Commission on Environmental Quality (TCEQ) registrations (such as Registered Sludge Transporter and On-Site Sewage Facility licensing) and active commercial general liability insurance.',
    category: 'general',
  },
  {
    question: 'What happens during a professional septic tank pumping service?',
    answer:
      'The contractor pulls their vacuum truck near your tank, safely opens the main access manhole, measures solid depths, lowers a heavy-duty 3-to-4-inch vacuum hose, and evacuates both the top floating scum layer and heavy bottom sludge. The technician also agitates dense residue with a mixing tool and rinses the tank walls to ensure all settled solids are thoroughly removed.',
    category: 'general',
  },
  {
    question: 'What is the difference between septic pumping and septic cleaning?',
    answer:
      'Septic pumping involves vacuuming out the liquid wastewater and loose floating solids. Septic cleaning is a more intensive process that includes vacuuming plus high-pressure washing of the interior tank walls, breaking up hardened sludge crusts, and cleaning the effluent filter and sanitary baffles.',
    category: 'maintenance',
  },
  {
    question: 'Can I use chemical tank additives instead of pumping?',
    answer:
      'No. The EPA and plumbing authorities agree that chemical additives, enzymes, or yeast cannot replace physical pumping. Non-biodegradable solids, inorganic matter, and dense mineral sludge will always accumulate on the tank floor and must be physically vacuumed out to avoid ruining your drainfield.',
    category: 'maintenance',
  },
  {
    question: 'What should I do if raw sewage is currently backing up into my home?',
    answer:
      'Immediately stop running water: turn off washing machines, dishwashers, and avoid flushing toilets or running faucets. Next, call our dispatch line or submit an emergency quote request. We will query available local contractor partners for the earliest possible emergency pump-out dispatch.',
    category: 'emergency',
  },
];
