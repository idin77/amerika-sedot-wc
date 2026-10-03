import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Search, X, Sparkles, Zap, Check } from 'lucide-react';
import { FREQUENTLY_ASKED_QUESTIONS, BUSINESS_CONFIG } from '../config/business';
import { FAQFullTextIndex, FAQSearchResult } from '../lib/faqSearchIndex';

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface FAQSchemaProps {
  items?: FAQItem[];
  renderVisibleUI?: boolean;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  sectionId?: string;
}

const POPULAR_SEARCH_TOPICS = [
  { label: 'All Questions', query: '' },
  { label: 'Pumping Cost', query: 'cost' },
  { label: 'How Often / Frequency', query: 'how often' },
  { label: 'Warning Signs of Full Tank', query: 'warning signs' },
  { label: 'Aerobic vs Conventional', query: 'aerobic' },
  { label: 'Lid Digging & Depth', query: 'dig' },
  { label: 'Emergency Backup', query: 'emergency' },
];

/**
 * Highlights multiple matching search tokens and exact queries in text
 */
function HighlightText({ text, query, matchedTokens = [] }: { text: string; query: string; matchedTokens?: string[] }) {
  if (!query || query.trim() === '') {
    return <>{text}</>;
  }

  // Combine query and matched tokens for thorough highlight
  const allTerms = new Set<string>();
  if (query.trim().length >= 2) {
    allTerms.add(query.trim());
    query.trim().split(/\s+/).forEach((w) => {
      if (w.length >= 2) allTerms.add(w);
    });
  }

  matchedTokens.forEach((t) => {
    if (t.length >= 2) allTerms.add(t);
  });

  if (allTerms.size === 0) {
    return <>{text}</>;
  }

  // Build safe regex pattern
  const escaped = Array.from(allTerms)
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  if (!escaped) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-amber-100 text-amber-950 font-semibold px-0.5 rounded shadow-2xs"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

/**
 * Reusable FAQ Schema Component with Full-Text Search:
 * 1. Injects Schema.org FAQPage JSON-LD structured data into the document head
 *    for Google Search rich results and FAQ accordions in SERP.
 * 2. Implements an in-memory Full-Text Search (FTS) index with tokenization,
 *    synonym expansion, real-time typing prefix matching, and relevance ranking.
 */
export function FAQSchema({
  items = FREQUENTLY_ASKED_QUESTIONS,
  renderVisibleUI = false,
  title = 'Frequently Asked Questions About Septic Maintenance',
  subtitle = 'Search our knowledge base for answers on tank pumping schedules, pricing across Greater Houston, emergency signs, and contractor matching.',
  badgeText = 'Houston Septic Knowledge Base',
  sectionId = 'faq-section',
}: FAQSchemaProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Inject JSON-LD Schema into <head>
  useEffect(() => {
    if (typeof document === 'undefined' || !items || items.length === 0) return;

    const SCRIPT_ID = 'jsonld-faq-schema';
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
  }, [items]);

  // 2. Build Full-Text Search (FTS) Inverted Index
  const searchIndex = useMemo(() => {
    return new FAQFullTextIndex(items);
  }, [items]);

  // 3. Execute real-time query against the FTS index
  const searchResults: FAQSearchResult[] = useMemo(() => {
    return searchIndex.search(searchQuery);
  }, [searchIndex, searchQuery]);

  // When search changes, auto-open the highest-relevance matching question
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setOpenIndex(searchResults.length > 0 ? 0 : null);
    }
  }, [searchQuery, searchResults.length]);

  if (!renderVisibleUI) {
    return null;
  }

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setOpenIndex(0);
  };

  return (
    <section
      id={sectionId}
      className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200 scroll-mt-12"
      aria-label="Frequently Asked Questions"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{badgeText}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* Interactive Full-Text Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative group shadow-xs rounded-xl">
              <label htmlFor="faq-search-input" className="sr-only">
                Search septic maintenance questions
              </label>

              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                <Search className="w-5 h-5" />
              </div>

              <input
                id="faq-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search septic questions (e.g., cost, how often, alarm, backup)..."
                className="w-full pl-11 pr-24 py-3.5 text-sm sm:text-base bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                autoComplete="off"
              />

              <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear FAQ search"
                    className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    <X className="w-4 h-4 bg-slate-100 rounded-full p-0.5 hover:bg-slate-200" />
                  </button>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                    <Zap className="w-3 h-3 text-emerald-600" />
                    <span>Real-Time FTS</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Topic Chips */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="text-slate-400 mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Popular:
              </span>
              {POPULAR_SEARCH_TOPICS.map((topic) => {
                const isActive =
                  topic.query === ''
                    ? searchQuery === ''
                    : searchQuery.toLowerCase() === topic.query.toLowerCase();

                return (
                  <button
                    key={topic.label}
                    type="button"
                    onClick={() => setSearchQuery(topic.query)}
                    className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer text-xs ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {topic.label}
                  </button>
                );
              })}
            </div>

            {/* Live Search Status Bar */}
            {searchQuery && (
              <div className="mt-3.5 flex items-center justify-between text-xs text-slate-500 px-1 bg-white/70 py-1.5 px-3 rounded-lg border border-slate-200/80">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Found <strong className="text-slate-900">{searchResults.length}</strong>{' '}
                  {searchResults.length === 1 ? 'answer' : 'answers'} for "
                  <strong className="text-emerald-700">{searchQuery}</strong>" (Full-Text Indexed)
                </span>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-emerald-700 font-semibold hover:underline cursor-pointer"
                >
                  Reset all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Questions Accordion List */}
        <div className="space-y-3.5">
          {searchResults.length === 0 ? (
            <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl p-8 space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                No matching answers found for "{searchQuery}"
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Our full-text index searched across all questions and answers. Try related terms like <em>"pumping"</em>, <em>"inspection"</em>, <em>"gallons"</em>, or call our Houston dispatch desk for direct answers.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
                <a
                  href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Call {BUSINESS_CONFIG.phoneDisplay}
                </a>
              </div>
            </div>
          ) : (
            searchResults.map((result, idx) => {
              const isOpen = openIndex === idx;
              const headingId = `faq-heading-${idx}`;
              const panelId = `faq-panel-${idx}`;
              const item = result.item;

              return (
                <div
                  key={result.originalIndex}
                  className={`bg-white border rounded-xl transition-all duration-200 shadow-2xs overflow-hidden ${
                    isOpen
                      ? 'border-emerald-300 ring-1 ring-emerald-200/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    id={headingId}
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full py-4 sm:py-5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-900 text-sm sm:text-base leading-snug">
                        <HighlightText
                          text={item.question}
                          query={searchQuery}
                          matchedTokens={result.matchedTokens}
                        />
                      </div>
                      {searchQuery && (
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          {result.questionMatched && (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                              <Check className="w-3 h-3" /> Question match
                            </span>
                          )}
                          {result.answerMatched && (
                            <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-medium">
                              <Check className="w-3 h-3" /> Answer content match
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180 text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headingId}
                      className="px-5 sm:px-6 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 animate-in fade-in-50 duration-150"
                    >
                      <p className="pt-3.5 text-slate-700">
                        <HighlightText
                          text={item.answer}
                          query={searchQuery}
                          matchedTokens={result.matchedTokens}
                        />
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Local SEO Trust Footer Note */}
        <div className="mt-10 p-4 sm:p-5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 hidden sm:block" />
            <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
              Have specific questions about your Houston-area aerobic system or septic tank volume? Local contractors are available to advise.
            </p>
          </div>
          <a
            href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
            className="shrink-0 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Call {BUSINESS_CONFIG.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
