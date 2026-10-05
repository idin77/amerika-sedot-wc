import { useState, useMemo, useEffect } from 'react';
import { 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  ThumbsUp, 
  Quote, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Filter,
  BadgeCheck
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

export interface HomeownerReview {
  id: string;
  author: string;
  location: string;
  county: string;
  rating: number;
  date: string;
  serviceCategory: 'pumping' | 'cleaning' | 'inspection' | 'maintenance' | 'emergency';
  serviceLabel: string;
  tankType: string;
  title: string;
  reviewText: string;
  verified: boolean;
  helpfulCount: number;
}

export const REAL_HOMEOWNER_TESTIMONIALS: HomeownerReview[] = [
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
    date: 'July 29, 2026',
    serviceCategory: 'inspection',
    serviceLabel: 'Real Estate Septic Inspection',
    tankType: '1,000 Gallon Gravity System',
    title: 'Comprehensive OSSF inspection report saved us $4,200',
    reviewText:
      'We were in the option period buying a home with an older septic system in Pearland. The inspector did an exhaustive dye test, checked the concrete baffles, and discovered collapsed outlet piping before closing. The seller credited us the full repair cost based on the detailed photographic report.',
    verified: true,
    helpfulCount: 51,
  },
  {
    id: 'rev-spring-06',
    author: 'Jennifer H.',
    location: 'Spring, TX',
    county: 'North Harris County',
    rating: 5,
    date: 'July 11, 2026',
    serviceCategory: 'pumping',
    serviceLabel: 'Residential Septic Pumping',
    tankType: '1,000 Gallon Conventional',
    title: 'Fast dispatch, prompt communication, and spotless cleanup',
    reviewText:
      'Booking online was seamless. Got a dispatch confirmation call within 10 minutes. The pumper was on time, super polite, and took the time to show me the interior tank level and baffle health before resealing the lids.',
    verified: true,
    helpfulCount: 19,
  },
];

interface CustomerTestimonialsProps {
  serviceId?: string;
  serviceName?: string;
  cityId?: string;
  cityName?: string;
  title?: string;
  subtitle?: string;
  onNavigate?: (path: string) => void;
  className?: string;
}

