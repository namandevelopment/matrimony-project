import rawKnowledgeBase from "./data/englishTalks.json";
import { checkAbusiveContent } from "./abusiveFilter";
import type {
  BotResponseResult,
  KnowledgeBaseCategory,
  KnowledgeBaseSchema,
} from "./types";

const knowledgeBase: KnowledgeBaseSchema = rawKnowledgeBase as unknown as KnowledgeBaseSchema;

/**
 * Common Hinglish, Hindi, and English synonym dictionary to expand user vocabulary.
 */
const SYNONYM_MAP: Record<string, string[]> = {
  price: [
    "paisa",
    "paise",
    "rupaye",
    "rupee",
    "rupees",
    "cost",
    "fees",
    "charge",
    "charges",
    "rate",
    "rates",
    "kharcha",
    "kitna",
  ],
  free: [
    "muft",
    "mufat",
    "bina",
    "zero",
    "freee",
    "costless",
  ],
  match: [
    "rishta",
    "rishtey",
    "shadi",
    "shaadi",
    "vivah",
    "partner",
    "jeevansathi",
    "dulhan",
    "dulha",
    "bride",
    "groom",
    "ladki",
    "ladka",
    "kanya",
  ],
  register: [
    "registration",
    "signup",
    "sign-up",
    "account",
    "banana",
    "judna",
    "profile",
    "create",
    "join",
    "id",
  ],
  search: [
    "dhundhna",
    "dhoondhna",
    "khojna",
    "dekhna",
    "talash",
    "find",
    "browse",
    "filter",
  ],
  contact: [
    "phone",
    "mobile",
    "number",
    "no",
    "call",
    "calling",
    "sampark",
    "baat",
    "dial",
    "whatsapp",
  ],
  gotra: [
    "nukh",
    "gotr",
    "swagotra",
    "nookh",
    "kul",
  ],
  caste: [
    "subcaste",
    "sub-caste",
    "jaati",
    "bhaiband",
    "amil",
    "lohana",
    "sahiti",
    "biradari",
    "samaj",
  ],
  kundli: [
    "kundali",
    "patrika",
    "horoscope",
    "astro",
    "gun",
    "milan",
    "manglik",
  ],
  support: [
    "help",
    "madad",
    "sahayata",
    "problem",
    "dikkat",
    "issue",
    "complaint",
    "care",
    "manager",
  ],
  login: [
    "signin",
    "otp",
    "password",
    "passcode",
    "code",
    "access",
  ],
  city: [
    "location",
    "shahar",
    "shehar",
    "jagah",
    "place",
    "state",
  ],
};

/**
 * Normalizes input text and tokenizes into words
 */
function tokenize(text: string): string[] {
  const clean = text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return [];
  return clean.split(" ").filter((w) => w.length > 1);
}

/**
 * Expands a list of tokens with known synonyms
 */
function expandWithSynonyms(tokens: string[]): string[] {
  const expanded = new Set<string>(tokens);

  for (const token of tokens) {
    for (const [canonical, syns] of Object.entries(SYNONYM_MAP)) {
      if (token === canonical || syns.includes(token)) {
        expanded.add(canonical);
        syns.forEach((s) => expanded.add(s));
      }
    }
  }

  return Array.from(expanded);
}

/**
 * Safe phrase or word matching preventing substring collisions
 * (e.g., prevents "hi" from falsely matching inside "sindhi" or "delhi")
 */
