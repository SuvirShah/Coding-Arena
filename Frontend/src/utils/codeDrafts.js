//Added to save user code prgress if he refreshes or changes problem
const PREFIX = "codearena";
const LANGUAGES = ["javascript", "java", "c++"];
const MAX_DRAFT_CHARS = 200_000;

const draftKey = (userId, problemId, language) =>
  `${PREFIX}:draft:${userId || "anon"}:${problemId}:${language}`;
const languageKey = (userId, problemId) =>
  `${PREFIX}:lang:${userId || "anon"}:${problemId}`;

const safely = (fn, fallback = null) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

export const loadDraft = (userId, problemId, language) =>
  safely(() => window.localStorage.getItem(draftKey(userId, problemId, language)));

// Saving the untouched starter code (or nothing) removes the draft instead of storing it,
// so later changes to a problem's starter code are never hidden by a stale copy.
export const saveDraft = (userId, problemId, language, code, starterCode) =>
  safely(() => {
    const key = draftKey(userId, problemId, language);
    if (!code || !code.trim() || code === starterCode || code.length > MAX_DRAFT_CHARS) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, code);
    }
  });

export const clearDraft = (userId, problemId, language) =>
  safely(() => window.localStorage.removeItem(draftKey(userId, problemId, language)));

export const loadLanguage = (userId, problemId) => {
  const stored = safely(() => window.localStorage.getItem(languageKey(userId, problemId)));
  return LANGUAGES.includes(stored) ? stored : null;
};

export const saveLanguage = (userId, problemId, language) =>
  safely(() => {
    if (LANGUAGES.includes(language)) {
      window.localStorage.setItem(languageKey(userId, problemId), language);
    }
  });