import type { KnowledgeBaseModeration } from "./types";

/**
 * Normalizes input text by mapping common leetspeak substitutions,
 * removing special noise symbols, and compressing repeated consecutive characters.
 */
function normalizeText(text: string): { normalized: string; compact: string } {
  const lower = text.toLowerCase().trim();

  // 1. Replace typical leetspeak characters
  let replaced = lower
    .replace(/@/g, "a")
    .replace(/1|!/g, "i")
    .replace(/0/g, "o")
    .replace(/\$/g, "s")
    .replace(/3/g, "e")
    .replace(/5/g, "s")
    .replace(/7|\+/g, "t");

  // 2. Collapse repetitive identical characters (e.g., "bcccc" -> "bc", "fuuuck" -> "fuck")
  // Only compress if repeated 3 or more times into 1 or 2
  replaced = replaced.replace(/(.)\1{2,}/g, "$1$1");

  // 3. Compact form without spaces or punctuation to detect spaced evasion like "b c" or "f u c k"
  const compact = replaced.replace(/[\s\-_.,/\\#?!@$%^&*()+~`'"|<>]/g, "");

  return { normalized: replaced, compact };
}

/**
 * Validates whether the user message contains abusive, obscene, profane, or harassing content.
 * Returns { isAbusive: boolean, warningResponse: string }
 */
export function checkAbusiveContent(
  text: string,
  moderation: KnowledgeBaseModeration
): { isAbusive: boolean; warningResponse: string } {
  if (!text || !text.trim()) {
    return { isAbusive: false, warningResponse: "" };
  }

  const { normalized, compact } = normalizeText(text);

  // 1. Check abusive patterns (regexes)
  if (moderation.abusivePatterns && moderation.abusivePatterns.length > 0) {
    for (const patternStr of moderation.abusivePatterns) {
      try {
        const regex = new RegExp(patternStr, "i");
        if (regex.test(normalized) || regex.test(compact)) {
          return {
            isAbusive: true,
            warningResponse: getRandomWarningResponse(moderation.warningResponses),
          };
        }
      } catch {
        // Safe fallback in case of regex syntax issues
      }
    }
  }

  // 2. Check standalone word boundaries
  const words = normalized.split(/[\s,.;:!?/\\|()[\]{}<>"-]+/);

  for (const keyword of moderation.abusiveKeywords) {
    const kw = keyword.toLowerCase().trim();
    if (!kw) continue;

    // Check exact word token match
    if (words.includes(kw)) {
      return {
        isAbusive: true,
        warningResponse: getRandomWarningResponse(moderation.warningResponses),
      };
    }

    // Check compact exact match if keyword is a common short code like "bc" or "mc"
    if (kw.length >= 2 && compact === kw) {
      return {
        isAbusive: true,
        warningResponse: getRandomWarningResponse(moderation.warningResponses),
      };
    }

    // Check if long vulgar phrase is substring (e.g., "motherfucker", "bhenchod")
    if (kw.length >= 4 && (normalized.includes(kw) || compact.includes(kw))) {
      return {
        isAbusive: true,
        warningResponse: getRandomWarningResponse(moderation.warningResponses),
      };
    }
  }

  return { isAbusive: false, warningResponse: "" };
}

/**
 * Picks a polite and firm warning message from moderation list
 */
function getRandomWarningResponse(warnings: string[]): string {
  if (!warnings || warnings.length === 0) {
    return "⚠️ Sindhi Matrimony par hum sabhi sadasyon ka aadar karte hain. Kripya shishtachar banaye rakhein aur aadarpoorvak baat karein. Hum ek pavitra va sammanit vivah manch hain. 🙏";
  }
  const index = Math.floor(Math.random() * warnings.length);
  return warnings[index];
}
