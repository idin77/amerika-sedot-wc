import { useState, useEffect, useMemo } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  Search, 
  X, 
  Wrench, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Phone, 
  ArrowRight,
  ListFilter
} from 'lucide-react';
import { FAQItem } from '../types';
import { BUSINESS_CONFIG } from '../config/business';

export const DEFAULT_SEPTIC_MAINTENANCE_FAQS: FAQItem[] = [
  {
    question: 'How often should a residential septic tank be pumped out in Greater Houston?',
    answer:
      'For a standard 1,000 to 1,500-gallon conventional concrete septic tank with a typical household of 3 to 4 people, pumping is recommended every 3 to 5 years. However, aerobic treatment units (ATUs) common in Montgomery, Harris, and Fort Bend counties have smaller trash compartments and require inspection and pumping every 2 to 3 years. Regular pump-outs prevent heavy sludge from escaping into your drainfield pipes, which can cause catastrophic soil clogging and thousands in replacement costs.',
    category: 'Maintenance Frequency',
  },
  {
    question: 'What are the early warning signs that my septic system needs immediate maintenance?',
    answer:
      'The most common warning indicators include: (1) Slow-draining sinks, bathtubs, or toilets gurgling when washing machines discharge, (2) Strong sewage or sulfur odors near the tank lids or spray nozzles, (3) Unusually lush, spongy, or bright green grass growing over the drainfield or tank, (4) Standing greywater or wet spots on the lawn during dry weather, and (5) Sewage backing up into lowest-level showers or tubs. If your high-water alarm activates, cease high water usage and schedule an emergency pump-out immediately.',
    category: 'Warning Signs',
  },
  {
    question: 'What routine maintenance is required for aerobic spray septic systems (ATUs)?',
    answer:
      'Aerobic treatment systems require ongoing preventative maintenance under Texas TCEQ Chapter 285 regulations: (1) Replenish solid calcium hypochlorite chlorine tablets (never use swimming pool chlorine, which causes explosive gas buildup), (2) Inspect the air compressor/aerator to ensure continuous oxygen flow to aerobic bacteria, (3) Remove and power-wash the reusable effluent screen filter every 3 to 6 months, (4) Inspect spray heads for clogs or physical lawnmower damage, and (5) Have a certified technician measure trash and sludge tank levels annually.',
    category: 'Aerobic Care',
  },
  {
    question: 'What everyday household items should NEVER be flushed into a septic system?',
    answer:
      'Never flush items that do not biologically decompose or that kill beneficial tank microbes. This includes “flushable” wipes (the #1 cause of septic inlet baffle clogs), feminine hygiene products, paper towels, facial tissues, condoms, dental floss, cigarette butts, cat litter, coffee grounds, and cooking oils or grease. Additionally, avoid pouring harsh caustic drain cleaners (like Drano), antibacterial soaps in excessive quantities, paints, bleach, or motor oil down your drains, as they kill the anaerobic and aerobic bacteria required to break down solids.',
    category: 'What Not to Flush',
  },
  {
    question: 'How does heavy Houston rain or hurricane season affect septic maintenance?',
    answer:
      'Greater Houston is characterized by high water tables and dense clay soils (such as Beaumont and Lake Charles clays) that drain slowly. During torrential rainfall or tropical storms, the soil around your drainfield can become saturated, preventing treated wastewater from percolating into the earth. During heavy rains, significantly reduce household water use (stagger laundry, avoid long showers), inspect surface water runoff to ensure gutters do not discharge over your tank or drainfield, and schedule maintenance pumping prior to peak hurricane season (June–November).',
    category: 'Weather & Climate',
  },
  {
    question: 'How much does routine septic maintenance and pumping cost in Greater Houston?',
    answer:
      'In Greater Houston (Harris, Fort Bend, Montgomery, and Brazoria counties), residential septic pumping generally ranges between $375 and $550 for a standard 1,000 to 1,250-gallon tank. This transparent flat rate includes travel, excavation of up to 6 inches of soil over access lids, complete liquid and sludge evacuation with industrial vacuum hoses, back-flushing to loosen compacted solids, and certified disposal at an authorized municipal wastewater facility with TCEQ manifest documentation.',
    category: 'Costs & TCEQ',
  },
  {
    question: 'How can I prevent tree root intrusion into my septic tank and drainfield lines?',
    answer:
      'Tree roots naturally seek out nutrient-rich moisture and can easily penetrate pipe joints, tank inlet/outlet seals, and drainfield distribution lines. To prevent intrusion: Maintain a tree-free buffer of at least 25 to 50 feet from your septic tank and drainfield, especially for water-loving species like weeping willows, oaks, and pines. Never drive or park vehicles, heavy trailers, or mowers over the drainfield, as soil compaction crushes perforated PVC pipes and disrupts subsurface biological filtration.',
    category: 'Root Prevention',
  },
  {
    question: 'What is the difference between septic tank pumping and septic tank cleaning?',
    answer:
      'Septic tank pumping involves inserting a vacuum hose into the main access port to evacuate the floating scum layer and standing wastewater. Septic tank cleaning is a more comprehensive process: after liquids are removed, the technician uses high-pressure water hydro-jetting to break down dense, compacted sludge caked against the tank floor and corners, power-washes the walls and baffles, inspects structural concrete or poly integrity, and cleans effluent filters.',
    category: 'Pumping vs Cleaning',
  },
];

