import { useState, useMemo, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Search, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Phone, 
  ArrowRight,
  Sparkles,
  Calendar,
  AlertTriangle,
  Wrench,
  DollarSign
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { trackEvent } from '../lib/analytics';

export interface SepticFAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Pumping Frequency' | 'Warning Signs' | 'Aerobic & Conventional' | 'Cost & Regulations' | 'Homeowner Care';
  badge?: string;
}

export const COMMON_SEPTIC_FAQS: SepticFAQItem[] = [
  {
    id: 'faq-frequency',
    question: 'How often should I pump my septic tank?',
    answer:
      'For a standard 1,000 to 1,500-gallon conventional residential septic tank with 3 to 4 occupants, Texas TCEQ guidelines and health authorities recommend pumping every 3 to 5 years. If your home has an Aerobic Treatment Unit (ATU) with spray heads or drip lines—common across Montgomery, Harris, and Fort Bend counties—the trash tank should be pumped every 2 to 3 years due to its smaller chamber capacity. Delaying pumping allows dense bottom sludge and top scum to overflow into your drainfield, causing irreversible soil failure that costs $8,000 to $20,000+ to replace.',
    category: 'Pumping Frequency',
    badge: 'Most Asked',
  },
  {
    id: 'faq-warning-signs',
    question: 'What are the earliest warning signs that my septic system is full or failing?',
    answer:
      'Key red flags include: (1) Slow-draining bathtubs and sinks accompanied by gurgling sounds from downstairs toilets, (2) Unpleasant sulfur or sewage odors near tank access lids or aerator sprayers, (3) Strikingly bright green, lush grass growing over the drainfield during hot Texas summers, (4) Soggy, squishy soil or standing greywater puddles over the tank area when it has not rained, and (5) Raw sewage backing up into ground-floor shower basins. If an aerobic control panel buzzer activates, call for an immediate inspection.',
    category: 'Warning Signs',
    badge: 'Urgent Signs',
  },
  {
    id: 'faq-additives',
    question: 'Do chemical or biological septic tank additives work, or are they a scam?',
    answer:
      'State environmental agencies and independent wastewater engineers consistently warn against reliance on commercial yeast or chemical additives. A healthy human digestive tract naturally supplies all necessary anaerobic microbes. Harsh chemical solvents (like acids or caustic drain openers) actually kill the beneficial bacteria inside your tank and liquefy grease so it flows directly into your soil absorption pores, rapidly blinding the drainfield. Regular mechanical pumping by a licensed vacuum truck remains the only scientifically proven maintenance method.',
    category: 'Homeowner Care',
  },
  {
    id: 'faq-what-happens',
    question: 'What happens during a professional septic tank pump-out service?',
    answer:
      'A complete professional pumping service entails far more than skim pumping. A licensed pumper will: (1) Locate and excavate access riser lids, (2) Insert high-vacuum suction hoses into both the primary and secondary chambers, (3) Agitate compacted bottom solids using back-flushing or water jetting to break up the sludge layer, (4) Fully evacuate all septage down to the floor, (5) Inspect and clean the reusable effluent baffle filter, (6) Check structural integrity of inlet/outlet sanitary tees, and (7) Issue a certified TCEQ municipal waste disposal manifest (trip ticket).',
    category: 'Pumping Frequency',
  },
  {
    id: 'faq-aerobic-vs-conventional',
    question: 'How do aerobic septic systems differ from conventional gravity systems?',
    answer:
      'Conventional systems use anaerobic (oxygen-free) bacteria to separate waste, allowing clarified effluent to soak into underground gravel trenches by gravity. Aerobic Treatment Units (ATUs) operate like small municipal sewage plants: an electric air compressor forces oxygen through sewage to cultivate aerobic bacteria that digest waste much faster. The treated, chlorinated water is then dispersed onto lawns via surface spray heads or subsurface drip tubing. Aerobic units are mandatory in Houston properties with poor-percolating dense gumbo clay or high seasonal water tables.',
    category: 'Aerobic & Conventional',
  },
  {
    id: 'faq-home-sale-inspection',
    question: 'Is a septic inspection required before selling or buying a home in Texas?',
    answer:
      'While Texas state law does not mandate a state-level inspection automatically, almost all conventional mortgage lenders, FHA/VA loans, and prudent buyers require a comprehensive OSSF (On-Site Sewage Facility) real estate inspection before closing. A certified inspector performs hydraulic load testing, checks tank levels, tests aerator alarms, evaluates the drainfield for surface breakout, and verifies that the system possesses valid county health permits.',
    category: 'Cost & Regulations',
  },
  {
    id: 'faq-heavy-rain',
    question: 'Can heavy Houston rainstorms or flooding cause my septic tank to back up?',
    answer:
      'Yes. Greater Houston features Beaumont and Lake Charles heavy clay soils that become easily waterlogged. When floodwaters saturate the ground around your absorption trenches, wastewater cannot exit the tank, forcing water back into residential plumbing. During major storms: severely ration indoor water use, never drive over the drainfield, and NEVER pump a septic tank while the yard is submerged underwater, as hydrostatic groundwater pressure can pop the empty tank out of the ground.',
    category: 'Homeowner Care',
  },
  {
    id: 'faq-cost',
    question: 'How much does septic tank pumping cost in Greater Houston?',
    answer:
      'In Greater Houston (Harris, Montgomery, Fort Bend, and Brazoria counties), routine residential pumping typically costs between $375 and $550 for a standard 1,000 to 1,250-gallon tank. Upfront pricing includes travel, vacuum evacuation of both chambers, hose access up to 75–100 feet, filter rinse, and legal disposal fees at certified facilities. Deeply buried lids requiring significant mechanical excavation or severe sludge compaction may incur modest extra labor.',
    category: 'Cost & Regulations',
    badge: 'Pricing Guide',
  },
];

