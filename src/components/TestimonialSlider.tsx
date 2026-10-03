import { useState, useEffect, useRef } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Quote,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { CustomerReviewItem, DEFAULT_CUSTOMER_REVIEWS } from './ReviewSchema';
import { BUSINESS_CONFIG } from '../config/business';

export interface TestimonialSliderProps {
  reviews?: CustomerReviewItem[];
  autoPlayInterval?: number;
  onNavigate?: (path: string) => void;
  className?: string;
}

const EXTENDED_REVIEWS: CustomerReviewItem[] = [
  ...DEFAULT_CUSTOMER_REVIEWS,
  {
    author: 'Elena & Greg D.',
    location: 'Sugar Land, TX',
    rating: 5,
    date: '2026-09-22',
    serviceType: '1,500-Gallon Conventional Tank Pump-Out',
    title: 'Punctual, spotless cleanup, and transparent flat quote',
    reviewText:
      'We live along the Brazos fringe and our high water table had us nervous about backing up into our first-floor bathrooms. The dispatch partner showed up right on schedule with a spotless vacuum truck, walked us through the tank depth, and cleaned both compartments thoroughly.',
    verifiedHomeowner: true,
  },
  {
    author: 'James R.',
    location: 'Conroe, TX',
    rating: 5,
    date: '2026-08-05',
    serviceType: 'Aerobic System Pump & Spray Inspection',
    title: 'Knows Montgomery County TCEQ standards inside out',
    reviewText:
      'Our aerobic spray heads were spraying weakly. The technician not only pumped the trash tank clean but also cleared our pump intake screen and checked the timer. Explained what caused the sludge buildup without trying to upsell unnecessary hardware.',
    verifiedHomeowner: true,
  },
  {
    author: 'Maria S.',
    location: 'Tomball, TX',
    rating: 5,
    date: '2026-07-19',
    serviceType: 'Septic Sludge Removal & Lid Inspection',
    title: 'Saved us thousands compared to a national franchise quote',
    reviewText:
      'A large corporate plumbing company quoted us $1,800 to pump our 1,000-gallon tank. SepticProDirect paired us with an independent local pumper who did the exact same job for $450 all-in. Direct, polite, and very respectful of our driveway and grass.',
    verifiedHomeowner: true,
  },
];

export function TestimonialSlider({
  reviews = EXTENDED_REVIEWS,
  autoPlayInterval = 6000,
  onNavigate,
  className = '',
}: TestimonialSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = reviews.length;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Auto-play mechanism with hover pause
  useEffect(() => {
    if (isPaused || autoPlayInterval <= 0) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, autoPlayInterval, total]);

  const activeReview = reviews[currentIndex];

  // Helper to format review date nicely
  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <section
      className={`py-14 sm:py-20 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white relative overflow-hidden ${className}`}
      aria-label="Verified Customer Testimonials Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real Houston Homeowner Experiences</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Trusted by Homeowners Across Greater Houston
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Read how our independent contractor partner network delivers honest upfront pricing, fast emergency pumping, and meticulous care for Houston residential septic systems.
            </p>
          </div>

          {/* Social Proof Aggregate Badge */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shrink-0 flex items-center gap-4 backdrop-blur-sm shadow-xl">
            <div className="text-center pr-4 border-r border-slate-700">
              <div className="text-3xl font-extrabold text-white tracking-tight">4.9</div>
              <div className="flex items-center justify-center gap-0.5 text-amber-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>148+ Verified Reviews</span>
              </div>
              <div className="text-slate-400">Houston & Surrounding Counties</div>
              <div className="text-[11px] text-emerald-400 font-medium">99.2% Positive Feedback</div>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Card */}
          <div className="bg-slate-800/90 border border-slate-700/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl relative backdrop-blur-md transition-all duration-300">
            {/* Giant Background Quote Icon */}
            <Quote className="absolute top-6 right-8 w-20 h-20 text-slate-700/20 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Review Details & Author Info */}
              <div className="lg:col-span-8 space-y-5">
                {/* Rating & Service Tag */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(activeReview.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-700 text-emerald-300 border border-slate-600">
                    {activeReview.serviceType}
                  </span>
                </div>

                {/* Review Title */}
                <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                  "{activeReview.title}"
                </h3>

                {/* Review Body */}
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic">
                  "{activeReview.reviewText}"
                </p>

                {/* Author Credentials */}
                <div className="pt-4 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-300 font-bold text-sm">
                      {activeReview.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{activeReview.author}</span>
                        {activeReview.verifiedHomeowner && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            Verified Homeowner
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{activeReview.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Completed {formatDate(activeReview.date)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Key Takeaway / Trust Pillars */}
              <div className="lg:col-span-4 bg-slate-900/80 border border-slate-700/70 rounded-2xl p-5 sm:p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Why Houston Homeowners Choose Us
                </h4>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Flat-Rate Pricing:</strong> Upfront pump truck estimates without hidden landfill or manifest fees.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Heavy-Duty Tankers:</strong> High CFM commercial vacuum trucks that evacuate dense sludge and crusts.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Licensed & Insured:</strong> TCEQ-registered haulers respecting Texas environmental standards.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="/request-a-quote/"
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate('/request-a-quote/');
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Request Free Houston Quote</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-8 bg-emerald-500'
                      : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                />
              ))}
            </div>

            {/* Counter & Arrows */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono">
                {currentIndex + 1} of {total}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous review"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next review"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
