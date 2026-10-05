import { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Search, 
  Tag, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight,
  ExternalLink,
  Phone,
  Droplets,
  Layers,
  Sparkles,
  FileText
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'regulations' | 'soil' | 'aerobic' | 'emergency' | 'diy';
  categoryLabel: string;
  readTime: string;
  publishedDate: string;
  dateISO: string;
  author: string;
  authorRole: string;
  tags: string[];
  featured?: boolean;
  content: {
    introduction: string;
    sections: {
      heading: string;
      paragraphs: string[];
      bulletPoints?: string[];
      callout?: {
        type: 'warning' | 'tip' | 'regulation';
        text: string;
      };
    }[];
    localHoustonNote: string;
    faq: {
      question: string;
      answer: string;
    }[];
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'tceq-chapter-285-regulations',
    slug: 'tceq-chapter-285-regulations-houston-homeowners',
    title: 'TCEQ Chapter 285 Regulations: What Greater Houston Homeowners Must Know Before Pumping',
    excerpt: 'Understanding Texas On-Site Sewage Facility (OSSF) legal requirements, licensed sludge transporter trip tickets, and county permitting rules in Harris, Fort Bend, and Montgomery counties.',
    category: 'regulations',
    categoryLabel: 'TCEQ Regulations',
    readTime: '6 min read',
    publishedDate: 'October 2, 2026',
    dateISO: '2026-10-02',
    author: 'David Vance, PE',
    authorRole: 'OSSF Environmental Specialist',
    tags: ['TCEQ Rules', 'Harris County Permits', 'Trip Tickets', 'Legal Compliance'],
    featured: true,
    content: {
      introduction: 'In the State of Texas, septic systems are not merely private plumbing fixtures—they are legally classified as On-Site Sewage Facilities (OSSF) regulated under Title 30 of the Texas Administrative Code (TAC), Chapter 285. For Greater Houston homeowners, non-compliance can result in municipal citations, real estate transaction delays, or substantial fines from local county health districts.',
      sections: [
        {
          heading: '1. Why You Must Hire a Registered TCEQ Sludge Transporter',
          paragraphs: [
            'Texas law explicitly forbids unlicensed handymen or general plumbers from transporting septic waste on public roads. Under TCEQ §285.34, only registered Sludge Transporters with active TCEQ registration numbers are permitted to pump and haul wastewater.',
            'Each licensed truck displays a current TCEQ decal on both cab doors. Whenever your tank is pumped, the driver is mandated to provide a multi-part "Trip Ticket" or Disposal Manifest detailing the date, property address, estimated volume pumped, and the municipal treatment plant where the waste will be processed.'
          ],
          callout: {
            type: 'regulation',
            text: 'TCEQ Mandate: Retain your signed trip ticket for a minimum of 3 years. When selling a home in Texas, TREC property disclosure forms require proof of compliant septic maintenance.'
          }
        },
        {
          heading: '2. County-Specific Permitting Distinctions in Greater Houston',
          paragraphs: [
            'While TCEQ sets statewide minimum baselines, individual counties act as the "Authorized Agent" with power to enforce stricter rules:'
          ],
          bulletPoints: [
            'Harris County: Engineering permits and strict setbacks from bayous, ditches, and public water supply wells.',
            'Montgomery County: Mandatory maintenance contracts for aerobic systems unless certified as an owner-operator.',
            'Fort Bend County: Environmental Health department requires verified dye testing during disputed real estate inspections.',
            'Brazoria & Galveston Counties: High coastal water tables mandate elevated risers and watertight neoprene seals.'
          ]
        },
        {
          heading: '3. Routine Pumping Intervals Under Texas Standards',
          paragraphs: [
            'TCEQ recommends that tanks be evaluated annually and pumped when the total depth of scum and sludge exceeds 1/3 of the tank\'s total liquid depth. For a standard 3 to 4-bedroom home with a 1,000 to 1,500-gallon tank, this threshold is typically crossed every 2 to 3 years.'
          ],
          callout: {
            type: 'tip',
            text: 'Partner contractors in the SepticProDirect network are fully vetted, TCEQ-registered sludge transporters providing legally compliant waste manifests on every service.'
          }
        }
      ],
      localHoustonNote: 'Greater Houston soil has high groundwater tables after heavy storms. Never delay pumping if your cleanout caps show signs of sluggish drainage.',
      faq: [
        {
          question: 'Do I need a permit just to get my septic tank pumped in Texas?',
          answer: 'No permit is required for routine maintenance pumping. However, permits ARE required if you are replacing tanks, adding spray heads, modifying drainfield lateral lines, or installing risers.'
        },
        {
          question: 'What happens if a contractor dumps waste illegally?',
          answer: 'Illegal dumping is a Texas state environmental crime. Homeowners who unknowingly hire unlicensed "cash-only" haulers can face shared liability if the waste is traced back to their property.'
        }
      ]
    }
  },
  {
    id: 'houston-gumbo-clay-drainfields',
    slug: 'houston-gumbo-clay-drainfield-absorption-guide',
    title: 'Navigating Houston\'s Gumbo Clay: How Dense Soil Affects Drainfield Absorption',
    excerpt: 'Why Class IV heavy Beaumont and Lake Charles clays require customized septic pumping intervals, bi-annual inspections, and surface water diversion techniques.',
    category: 'soil',
    categoryLabel: 'Soil & Engineering',
    readTime: '5 min read',
    publishedDate: 'September 24, 2026',
    dateISO: '2026-09-24',
    author: 'Sarah Jenkins',
    authorRole: 'Soil & Hydrology Consultant',
    tags: ['Gumbo Clay', 'Drainfield Care', 'Soil Absorption', 'Harris County Soil'],
    content: {
      introduction: 'The Greater Houston region sits on ancient river delta deposits predominantly classified by geotechnical engineers as "Beaumont Clay" or "Gumbo Clay" (Class IV soil under TCEQ taxonomy). This dense, sticky clay expands dramatically when wet and shrinks into deep fissures during hot Texas summers, posing unique challenges for residential septic drainfields.',
      sections: [
        {
          heading: '1. The Percolation Challenge of Class IV Soil',
          paragraphs: [
            'Unlike sandy loams in East Texas or rocky limestone in the Hill Country, Houston clay particles are microscopic flat plates. When saturated, they swell and lock together, reducing water percolation rates to near zero.',
            'Because wastewater cannot percolate downward rapidly, conventional gravity drainfields in Houston have a much higher risk of surface breakouts and hydraulic overload compared to national averages.'
          ],
          callout: {
            type: 'warning',
            text: 'Warning: If your yard has Class IV clay, letting solids escape your tank into the drainfield creates an impermeable "biomat" that will permanently ruin the absorption field, requiring a $10,000+ replacement.'
          }
        },
        {
          heading: '2. Why Frequent Pumping Is Cheaper Than Soil Remediation',
          paragraphs: [
            'In sandy soils, an overdue tank might take 5 years to fail. In Houston gumbo clay, an overdue tank that discharges suspended solids can suffocate lateral lines in as little as 6 to 12 months. Routine vacuum pumping every 24 months is the single most effective way to protect clay drainfields.'
          ]
        }
      ],
      localHoustonNote: 'Drainage swales around Cypress, Katy, and Pearland should always direct gutter downspouts at least 15 feet away from septic drainfields to avoid saturating clay soils.',
      faq: [
        {
          question: 'Can additives like yeast or chemicals improve clay soil drainage?',
          answer: 'No. Chemical additives and yeast do not alter the physical mineral structure of clay. Worse, chemical additives can liquefy scum layers and push them directly into the drainfield pores.'
        }
      ]
    }
  },
  {
    id: 'aerobic-septic-contracts-texas',
    slug: 'aerobic-septic-maintenance-contracts-texas-counties',
    title: 'Aerobic Septic Maintenance Contracts in Texas: Are They Mandatory in Your County?',
    excerpt: 'County-by-county breakdown of mandatory maintenance provider agreements, inspection frequency, and chlorine tablet compliance across Houston metropolitan counties.',
    category: 'aerobic',
    categoryLabel: 'Aerobic ATU',
    readTime: '5 min read',
    publishedDate: 'September 18, 2026',
    dateISO: '2026-09-18',
    author: 'Marcus Sterling',
    authorRole: 'Certified OSSF Maintenance Inspector',
    tags: ['Aerobic Systems', 'Maintenance Contracts', 'Sprinkler Heads', 'Chlorine Tablets'],
    content: {
      introduction: 'Aerobic Treatment Units (ATUs) function like miniature municipal sewage plants in your backyard, using oxygen injection and chlorination before dispersing clear effluent through surface sprinkler heads or drip tubing. Because surface-sprayed wastewater must be sanitary, Texas regulations require rigorous maintenance oversight.',
      sections: [
        {
          heading: '1. Texas State Law vs. County Discretion',
          paragraphs: [
            'Under TCEQ §285.7, initial installation of an aerobic system requires an active 2-year maintenance contract with a licensed Maintenance Provider. After the initial 2-year warranty period expires, Texas law permits individual counties to decide whether homeowners must maintain continuous third-party contracts.'
          ],
          bulletPoints: [
            'Montgomery County (Conroe, The Woodlands): Strictly enforces ongoing maintenance contracts filed with county records.',
            'Fort Bend County (Sugar Land, Missouri City): Requires annual verification of maintenance agreements for all surface application systems.',
            'Harris County: Homeowners can take a certified training course to self-inspect, otherwise a contract is mandated.',
            'Waller & Liberty Counties: Random inspections with notices sent for non-functioning sprayers.'
          ],
          callout: {
            type: 'regulation',
            text: 'Safety Alert: Never use swimming pool trichlor tablets in aerobic septic chlorinators. Pool chlorine reacts with septic gases to produce explosive nitrogen trichloride. Always use NSF-approved calcium hypochlorite.'
          }
        },
        {
          heading: '2. Pumping Requirements for Aerobic Trash Tanks',
          paragraphs: [
            'Many homeowners falsely assume aerobic systems never need pumping because of the air compressor. In reality, aerobic systems include a "Pre-Treatment Trash Tank" that collects non-digestible solids. This chamber must be pumped every 2 to 3 years to prevent clogging the clarifier chamber and burning out the discharge pump.'
          ]
        }
      ],
      localHoustonNote: 'Keep an extra air compressor diaphragm repair kit on hand. Houston summer heat frequently degrades rubber pump diaphragms.',
      faq: [
        {
          question: 'How often does an aerobic system need inspection under contract?',
          answer: 'Standard Texas maintenance agreements mandate inspections every 4 months (3 visits per year), checking the aerator PSI, high-water alarms, clarifier sludge levels, and chlorine residual.'
        }
      ]
    }
  },
  {
    id: 'hurricane-flood-septic-protocols',
    slug: 'post-hurricane-flood-septic-tank-pumping-protocols',
    title: 'Post-Hurricane & Flood Septic Protocols: Why You Must Never Pump a Submerged Tank',
    excerpt: 'Crucial flood recovery advice for Gulf Coast homeowners: why pumping waterlogged tanks causes them to float and crack, and how to safely inspect flooded systems.',
    category: 'emergency',
    categoryLabel: 'Storm Preparedness',
    readTime: '7 min read',
    publishedDate: 'September 10, 2026',
    dateISO: '2026-09-10',
    author: 'David Vance, PE',
    authorRole: 'OSSF Environmental Specialist',
    tags: ['Flooding', 'Hurricanes', 'Gulf Coast Weather', 'Emergency Protocols'],
    content: {
      introduction: 'Tropical storms and hurricanes frequently bring catastrophic rainfall to Greater Houston, saturating low-lying subdivisions along the San Jacinto River, Buffalo Bayou, and Brazos River basins. When septic tanks and drainfields are inundated with floodwaters, traditional maintenance rules change completely.',
      sections: [
        {
          heading: '1. The Danger of "Tank Pop-Out" (Buoyancy Failure)',
          paragraphs: [
            'The single most critical rule of post-flood septic management: NEVER pump out a septic tank while the surrounding soil is waterlogged.',
            'An empty 1,000-gallon fiberglass or concrete tank acts like a boat hull. When water tables are elevated above the tank floor, hydrostatic pressure exerts immense upward buoyant force. Pumping the heavy liquid out of the tank can cause it to violently pop out of the ground, snapping inlet and outlet pipes and tearing up patios and sod.'
          ],
          callout: {
            type: 'warning',
            text: 'Danger: Wait until groundwater recedes below the tank lid level before calling for vacuum pumping service. Pumping an underwater tank will destroy the tank and invalidate insurance coverage.'
          }
        },
        {
          heading: '2. Steps to Take While Floodwaters Recede',
          paragraphs: [
            'While your yard is flooded, stop using household water as much as possible. Do not flush toilets or run dishwashers, as sewage will back up into bathtubs.',
            'Turn off the circuit breaker to your aerobic air compressor and effluent pump to prevent electrical shorts and burnt motors from silt intrusion.'
          ]
        }
      ],
      localHoustonNote: 'Subdivisions in Kingwood, Humble, and Spring should inspect electrical control boxes for silt intrusion after major storm surges.',
      faq: [
        {
          question: 'Can drinking water wells be contaminated by flooded septic tanks?',
          answer: 'Yes. If floodwaters submerge your septic tank and wellhead, assume the well is contaminated. Boil water for drinking and test for coliform bacteria before using.'
        }
      ]
    }
  },
  {
    id: 'drainfield-failure-vs-full-tank',
    slug: 'warning-signs-drainfield-failure-vs-full-tank-symptoms',
    title: 'Warning Signs Your Drainfield Is Failing vs. Simple Full Tank Symptoms',
    excerpt: 'Learn how to distinguish between an ordinary full septic tank that needs vacuum suction and catastrophic lateral line or biomat clogging.',
    category: 'diy',
    categoryLabel: 'Diagnostics',
    readTime: '4 min read',
    publishedDate: 'August 28, 2026',
    dateISO: '2026-08-28',
    author: 'Sarah Jenkins',
    authorRole: 'Soil & Hydrology Consultant',
    tags: ['Diagnostics', 'Drainfield Failure', 'Gurgling Drains', 'Troubleshooting'],
    content: {
      introduction: 'When water drains slowly or a toilet gurgles, homeowners often wonder: "Is my tank just full, or is my entire drainfield failing?" Understanding the distinction can save you thousands of dollars and prevent unneeded excavations.',
      sections: [
        {
          heading: '1. A Normal Tank Is Always "Full"',
          paragraphs: [
            'Many homeowners don\'t realize that a properly working septic tank is ALWAYS filled with liquid up to the bottom of the outlet pipe. When water enters from the house, an equal volume of clarified water overflows into the absorption field.',
            'When plumbers say a tank is "full and needs pumping," they mean the accumulated SLUDGE and SCUM layers have filled more than 35% of the total capacity, not that liquid has reached the top.'
          ]
        },
        {
          heading: '2. Symptoms Comparison Matrix',
          paragraphs: [
            'Review these clear physical indicators to diagnose your issue:'
          ],
          bulletPoints: [
            'Full Tank (Normal Maintenance): Slow drainage across multiple fixtures that resolves completely after vacuum pumping and remains clear for 2-3 years.',
            'Failing Drainfield: Tank is pumped dry, but within 24 to 72 hours, liquid from the drainfield flows backwards into the tank, causing immediate backup recurrence.',
            'Surface Breakout: Spongy, foul-smelling black sludge oozing onto lawn grass indicates saturated absorption trenches.'
          ]
        }
      ],
      localHoustonNote: 'If your system backs up only after torrential rains, your problem is likely stormwater infiltration into an unsealed riser, not a collapsed drainfield.',
      faq: [
        {
          question: 'Can a failing drainfield be revived with hydro-jetting?',
          answer: 'If the lateral pipes are blocked by grease or silt, high-pressure jetting can restore flow. However, if the surrounding soil biomat is choked by compacted solids, replacement or resting the field is required.'
        }
      ]
    }
  },
  {
    id: 'septic-safe-cleaning-products-guide',
    slug: 'septic-safe-cleaning-products-houston-guide',
    title: 'Septic Safe Cleaning Products: Which Household Cleaners Kill Beneficial Tank Bacteria?',
    excerpt: 'The chemistry of anaerobic digestion: how common household bleach, drain acids, and antibacterial detergents destroy digestion and accelerate pumping needs.',
    category: 'diy',
    categoryLabel: 'Homeowner Guide',
    readTime: '4 min read',
    publishedDate: 'August 15, 2026',
    dateISO: '2026-08-15',
    author: 'Marcus Sterling',
    authorRole: 'Certified OSSF Maintenance Inspector',
    tags: ['Cleaning Products', 'Septic Safe', 'Bacteria Health', 'DIY Tips'],
    content: {
      introduction: 'Your septic tank is a living biological reactor. Billions of anaerobic and facultative bacteria work 24/7 to digest human waste, paper fibers, and proteins into harmless liquids and gases. Using harsh household cleaning chemicals disrupts this delicate microbiome, causing rapid solids buildup and foul odors.',
      sections: [
        {
          heading: '1. The Worst Offenders for Septic Systems',
          paragraphs: [
            'Chemicals that homeowners should eliminate or use with extreme caution:'
          ],
          bulletPoints: [
            'Caustic Drain Cleaners (Sulfuric Acid / Lye): Corrodes concrete tank walls, melts PVC glue, and instantly sterilizes beneficial bacteria colonies.',
            'Heavy Bleach in Laundry: More than 1 cup of standard bleach per load kills the biological layer in the septic tank.',
            'Quaternary Antibacterial Soaps: Products containing triclosan or quats are designed specifically to kill bacteria—the exact opposite of what a septic tank needs.'
          ]
        },
        {
          heading: '2. Safe Alternatives That Protect Your System',
          paragraphs: [
            'Switch to plant-derived, biodegradable, and phosphorus-free cleaning products. Distilled white vinegar, baking soda, and hydrogen peroxide clean effectively without altering tank pH levels.'
          ]
        }
      ],
      localHoustonNote: 'Hard water in Fort Bend and Montgomery counties leads homeowners to overuse soaps. Use high-efficiency liquid detergents to prevent soap scum rings.',
      faq: [
        {
          question: 'Do commercial yeast or enzyme packets help restore killed bacteria?',
          answer: 'Normal human waste provides more than enough natural bacteria. In general, commercial additives are unnecessary and unproven; stopping harsh chemical use is all that is required.'
        }
      ]
    }
  }
];

