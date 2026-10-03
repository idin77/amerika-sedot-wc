import { FAQItem } from '../components/FAQSchema';

/**
 * Standard English common stop words that don't add semantic value to septic searches
 */
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
  'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both',
  'but', 'by', 'can', 'cannot', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'its',
  'itself', 'let\'s', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
  'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
  'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who',
  'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves',
]);

/**
 * Domain-specific Septic & Wastewater synonym expansion for homeowner queries
 */
const SYNONYM_MAP: Record<string, string[]> = {
  pump: ['pumping', 'pumped', 'pump-out', 'empty', 'evacuate', 'cleanout', 'clean-out'],
  cost: ['price', 'pricing', 'rate', 'quote', 'estimate', 'charge', 'dollar', 'fee', 'cheap', 'expensive'],
  price: ['cost', 'pricing', 'rate', 'fee', 'charge', 'quote', 'estimate'],
  alarm: ['beeping', 'buzzer', 'sound', 'light', 'alert', 'warning', 'siren', 'horn'],
  odor: ['smell', 'stink', 'scent', 'fume', 'sewage', 'stench', 'sulfur'],
  smell: ['odor', 'stink', 'scent', 'sewage', 'fume', 'stench', 'sulfur'],
  full: ['overflow', 'backup', 'clog', 'clogged', 'sluggish', 'capacity', 'drain'],
  backup: ['overflow', 'spill', 'back-up', 'flooding', 'gurgling', 'clog', 'standing'],
  aerobic: ['atu', 'air', 'sprayer', 'sprinklers', 'compressor', 'chlorine', 'bleach', 'tablet'],
  dig: ['digging', 'lid', 'riser', 'port', 'cover', 'uncover', 'excavate', 'buried', 'depth'],
  lid: ['dig', 'riser', 'cover', 'port', 'cap', 'concrete', 'manhole'],
  clean: ['cleaning', 'jetting', 'hydro-jetting', 'scrub', 'wash', 'crust', 'scum'],
  inspect: ['inspection', 'evaluating', 'tceq', 'certified', 'real-estate', 'closing'],
  frequency: ['interval', 'often', 'schedule', 'years', 'months', 'routine'],
};

/**
 * Basic stemmer / normalizer tailored to English septic queries
 */
export function stemToken(word: string): string {
  let w = word.toLowerCase().trim();
  if (w.length <= 3) return w;

  // Suffix striping
  if (w.endsWith('ies') && w.length > 5) return w.slice(0, -3) + 'y';
  if (w.endsWith('ing') && w.length > 5) return w.slice(0, -3);
  if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('es') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) return w.slice(0, -1);
  if (w.endsWith('ly') && w.length > 4) return w.slice(0, -2);

  return w;
}

/**
 * Tokenizes text into normalized, stemmed tokens with positions
 */
export function tokenizeText(text: string): string[] {
  if (!text) return [];

  // Replace punctuation and special chars with spaces, preserve alphanumeric and hyphens
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
  const rawWords = cleaned.split(/\s+/).filter(Boolean);

  const tokens: string[] = [];
  for (const raw of rawWords) {
    const cleanWord = raw.replace(/^-+|-+$/g, '');
    if (!cleanWord || cleanWord.length < 2) continue;

    tokens.push(cleanWord);
    const stemmed = stemToken(cleanWord);
    if (stemmed !== cleanWord) {
      tokens.push(stemmed);
    }
  }

  return tokens;
}

export interface FAQSearchResult {
  item: FAQItem;
  originalIndex: number;
  score: number;
  matchedTokens: string[];
  questionMatched: boolean;
  answerMatched: boolean;
}

interface IndexedDocument {
  id: number;
  item: FAQItem;
  questionTokens: Set<string>;
  answerTokens: Set<string>;
  categoryTokens: Set<string>;
  rawQuestionLower: string;
  rawAnswerLower: string;
}

/**
 * High-performance Inverted Index for FAQ search
 */
export class FAQFullTextIndex {
  private documents: IndexedDocument[] = [];
  private invertedIndex: Map<string, Map<number, number>> = new Map(); // token -> Map<docId, weight>

  constructor(items: FAQItem[] = []) {
    this.buildIndex(items);
  }