interface FAQAccordionProps {
  items?: FAQItem[];
  title?: string;
  subtitle?: string;
  badgeText?: string;
  sectionId?: string;
  includeSchema?: boolean;
}

export function FAQAccordion({
  items = DEFAULT_SEPTIC_MAINTENANCE_FAQS,
  title = 'Frequently Asked Questions About Septic Maintenance',
  subtitle = 'Expert guidance on pump-out frequencies, warning signs, aerobic system care, and Texas TCEQ guidelines across Greater Houston.',
  badgeText = 'Houston Septic Maintenance Guide',
  sectionId = 'faq-accordion',
  includeSchema = true,
}: FAQAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 1. Extract Unique Categories for Filter Chips
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['all', ...Array.from(set)];
  }, [items]);

  // 2. Filter Items by Search Query and Category
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        q === '' ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [items, searchQuery, selectedCategory]);

  // 3. Inject Schema.org FAQPage JSON-LD into <head> for SEO
  useEffect(() => {
    if (!includeSchema || typeof document === 'undefined' || items.length === 0) {
      return;
    }

    const SCRIPT_ID = `jsonld-faq-accordion-${sectionId}`;
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
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
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
  }, [items, includeSchema, sectionId]);

  // Accordion Toggles
  const toggleIndex = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleExpandAll = () => {
    setOpenIndexes(filteredItems.map((_, i) => i));
  };

  const handleCollapseAll = () => {
    setOpenIndexes([]);
  };

  return (
    <section
      id={sectionId}
      className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200 scroll-mt-12"
      aria-label="Frequently Asked Questions About Septic Maintenance"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {badgeText && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-3.5 shadow-2xs">
              <Wrench className="w-3.5 h-3.5 text-emerald-600" />
              <span>{badgeText}</span>
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-3.5">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {subtitle}
          </p>

          {/* Real-Time Search Bar */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // Auto expand filtered results
                  setOpenIndexes([0, 1]);
                }}
                placeholder="Search maintenance questions (e.g. chlorine, signs, frequency, cost)..."
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Chips */}
          {categories.length > 2 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span className="text-xs text-slate-400 mr-1 hidden sm:inline-flex items-center gap-1">
                <ListFilter className="w-3 h-3 text-slate-400" />
                Category:
              </span>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                const label = cat === 'all' ? 'All Questions' : cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setOpenIndexes([0]);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Accordion Controls Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
          <div>
            Showing <span className="font-semibold text-slate-800">{filteredItems.length}</span> {filteredItems.length === 1 ? 'question' : 'questions'}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExpandAll}
              className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline cursor-pointer"
            >
              Expand All
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="text-slate-500 hover:text-slate-700 font-medium hover:underline cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Dynamic Accordion List */}
        {filteredItems.length > 0 ? (
          <div className="space-y-3">
            {filteredItems.map((item, idx) => {
              const isOpen = openIndexes.includes(idx);
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs transition-all duration-200 hover:border-slate-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleIndex(idx)}
                    className="w-full py-4 sm:py-5 px-5 sm:px-6 text-left flex items-start justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug block">
                          {item.question}
                        </span>
                        {item.category && (
                          <span className="inline-block mt-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'rotate-180 bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                      <p className="pt-2">{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center my-6">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800 mb-1">
              No matching questions found
            </p>
            <p className="text-xs text-slate-500 mb-4">
              Try adjusting your search terms or clearing your category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
            >
              Reset Search
            </button>
          </div>
        )}

        {/* Direct Help Callout */}
        <div className="mt-10 sm:mt-12 p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">
                Have a specific septic maintenance question?
              </div>
              <div className="text-xs text-slate-500">
                Speak directly with an on-call licensed Texas technician today.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call {BUSINESS_CONFIG.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