interface SepticMaintenanceBlogProps {
  onNavigate?: (path: string) => void;
  className?: string;
}

export function SepticMaintenanceBlog({
  onNavigate,
  className = '',
}: SepticMaintenanceBlogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  // Filter blog posts
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Inject Schema.org Blog / BlogPosting structured data for long-tail SEO
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const SCRIPT_ID = 'jsonld-septic-maintenance-blog';
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = SCRIPT_ID;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const blogSchema = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: `${BUSINESS_CONFIG.brandName} Houston Septic Maintenance & Regulations Guide`,
      description: 'Expert guides on Texas TCEQ Chapter 285 septic regulations, Gulf Coast gumbo clay soil drainfield care, and homeowner maintenance tips for Greater Houston.',
      url: `${BUSINESS_CONFIG.domain}/#septic-blog`,
      publisher: {
        '@type': 'Organization',
        name: BUSINESS_CONFIG.brandName,
        url: `${BUSINESS_CONFIG.domain}/`,
        logo: {
          '@type': 'ImageObject',
          url: `${BUSINESS_CONFIG.domain}/logo.png`,
        },
      },
      blogPost: BLOG_POSTS.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.dateISO,
        dateModified: post.dateISO,
        author: {
          '@type': 'Person',
          name: post.author,
          jobTitle: post.authorRole,
        },
        publisher: {
          '@type': 'Organization',
          name: BUSINESS_CONFIG.brandName,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${BUSINESS_CONFIG.domain}/#post-${post.id}`,
        },
        keywords: post.tags.join(', '),
      })),
    };

    scriptTag.textContent = JSON.stringify(blogSchema, null, 2);

    return () => {
      const tag = document.getElementById(SCRIPT_ID);
      if (tag && tag.parentNode) {
        tag.parentNode.removeChild(tag);
      }
    };
  }, []);

  const openArticle = (post: BlogPost) => {
    setActiveArticle(post);
    trackEvent('blog_post_viewed', {
      service: post.title,
      source: 'blog_card',
      location: post.category,
    });
  };

  const closeArticle = () => {
    setActiveArticle(null);
  };

  return (
    <section
      id="septic-blog"
      className={`py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden ${className}`}
      aria-label="Houston Septic Regulations & Maintenance Blog"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-semibold text-xs shadow-xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Houston Septic Knowledge Base</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Texas TCEQ Regulations & Homeowner Guides
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Essential guidance on local Houston septic laws, Gulf Coast clay soil percolation, hurricane flood protocols, and maintenance advice written by environmental specialists.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Guides' },
              { id: 'regulations', label: 'TCEQ Regulations' },
              { id: 'soil', label: 'Clay Soil & Drainfields' },
              { id: 'aerobic', label: 'Aerobic ATU' },
              { id: 'emergency', label: 'Hurricane & Flooding' },
              { id: 'diy', label: 'Homeowner Care' },
            ].map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-500 text-slate-950 shadow-xs font-bold'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search regulations or topics..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Blog Post Cards Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-800 p-8 space-y-3">
            <FileText className="w-8 h-8 text-slate-500 mx-auto" />
            <div className="text-sm font-bold text-white">No articles matched your search query</div>
            <p className="text-xs text-slate-400">
              Try searching for "TCEQ", "clay", "aerobic", "flood", or clear the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg bg-slate-700 text-xs text-white font-semibold hover:bg-slate-600 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-slate-800/60 rounded-2xl border border-slate-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between overflow-hidden group hover:shadow-xl hover:shadow-emerald-950/30"
              >
                <div className="p-6 space-y-4">
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                      <Tag className="w-3 h-3" />
                      <span>{post.categoryLabel}</span>
                    </span>

                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => openArticle(post)}
                    className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors cursor-pointer leading-snug"
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-700/60 text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-6 py-4 border-t border-slate-700/60 bg-slate-900/50 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    <div>{post.author}</div>
                    <div className="text-slate-500 text-[10px]">{post.publishedDate}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openArticle(post)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer group-hover:translate-x-0.5 duration-150"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom Local Houston Assistance Strip */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-800 to-slate-900 border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Need Professional OSSF Diagnostic or Pumping?</span>
            </div>
            <p className="text-xs text-slate-300">
              Our registered Texas partner contractors serve Harris, Fort Bend, Montgomery, Brazoria, and Waller counties daily.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#quote-form"
              onClick={(e) => {
                const target = document.getElementById('quote-form') || document.querySelector('form');
                if (target) {
                  e.preventDefault();
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Request Free Contractor Match
            </a>
            <a
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{BUSINESS_CONFIG.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* In-Depth Article Reader Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
          onClick={closeArticle}
        >
          <div
            className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative my-auto p-6 sm:p-10 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeArticle}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Article Header */}
            <div className="space-y-3 border-b border-slate-800 pb-5 pr-8">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-xs font-bold">
                  {activeArticle.categoryLabel}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeArticle.readTime}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {activeArticle.title}
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">{activeArticle.author}</span>
                <span>·</span>
                <span>{activeArticle.authorRole}</span>
                <span>·</span>
                <span>Published {activeArticle.publishedDate}</span>
              </div>
            </div>

            {/* Article Intro */}
            <div className="text-sm text-slate-300 leading-relaxed font-medium bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              {activeArticle.content.introduction}
            </div>

            {/* Article Sections */}
            <div className="space-y-6">
              {activeArticle.content.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-base font-bold text-white">
                    {sec.heading}
                  </h3>

                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {p}
                    </p>
                  ))}

                  {sec.bulletPoints && (
                    <ul className="space-y-2 pl-4 text-xs sm:text-sm text-slate-300 list-disc">
                      {sec.bulletPoints.map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.callout && (
                    <div
                      className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed flex items-start gap-3 ${
                        sec.callout.type === 'warning'
                          ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                          : sec.callout.type === 'regulation'
                          ? 'bg-blue-950/40 border-blue-500/50 text-blue-200'
                          : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-current" />
                      <div>{sec.callout.text}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Local Houston Note Callout */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm space-y-1">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Greater Houston Regional Insight</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {activeArticle.content.localHoustonNote}
              </p>
            </div>

            {/* FAQ Accordion in Article */}
            {activeArticle.content.faq.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Common Questions on This Topic
                </h4>
                <div className="space-y-2">
                  {activeArticle.content.faq.map((item, qIdx) => (
                    <div key={qIdx} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1">
                      <div className="text-xs font-bold text-white">{item.question}</div>
                      <div className="text-xs text-slate-300 leading-relaxed">{item.answer}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Article Action Footer */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={closeArticle}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Article
              </button>

              <a
                href="#quote-form"
                onClick={(e) => {
                  closeArticle();
                  const target = document.getElementById('quote-form') || document.querySelector('form');
                  if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs transition-colors text-center cursor-pointer"
              >
                Book Licensed Houston Contractor
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