  /**
   * Builds the inverted index across all questions and answers
   */
  public buildIndex(items: FAQItem[]) {
    this.documents = [];
    this.invertedIndex.clear();

    items.forEach((item, docId) => {
      const qTokens = tokenizeText(item.question);
      const aTokens = tokenizeText(item.answer);
      const cTokens = item.category ? tokenizeText(item.category) : [];

      const doc: IndexedDocument = {
        id: docId,
        item,
        questionTokens: new Set(qTokens),
        answerTokens: new Set(aTokens),
        categoryTokens: new Set(cTokens),
        rawQuestionLower: item.question.toLowerCase(),
        rawAnswerLower: item.answer.toLowerCase(),
      };
      this.documents.push(doc);

      // Question tokens have highest weight (3.5)
      qTokens.forEach((token) => {
        this.addTokenToInvertedIndex(token, docId, 3.5);
      });

      // Category tokens have medium weight (2.5)
      cTokens.forEach((token) => {
        this.addTokenToInvertedIndex(token, docId, 2.5);
      });

      // Answer tokens have base weight (1.0)
      aTokens.forEach((token) => {
        this.addTokenToInvertedIndex(token, docId, 1.0);
      });
    });
  }

  private addTokenToInvertedIndex(token: string, docId: number, weight: number) {
    if (!this.invertedIndex.has(token)) {
      this.invertedIndex.set(token, new Map());
    }
    const docMap = this.invertedIndex.get(token)!;
    const current = docMap.get(docId) || 0;
    docMap.set(docId, current + weight);
  }

  /**
   * Executes a real-time full-text search against the inverted index
   */
  public search(query: string): FAQSearchResult[] {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return this.documents.map((doc, idx) => ({
        item: doc.item,
        originalIndex: idx,
        score: 1.0,
        matchedTokens: [],
        questionMatched: false,
        answerMatched: false,
      }));
    }

    const queryTokens = tokenizeText(trimmed);
    if (queryTokens.length === 0) {
      return [];
    }

    const docScores = new Map<number, { score: number; matchedTokens: Set<string> }>();

    // Expand search query with synonyms and prefix matches
    const expandedSearchTokens = new Set<string>();
    queryTokens.forEach((qt) => {
      expandedSearchTokens.add(qt);
      const stemmed = stemToken(qt);
      expandedSearchTokens.add(stemmed);

      // Check synonyms
      if (SYNONYM_MAP[qt]) {
        SYNONYM_MAP[qt].forEach((syn) => expandedSearchTokens.add(syn));
      }
      if (SYNONYM_MAP[stemmed]) {
        SYNONYM_MAP[stemmed].forEach((syn) => expandedSearchTokens.add(syn));
      }
    });

    // Score based on token matches in the inverted index
    expandedSearchTokens.forEach((searchToken) => {
      // 1. Direct inverted index match
      if (this.invertedIndex.has(searchToken)) {
        const hits = this.invertedIndex.get(searchToken)!;
        hits.forEach((weight, docId) => {
          const entry = docScores.get(docId) || { score: 0, matchedTokens: new Set() };
          entry.score += weight * 2.0;
          entry.matchedTokens.add(searchToken);
          docScores.set(docId, entry);
        });
      }

      // 2. Prefix / partial match for real-time keystroke typing
      for (const [indexedToken, hits] of this.invertedIndex.entries()) {
        if (indexedToken !== searchToken && indexedToken.startsWith(searchToken) && searchToken.length >= 2) {
          hits.forEach((weight, docId) => {
            const entry = docScores.get(docId) || { score: 0, matchedTokens: new Set() };
            entry.score += weight * 1.2; // partial prefix boost
            entry.matchedTokens.add(searchToken);
            docScores.set(docId, entry);
          });
        }
      }
    });

    // 3. Exact phrase match boost
    this.documents.forEach((doc) => {
      let phraseScore = 0;
      if (doc.rawQuestionLower.includes(trimmed)) {
        phraseScore += 15.0; // Major boost for exact phrase in question
      }
      if (doc.rawAnswerLower.includes(trimmed)) {
        phraseScore += 6.0; // Moderate boost for exact phrase in answer
      }

      if (phraseScore > 0) {
        const entry = docScores.get(doc.id) || { score: 0, matchedTokens: new Set() };
        entry.score += phraseScore;
        entry.matchedTokens.add(trimmed);
        docScores.set(doc.id, entry);
      }
    });

    // Compile results
    const results: FAQSearchResult[] = [];
    docScores.forEach((data, docId) => {
      const doc = this.documents[docId];
      if (!doc) return;

      const matchedTokensArr = Array.from(data.matchedTokens);
      const questionMatched = matchedTokensArr.some(
        (t) => doc.rawQuestionLower.includes(t) || doc.questionTokens.has(t)
      );
      const answerMatched = matchedTokensArr.some(
        (t) => doc.rawAnswerLower.includes(t) || doc.answerTokens.has(t)
      );

      results.push({
        item: doc.item,
        originalIndex: doc.id,
        score: data.score,
        matchedTokens: matchedTokensArr,
        questionMatched,
        answerMatched,
      });
    });

    // Sort by highest score descending
    results.sort((a, b) => b.score - a.score);

    return results;
  }
}