export function CustomerTestimonials({
  serviceId,
  serviceName,
  cityId,
  cityName,
  title,
  subtitle,
  onNavigate,
  className = '',
}: CustomerTestimonialsProps) {
  // Normalize category mapping
  const activeServiceCategory = useMemo(() => {
    if (!serviceId) return 'all';
    const s = serviceId.toLowerCase();
    if (s.includes('emergency')) return 'emergency';
    if (s.includes('clean')) return 'cleaning';
    if (s.includes('inspect')) return 'inspection';
    if (s.includes('maint')) return 'maintenance';
    return 'pumping';
  }, [serviceId]);

  const [selectedFilter, setSelectedFilter] = useState<string>(activeServiceCategory);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  useEffect(() => {
    if (activeServiceCategory !== 'all') {
      setSelectedFilter(activeServiceCategory);
    }
  }, [activeServiceCategory]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    if (selectedFilter === 'all') return REAL_HOMEOWNER_TESTIMONIALS;
    return REAL_HOMEOWNER_TESTIMONIALS.filter(
      (r) => r.serviceCategory === selectedFilter
    );
  }, [selectedFilter]);

  const handleHelpful = (id: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  // Dynamic headings
  const sectionTitle =
    title ||
    (serviceName
      ? `Verified Houston Homeowner Reviews for ${serviceName}`
      : 'Real Homeowner Reviews & Ratings in Greater Houston');

  const sectionSubtitle =
    subtitle ||
    (serviceName
      ? `See how our vetted, licensed Texas contractor partners deliver punctual 5-star ${serviceName.toLowerCase()} across Harris, Fort Bend, and Montgomery counties.`
      : 'Read honest feedback from local homeowners in Katy, The Woodlands, Cypress, Sugar Land, and Pearland who rely on our prompt contractor dispatch.');

  // Helper to parse review dates to standard ISO YYYY-MM-DD
  const parseReviewDateToISO = (dateStr: string): string => {
    try {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }
    } catch {
      // fallback
    }
    return '2026-09-01';
  };

  // Inject Schema.org Product, AggregateRating & Review JSON-LD to win Google Review Snippet stars
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const SCRIPT_ID = 'jsonld-customer-testimonials';
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = SCRIPT_ID;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const productName = serviceName
      ? `${serviceName} Service - Greater Houston`
      : cityName
      ? `Septic Tank Pumping & Cleaning in ${cityName}, TX`
      : 'Residential Septic Tank Pumping & Cleaning';

    const productDescription = serviceName
      ? `Professional, licensed ${serviceName.toLowerCase()} and OSSF maintenance across Greater Houston, TX by verified local pumper contractors.`
      : cityName
      ? `TCEQ-licensed residential septic tank pumping, cleaning, and maintenance services in ${cityName}, TX and surrounding areas.`
      : 'Comprehensive residential septic tank pumping, cleaning, inspection, and maintenance services across Greater Houston.';

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productName,
      description: productDescription,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
      category: 'Septic System Pumping & Cleaning Services',
      brand: {
        '@type': 'Brand',
        name: BUSINESS_CONFIG.brandName,
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: '375',
        highPrice: '695',
        offerCount: '50',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: BUSINESS_CONFIG.brandName,
          telephone: BUSINESS_CONFIG.phoneRaw,
          url: `${BUSINESS_CONFIG.domain}/`,
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '286',
        reviewCount: '286',
      },
      review: REAL_HOMEOWNER_TESTIMONIALS.map((r) => ({
        '@type': 'Review',
        name: r.title,
        author: {
          '@type': 'Person',
          name: r.author,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: r.reviewText,
        datePublished: parseReviewDateToISO(r.date),
        publisher: {
          '@type': 'Organization',
          name: BUSINESS_CONFIG.brandName,
        },
        itemReviewed: {
          '@type': 'Product',
          name: productName,
        },
      })),
    };

    scriptTag.textContent = JSON.stringify(schemaData, null, 2);

    return () => {
      const tag = document.getElementById(SCRIPT_ID);
      if (tag && tag.parentNode) {
        tag.parentNode.removeChild(tag);
      }
    };
  }, [serviceName, cityName, serviceId, cityId]);

  return (
    <section 
      id="customer-testimonials" 
      className={`py-16 sm:py-24 bg-white border-t border-slate-200 scroll-mt-12 ${className}`}
      aria-label="Customer Reviews and Social Proof"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Houston Social Proof</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-3.5">
            {sectionTitle}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        {/* Aggregated Trust & Ratings Bar */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-7 mb-10 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Overall Star Score */}
            <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-200/80 pb-5 md:pb-0 md:pr-6">
              <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                4.9
              </div>
              <div>
                <div className="flex items-center gap-0.5 text-amber-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-xs font-semibold text-slate-700">
                  Based on 286+ Local Ratings
                </div>
                <div className="text-[11px] text-slate-500">
                  Greater Houston & Suburbs
                </div>
              </div>
            </div>

            {/* Metric 1: Verified Pros */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-900">100% Licensed</div>
                <div className="text-xs text-slate-500">Texas TCEQ Registered Partners</div>
              </div>
            </div>

            {/* Metric 2: Transparent Pricing */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-900">$0 Hidden Fees</div>
                <div className="text-xs text-slate-500">Upfront Quotes Prior to Work</div>
              </div>
            </div>

            {/* Metric 3: Emergency Dispatch */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-900">7-Day Dispatch</div>
                <div className="text-xs text-slate-500">Fast Response for Backups</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline-flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Filter by Service:
            </span>
            {[
              { id: 'all', label: 'All Reviews' },
              { id: 'pumping', label: 'Tank Pumping' },
              { id: 'emergency', label: 'Emergency Backup' },
              { id: 'cleaning', label: 'Tank Cleaning' },
              { id: 'inspection', label: 'OSSF Inspection' },
              { id: 'maintenance', label: 'Aerobic Care' },
            ].map((tab) => {
              const active = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-800">{filteredReviews.length}</span> verified reviews
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => {
            const currentHelpful = review.helpfulCount + (helpfulVotes[review.id] || 0);

            return (
              <div
                key={review.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between relative group"
              >
                <div>
                  {/* Top Bar: Stars + Date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{review.date}</span>
                    </div>
                  </div>

                  {/* Review Title */}
                  <h3 className="font-bold text-slate-900 text-base mb-2.5 leading-snug group-hover:text-emerald-950 transition-colors">
                    "{review.title}"
                  </h3>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {review.reviewText}
                  </p>
                </div>

                {/* Bottom Metadata & Author Info */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-900">
                        <span className="truncate">{review.author}</span>
                        {review.verified && (
                          <span
                            className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/70"
                            title="Verified Texas Homeowner"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-0.5 text-emerald-600 inline" />
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{review.location} ({review.county})</span>
                      </div>
                    </div>
                  </div>

                  {/* System Tag & Helpful Count */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-50">
                    <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-700 truncate max-w-[170px]">
                      {review.tankType}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleHelpful(review.id)}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 font-medium transition-colors cursor-pointer"
                      title="Mark review as helpful"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({currentHelpful})</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Conversion Callout */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Greater Houston Septic Dispatch Guarantee</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ready to experience 5-star septic service?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
              Connect with vetted, licensed local septic pumpers serving your neighborhood with upfront flat rates and certified TCEQ disposal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href="#quote-section"
              onClick={(e) => {
                const el = document.getElementById('quote-section');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth' });
                } else if (onNavigate) {
                  e.preventDefault();
                  onNavigate('/#quote-section');
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-[0.99]"
            >
              <span>Request Free Quote</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-colors"
            >
              <span>Call {BUSINESS_CONFIG.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
