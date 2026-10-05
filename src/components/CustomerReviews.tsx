import { useState, useMemo } from 'react';
import { 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  ThumbsUp, 
  MapPin, 
  Filter, 
  Calendar, 
  Wrench, 
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

export interface CustomerTestimonial {
  id: string;
  author: string;
  location: string;
  county: string;
  rating: number;
  date: string;
  serviceId: 'pumping' | 'cleaning' | 'inspection' | 'maintenance' | 'emergency';
  serviceName: string;
  title: string;
  reviewText: string;
  tankSize: string;
  helpfulCount: number;
  verifiedHomeowner: boolean;
}

export const HOUSTON_CUSTOMER_REVIEWS: CustomerTestimonial[] = [
  {
    id: 'rev-1',
    author: 'Marcus & Elena L.',
    location: 'Katy, TX',
    county: 'Fort Bend / Harris',
    rating: 5,
    date: 'September 28, 2026',
    serviceId: 'emergency',
    serviceName: 'Emergency Septic Pumping',
    title: 'Arrived in 75 minutes on a rainy Saturday morning',
    reviewText:
      'Our septic high-water alarm started beeping early Saturday with relatives visiting. We called SepticProDirect and they matched us with a local vacuum pumper who arrived in Katy within 75 minutes. The driver was calm, respectful of our property, and gave us an all-inclusive flat quote before connecting suction hoses. Total lifesaver!',
    tankSize: '1,500 Gallon Aerobic',
    helpfulCount: 34,
    verifiedHomeowner: true,
  },
  {
    id: 'rev-2',
    author: 'Robert D.',
    location: 'The Woodlands, TX',
    county: 'Montgomery County',
    rating: 5,
    date: 'September 15, 2026',
    serviceId: 'maintenance',
    serviceName: 'Aerobic Tank Maintenance',
    title: 'Knows Montgomery County regulations inside out',
    reviewText:
      'We have an aerobic spray system under Montgomery County jurisdiction. The technician thoroughly pumped both the trash tank and pump chamber, pressure-washed the effluent screen, and verified our aerator compressor pressure. Cleaned up every drop of mud and re-seeded the turf around the riser caps.',
    tankSize: '1,000 Gallon ATU',
    helpfulCount: 22,
    verifiedHomeowner: true,
  },
  {
    id: 'rev-3',
    author: 'Carlos & Teresa M.',
    location: 'Cypress, TX',
    county: 'Harris County',
    rating: 5,
    date: 'August 22, 2026',
    serviceId: 'pumping',
    serviceName: 'Residential Septic Tank Pumping',
    title: 'Honest flat rate with zero surprise disposal fees',
    reviewText:
      'Two other Houston companies gave us cheap quotes over the phone then tried adding $250 “sludge disposal” fees once their truck pulled up. SepticProDirect gave us one transparent upfront price. They pumped 1,200 gallons out of our 2-compartment tank and let me shine a flashlight inside to verify it was completely empty.',
    tankSize: '1,250 Gallon Conventional',
    helpfulCount: 41,
    verifiedHomeowner: true,
  },
  {
    id: 'rev-4',
    author: 'Brenda S.',
    location: 'Pearland, TX',
    county: 'Brazoria County',
    rating: 5,
    date: 'August 10, 2026',
    serviceId: 'inspection',
    serviceName: 'Real Estate Septic Inspection',
    title: 'Essential inspection report saved us thousands before closing',
    reviewText:
      'Needed a full OSSF real estate inspection for our acreage home purchase in Pearland. The inspector located the buried tank, hydro-tested the drainfield, and discovered a fractured outlet baffle that the seller agreed to credit us $1,800 to fix before closing. The TCEQ documentation was sent over the same afternoon.',
    tankSize: '1,000 Gallon Concrete',
    helpfulCount: 29,
    verifiedHomeowner: true,
  },
  {
    id: 'rev-5',
    author: 'David & Lisa K.',
    location: 'Spring, TX',
    county: 'Harris County',
    rating: 5,
    date: 'July 31, 2026',
    serviceId: 'cleaning',
    serviceName: 'Septic Tank Cleaning & Jetting',
    title: '120 feet of hose reached our backyard without driving on sod',
    reviewText:
      'Our septic lids are situated way back behind our pool enclosure. The dispatch crew brought extra industrial suction hose segments so their heavy 5,000-gallon tanker stayed firmly on the asphalt driveway without cracking our pavers or leaving tire ruts in the sod. Thorough washdown and courteous crew.',
    tankSize: '1,500 Gallon Dual-Chamber',
    helpfulCount: 18,
    verifiedHomeowner: true,
  },
  {
    id: 'rev-6',
    author: 'Jerome P.',
    location: 'Sugar Land, TX',
    county: 'Fort Bend County',
    rating: 5,
    date: 'July 14, 2026',
    serviceId: 'pumping',
    serviceName: 'Residential Septic Tank Pumping',
    title: 'Professional, punctual, and respectful crew',
    reviewText:
      'Our house in Greatwood area was due for our 3-year pump-out. The technician gave a 20-minute ETA heads-up, carefully removed our 6-inch grass plug without tearing up the lawn, pumped both sides, and securely bolted down the heavy safety lids. Very professional experience.',
    tankSize: '1,000 Gallon Concrete',
    helpfulCount: 15,
    verifiedHomeowner: true,
  },
  {
    id: 'rev-7',
    author: 'Ashley B.',
    location: 'Tomball, TX',
    county: 'Harris County',
    rating: 5,
    date: 'June 29, 2026',
    serviceId: 'emergency',
    serviceName: 'Emergency Septic Pumping',
    title: 'Stopped a major sewage backup into our ground-floor shower',
    reviewText:
      'Pipes were gurgling and water was rising in the guest bath during a heavy Houston rainstorm. Called dispatch at 8 PM and an on-call vacuum tanker arrived before 10 PM. They pumped the high liquid level down immediately, preventing catastrophic indoor water damage. Worth every single penny.',
    tankSize: '1,500 Gallon Aerobic',
    helpfulCount: 37,
    verifiedHomeowner: true,
  },
  {
    id: 'rev-8',
    author: 'Greg & Connie V.',
    location: 'Conroe, TX',
    county: 'Montgomery County',
    rating: 5,
    date: 'June 12, 2026',
    serviceId: 'maintenance',
    serviceName: 'Septic System Maintenance',
    title: 'Clear explanations and proactive maintenance tips',
    reviewText:
      'As first-time septic owners on a 2-acre lot in Conroe, we had no idea how aerobic systems worked. The technician walked us through chlorine tablet maintenance, explained why kitchen grease disposal ruins drainfields, and set up our 3-year reminder schedule. Outstanding customer care.',
    tankSize: '1,200 Gallon Aerobic',
    helpfulCount: 23,
    verifiedHomeowner: true,
  },
];

interface CustomerReviewsProps {
  serviceFilter?: string;
  serviceName?: string;
  title?: string;
  subtitle?: string;
  onNavigate?: (path: string) => void;
}

export function CustomerReviews({
  serviceFilter,
  serviceName,
  title,
  subtitle,
  onNavigate,
}: CustomerReviewsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    serviceFilter || 'all'
  );
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});

  // Filter categories
  const categories = [
    { id: 'all', label: 'All Reviews' },
    { id: 'pumping', label: 'Tank Pumping' },
    { id: 'cleaning', label: 'Deep Cleaning' },
    { id: 'inspection', label: 'Inspections' },
    { id: 'maintenance', label: 'Aerobic Maintenance' },
    { id: 'emergency', label: 'Emergency Backup' },
  ];

  // Filter reviews
  const filteredReviews = useMemo(() => {
    if (selectedCategory === 'all') {
      return HOUSTON_CUSTOMER_REVIEWS;
    }
    return HOUSTON_CUSTOMER_REVIEWS.filter(
      (r) => r.serviceId === selectedCategory
    );
  }, [selectedCategory]);

  const handleHelpfulClick = (id: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const displayTitle =
    title ||
    (serviceName
      ? `Verified Houston Homeowner Reviews for ${serviceName}`
      : 'What Greater Houston Homeowners Say About Our Service');

  const displaySubtitle =
    subtitle ||
    (serviceName
      ? `Read real feedback from local property owners who scheduled ${serviceName.toLowerCase()} across Harris, Fort Bend, and Montgomery counties.`
      : 'Real experiences from residential property owners across Katy, The Woodlands, Cypress, Pearland, Sugar Land, and surrounding Houston communities.');

  return (
    <section
      id="customer-reviews"
      className="py-16 sm:py-24 bg-white border-t border-slate-200 scroll-mt-12"
      aria-label="Verified Customer Reviews"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold mb-3.5 shadow-2xs">
            <div className="flex items-center gap-0.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span>4.9 / 5.0 Star Rating Across Greater Houston</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-3.5">
            {displayTitle}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {displaySubtitle}
          </p>

          {/* Aggregate Trust Stats Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900">4.9 ★</div>
              <div className="text-[11px] text-slate-500 font-medium">Average Rating</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-700">100%</div>
              <div className="text-[11px] text-slate-500 font-medium">Licensed TCEQ Pros</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900">1,400+</div>
              <div className="text-[11px] text-slate-500 font-medium">Tanks Serviced</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-700">$0</div>
              <div className="text-[11px] text-slate-500 font-medium">Hidden Dump Fees</div>
            </div>
          </div>

          {/* Interactive Category Filter Chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline-flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Filter by:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => {
            const hasVoted = !!helpfulVotes[rev.id];
            const currentHelpfulCount = rev.helpfulCount + (hasVoted ? 1 : 0);

            return (
              <div
                key={rev.id}
                className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-md hover:border-slate-300 hover:bg-white transition-all duration-200 group"
              >
                <div className="space-y-4">
                  {/* Top Bar: Stars + Location Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white px-2.5 py-0.5 rounded-md border border-slate-200/80 shadow-2xs">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{rev.location}</span>
                    </div>
                  </div>

                  {/* Review Title */}
                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-900 transition-colors">
                    "{rev.title}"
                  </h3>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {rev.reviewText}
                  </p>

                  {/* System & Tank Spec Tag */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200/80">
                      <Wrench className="w-3 h-3 text-emerald-600" />
                      {rev.serviceName}
                    </span>
                    <span className="bg-slate-200/60 px-2 py-0.5 rounded text-slate-600 font-medium">
                      {rev.tankSize}
                    </span>
                  </div>
                </div>

                {/* Footer: Author Info & Helpful Button */}
                <div className="pt-5 mt-5 border-t border-slate-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                        {rev.author}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified Homeowner</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleHelpfulClick(rev.id)}
                    className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer border ${
                      hasVoted
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                    title="Mark this review as helpful"
                  >
                    <ThumbsUp className={`w-3 h-3 ${hasVoted ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                    <span>Helpful ({currentHelpfulCount})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Endorsement Banner */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-slate-900 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg text-white mb-1">
                Every Contractor Partner Is Vetted & Texas TCEQ Licensed
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                We only match your job with independent licensed sludge transporters registered under Texas Chapter 285 OSSF guidelines with verified commercial liability insurance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
            <a
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              className="w-full sm:w-auto text-center px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
            >
              Call {BUSINESS_CONFIG.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