function matchesPhraseOrWord(
  queryText: string,
  queryWords: string[],
  keyword: string
): boolean {
  const kw = keyword.toLowerCase().trim();
  if (!kw) return false;

  // Single word: must be a discrete token match
  if (!kw.includes(" ")) {
    return queryWords.includes(kw);
  }

  // Multi-word phrase: match using regex word boundaries
  try {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|\\s|[.,!?])${escaped}($|\\s|[.,!?])`, "i");
    return regex.test(queryText);
  } catch {
    return queryText.includes(kw);
  }
}

/**
 * Calculates a match score for a given category against the user's query
 */
function scoreCategory(
  queryRaw: string,
  userTokens: string[],
  expandedTokens: string[],
  category: KnowledgeBaseCategory
): number {
  const queryLower = queryRaw.toLowerCase().trim();
  let score = 0;

  // 1. Exact Sample Question match (Highest Priority)
  for (const sq of category.sampleQuestions) {
    const sqLower = sq.toLowerCase().trim();
    if (queryLower === sqLower) {
      return 150;
    }
    if (matchesPhraseOrWord(queryLower, userTokens, sqLower)) {
      score += 45;
    }
  }

  // 2. Primary keyword match with phrase priority
  for (const pk of category.primaryKeywords) {
    const pkLower = pk.toLowerCase().trim();
    if (queryLower === pkLower) {
      return 120;
    }
    if (matchesPhraseOrWord(queryLower, userTokens, pkLower)) {
      // Multi-word phrases (e.g. "jai jhulelal", "free registration", "same gotra") receive bonus weight
      score += pkLower.includes(" ") ? 35 : 24;
    }
  }

  // 3. Secondary keyword match
  for (const sk of category.secondaryKeywords) {
    const skLower = sk.toLowerCase().trim();
    if (matchesPhraseOrWord(queryLower, userTokens, skLower)) {
      score += 12;
    }
  }

  // 4. Token Overlap Scoring
  const categoryPrimaryTokens = category.primaryKeywords.flatMap(tokenize);
  const categorySecondaryTokens = category.secondaryKeywords.flatMap(tokenize);

  const matchedPrimary = userTokens.filter((ut) =>
    categoryPrimaryTokens.includes(ut)
  );
  score += matchedPrimary.length * 6;

  const matchedExpanded = expandedTokens.filter((et) =>
    categoryPrimaryTokens.includes(et)
  );
  score += matchedExpanded.length * 2.5;

  const matchedSecondary = userTokens.filter((ut) =>
    categorySecondaryTokens.includes(ut)
  );
  score += matchedSecondary.length * 2;

  return score;
}

export interface BotResponseOptions {
  whatsappNumber?: string;
}

/**
 * Main function: Receives user message and returns dynamic response
 */
export function getBotResponse(
  userInput: string,
  options: BotResponseOptions = {}
): BotResponseResult {
  const whatsappNumber = options.whatsappNumber || "918769530667";
  const trimmed = (userInput || "").trim();

  if (!trimmed) {
    return {
      text: "Namaste! 🙏 Please type your question, and I'll be happy to assist you.",
      suggestedQuestions: [
        "Free Registration Kaise Kare?",
        "Find Compatible Matches",
        "Membership Plans",
        "Talk to Relationship Manager",
      ],
    };
  }

  // 1. MODERATION CHECK: Strict Abusive & Profanity Filtering
  const moderationCheck = checkAbusiveContent(trimmed, knowledgeBase.moderation);
  if (moderationCheck.isAbusive) {
    return {
      text: moderationCheck.warningResponse,
      isAbusiveWarning: true,
      suggestedQuestions: [
        "Free Registration Kaise Kare?",
        "Find Sindhi Matches",
        "Membership Plans & Benefits",
        "Talk to Relationship Manager",
      ],
    };
  }

  // 2. Tokenize and expand user input
  const userTokens = tokenize(trimmed);
  const expandedTokens = expandWithSynonyms(userTokens);

  // 3. Score all categories
  let bestCategory: KnowledgeBaseCategory | null = null;
  let highestScore = 0;

  for (const category of knowledgeBase.categories) {
    const score = scoreCategory(trimmed, userTokens, expandedTokens, category);
    if (score > highestScore) {
      highestScore = score;
      bestCategory = category;
    }
  }

  // 4. Threshold check (must have sufficient confidence)
  const MIN_CONFIDENCE_SCORE = 12;

  if (bestCategory && highestScore >= MIN_CONFIDENCE_SCORE) {
    let actionUrl = bestCategory.actionUrl;
    if (actionUrl) {
      actionUrl = actionUrl
        .replace("{phone}", whatsappNumber)
        .replace("{query}", encodeURIComponent(trimmed));
    }

    return {
      text: bestCategory.response,
      actionLabel: bestCategory.actionLabel,
      actionUrl,
      actionType: bestCategory.actionType,
      suggestedQuestions: bestCategory.suggestedQuestions,
      matchedCategoryId: bestCategory.id,
    };
  }

  // 5. COURTEOUS FALLBACK: Helpful guidance with quick options
  const fallback = knowledgeBase.fallback;
  let fallbackActionUrl = fallback.actionUrl;
  if (fallbackActionUrl) {
    fallbackActionUrl = fallbackActionUrl
      .replace("{phone}", whatsappNumber)
      .replace("{query}", encodeURIComponent(trimmed));
  }

  return {
    text: fallback.response,
    actionLabel: fallback.actionLabel,
    actionUrl: fallbackActionUrl,
    actionType: "whatsapp",
    suggestedQuestions: fallback.suggestedQuestions,
  };
}

export { knowledgeBase };
