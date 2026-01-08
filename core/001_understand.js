/**
 * core/001_understand.js
 *
 * Adbhutam – Understanding Layer
 * ------------------------------
 * Responsibility:
 *  - Convert raw human input into structured intent
 *  - NO answering
 *  - NO assumptions
 *  - NO domain hardcoding
 *
 * Output of this file is the ONLY truth
 * for all next pipeline stages.
 */

const Understand = {};

/**
 * Normalize input safely
 */
function normalizeInput(input) {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Detect basic user action intent
 * (WHAT user wants to do)
 */
function detectAction(text) {
  const t = text.toLowerCase();

  if (/\b(build|create|generate|make|develop)\b/.test(t)) {
    return "build";
  }
  if (/\b(fix|debug|solve|repair|error)\b/.test(t)) {
    return "fix";
  }
  if (/\b(explain|why|how|what is|define)\b/.test(t)) {
    return "explain";
  }
  if (/\b(compare|decide|choose|better)\b/.test(t)) {
    return "decide";
  }

  return "ask";
}

/**
 * Detect target abstraction
 * (WHAT kind of thing the action applies to)
 */
function detectTarget(text) {
  const t = text.toLowerCase();

  if (/\b(code|program|script|function|class)\b/.test(t)) {
    return "code";
  }
  if (/\b(app|application|software|system|tool)\b/.test(t)) {
    return "system";
  }
  if (/\b(architecture|design|structure)\b/.test(t)) {
    return "architecture";
  }
  if (/\b(data|database|file|storage)\b/.test(t)) {
    return "data";
  }

  return "unknown";
}

/**
 * Measure clarity level
 */
function measureClarity(action, target) {
  if (action !== "ask" && target !== "unknown") {
    return "high";
  }
  if (action !== "ask") {
    return "medium";
  }
  return "low";
}

/**
 * MAIN ENTRY
 * This is the ONLY exported function
 */
Understand.process = function (rawInput) {
  const text = normalizeInput(rawInput);

  const action = detectAction(text);
  const target = detectTarget(text);
  const clarity = measureClarity(action, target);

  return {
    stage: "understand",
    raw: rawInput,
    normalized: text,
    intent: {
      action,   // build | fix | explain | decide | ask
      target,   // code | system | architecture | data | unknown
      clarity   // high | medium | low
    },
    meta: {
      length: text.length,
      empty: text.length === 0,
      timestamp: Date.now()
    }
  };
};

module.exports = Understand;
