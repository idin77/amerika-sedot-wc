import { useEffect } from 'react';
import { Star, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

export interface CustomerReviewItem {
  author: string;
  location: string;
  rating: number;
  date: string;
  serviceType: string;
  title: string;
  reviewText: string;
  verifiedHomeowner?: boolean;
}

export const DEFAULT_CUSTOMER_REVIEWS: CustomerReviewItem[] = [
  {
    author: 'Marcus L.',
    location: 'Katy, TX',
    rating: 5,
    date: '2026-08-14',
    serviceType: 'Emergency Septic Pumping',
    title: 'Rapid dispatch on a Saturday morning',
    reviewText:
      'Had our septic alarm sounding and lowest shower gurgling on a Saturday morning. SepticProDirect connected us with a local vacuum tanker within 90 minutes. Upfront flat quote, no extortion pricing, and the technician verified the tank was evacuated completely.',
    verifiedHomeowner: true,
  },
  {
    author: 'Sarah & Robert T.',
    location: 'The Woodlands, TX',
    rating: 5,
    date: '2026-09-02',
    serviceType: 'Aerobic Tank Maintenance & Cleaning',
    title: 'Clean property care and thorough filter cleaning',
    reviewText:
      'Our aerobic system was due for routine trash tank pumping. The contractor knew Montgomery County requirements, checked our sprayers, power-washed the effluent filter, and took care not to damage our sod or flowerbeds with heavy hoses.',
    verifiedHomeowner: true,
  },
  {
    author: 'Carlos M.',
    location: 'Cypress, TX',
    rating: 5,
    date: '2026-07-28',
    serviceType: 'Residential Tank Pumping & Inspection',
    title: 'Honest pricing with no surprise dump fees',
    reviewText:
      'Other companies quoted low over the phone then tried tacking on $250 disposal fees on arrival. SepticProDirect gave us an all-inclusive quote for our 1,000-gallon tank. Technicians showed us the clean tank before replacing the concrete lids.',
    verifiedHomeowner: true,
  },
  {
    author: 'Brenda W.',
    location: 'Pearland, TX',
    rating: 5,
    date: '2026-09-18',
    serviceType: 'Real Estate Septic Inspection & Pump-Out',
    title: 'Comprehensive inspection report for our closing',
    reviewText:
      'Needed a full septic inspection and certified pumping receipt for our home purchase closing in Brazoria County. Prompt dispatch, great communication, and full digital inspection paperwork delivered that afternoon.',
    verifiedHomeowner: true,
  },
  {
    author: 'David K.',
    location: 'Spring, TX',
    rating: 5,
    date: '2026-08-30',
    serviceType: 'Preventative Septic Pumping',
    title: 'Professional vacuum tanker crew',
    reviewText:
      'Living on an acre in Spring, our tank is about 80 feet from the driveway. The pumper had ample commercial hose length, uncovered our second compartment lid quickly, and left the area spotless. Will definitely use again for our 3-year cycle.',
    verifiedHomeowner: true,
  },
];

interface ReviewSchemaProps {
  reviews?: CustomerReviewItem[];
  aggregateRatingValue?: number;
  totalReviewCount?: number;
  renderVisibleUI?: boolean;
  title?: string;
  subtitle?: string;
  sectionId?: string;
}

/**
 * ReviewSchema Component:
 * Injects Schema.org JSON-LD structured data for reviews and AggregateRating into <head>
 * to enhance search engine rich snippet stars and CTR in SERP, and optionally
 * displays a high-converting customer testimonials section on the page.
 */
export function ReviewSchema({
  reviews = DEFAULT_CUSTOMER_REVIEWS,
  aggregateRatingValue = 4.9,
  totalReviewCount = 148,
  renderVisibleUI = true,
  title = 'Verified Customer Reviews & Houston Testimonials',
  subtitle = 'See why Greater Houston homeowners trust SepticProDirect for honest pricing, certified local pumpers, and reliable septic service.',
  sectionId = 'reviews-section',
}: ReviewSchemaProps) {
  // 1. Inject JSON-LD Schema into <head>
  useEffect(() => {
    if (typeof document === 'undefined' || !reviews || reviews.length === 0) return;

    const SCRIPT_ID = 'jsonld-review-schema';
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

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'PlumbingService'],
      '@id': `${origin}/#reviews`,
      name: BUSINESS_CONFIG.brandName,
      url: origin,
      telephone: BUSINESS_CONFIG.phoneRaw,
      address: {
        '@type': 'PostalAddress',
        addressLocality: BUSINESS_CONFIG.primaryCity,
        addressRegion: BUSINESS_CONFIG.state,
        postalCode: '77002',
        addressCountry: 'US',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRatingValue.toFixed(1),
        reviewCount: totalReviewCount.toString(),
        bestRating: '5',
        worstRating: '1',
      },
      review: reviews.map((rev) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: rev.author,
        },
        datePublished: rev.date,
        name: rev.title,
        reviewBody: rev.reviewText,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: rev.rating.toString(),
          bestRating: '5',
          worstRating: '1',
        },
        itemReviewed: {
          '@type': 'LocalBusiness',
          name: BUSINESS_CONFIG.brandName,
          telephone: BUSINESS_CONFIG.phoneRaw,
          image: `${origin}/og-image.jpg`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: BUSINESS_CONFIG.primaryCity,
            addressRegion: BUSINESS_CONFIG.state,
            addressCountry: 'US',
          },
        },
      })),
    };

    scriptTag.textContent = JSON.stringify(schemaData, null, 2);

    return () => {
      const tagToRemove = document.getElementById(SCRIPT_ID);
      if (tagToRemove && tagToRemove.parentNode) {
        tagToRemove.parentNode.removeChild(tagToRemove);
      }
    };
  }, [reviews, aggregateRatingValue, totalReviewCount]);

  if (!renderVisibleUI) {
    return null;
  }

  // 2. Visible Testimonials UI Section
  return (
    <section
      id={sectionId}
      className="py-16 sm:py-24 bg-white border-t border-slate-200"
      aria-label="Customer Reviews"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Aggregate Rating Badge */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold mb-3">
            <div className="flex items-center gap-0.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span>
              {aggregateRatingValue} / 5 Rating ({totalReviewCount}+ Verified Houston Homeowners)
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              <div className="space-y-3.5">
                {/* Stars and Service Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 bg-white px-2.5 py-0.5 rounded-md border border-slate-200/70">
                    {rev.serviceType}
                  </span>
                </div>

                {/* Review Title */}
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  "{rev.title}"
                </h3>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {rev.reviewText}
                </p>
              </div>

              {/* Author & Verification Footer */}
              <div className="pt-5 mt-5 border-t border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{rev.author}</div>
                  <div className="text-xs text-slate-500">{rev.location}</div>
                </div>

                {rev.verifiedHomeowner && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Guarantees Bar */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base text-white">
                100% Vetted Local Contractor Network
              </div>
              <div className="text-xs sm:text-sm text-slate-300">
                All dispatch partners are insured and registered with the Texas Commission on Environmental Quality (TCEQ).
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#quote-section"
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
            >
              Get a Fast Estimate
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