interface SepticFAQProps {
  onNavigate?: (path: string) => void;
  title?: string;
  subtitle?: string;
  className?: string;
  sectionId?: string;
}

export function SepticFAQ({
  onNavigate,
  title = 'Frequently Asked Questions About Septic Systems',
  subtitle = 'Clear, expert answers regarding tank pumping intervals, warning signs of full tanks, aerobic ATU care, and costs across Greater Houston.',
  className = '',
  sectionId = 'septic-faq-section',
}: SepticFAQProps) {
  const [openIds, setOpenIds] = useState<string[]>(['faq-frequency']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories
  const categories = ['All', 'Pumping Frequency', 'Warning Signs', 'Aerobic & Conventional', 'Cost & Regulations', 'Homeowner Care'];

  // Toggle single accordion
  const handleToggle = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (isOpen) {
        return prev.filter((item) => item !== id);
      } else {
        trackEvent('blog_post_viewed', {
          service: 'septic_faq_expanded',
          location: id,
        });
        return [...prev, id];
      }
    });
  };

  // Expand / Collapse all
  const handleExpandAll = () => {
    setOpenIds(COMMON_SEPTIC_FAQS.map((f) => f.id));
  };

  const handleCollapseAll = () => {
    setOpenIds([]);
  };

  // Filtered FAQs
  const filteredFAQs = useMemo(() => {
    return COMMON_SEPTIC_FAQS.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  // Inject Schema.org FAQPage structured data for Google SERP rich snippets
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const SCRIPT_ID = 'jsonld-septic-faq-schema';
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = SCRIPT_ID;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: COMMON_SEPTIC_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
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
  }, []);

  return (
    <section
      id={sectionId}
      className={`py-16 sm:py-24 bg-slate-50 border-t border-slate-200 scroll-mt-12 ${className}`}
      aria-label="Frequently Asked Questions About Septic Systems"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-300">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Homeowner Knowledge Base</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-3.5 text-balance">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-balance">
            {subtitle}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 mb-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g., pump frequency, warning signs, cost)..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Expand / Collapse All */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleExpandAll}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Expand All
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleCollapseAll}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion List */}
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No matching questions found</h4>
            <p className="text-xs text-slate-500">
              Try searching with different keywords or reset your filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFAQs.map((faq) => {
              const isOpen = openIds.includes(faq.id);

              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/10'
                      : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className="w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {faq.category}
                        </span>
                        {faq.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {faq.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-emerald-100 text-emerald-800 rotate-180'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150"
                    >
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Contact & Quote CTA strip */}
        <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Need specific advice on your property's tank?</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Speak with a Licensed Houston Septic Specialist
            </h4>
            <p className="text-xs text-slate-500 max-w-lg">
              Our partner contractors provide direct phone consultations for tank locating, baffle inspection, and upfront pumping quotes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call {BUSINESS_CONFIG.phoneDisplay}</span>
            </a>

            <a
              href="#quote-section"
              onClick={(e) => {
                const quoteEl = document.getElementById('quote-section');
                if (quoteEl) {
                  e.preventDefault();
                  quoteEl.scrollIntoView({ behavior: 'smooth' });
                } else if (onNavigate) {
                  e.preventDefault();
                  onNavigate('/#quote-section');
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <span>Get Free Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
