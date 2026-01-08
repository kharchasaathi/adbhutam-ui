/**
 * engines/ai_engine/ai_client.js
 *
 * Adbhutam – AI Language Client
 * -----------------------------
 * Responsibility:
 *  - Send text to AI model
 *  - Receive structured understanding
 *  - NO direct answers
 */

const AIClient = {};

/**
 * Analyze user language
 * This function MUST return structured data, not free text.
 */
AIClient.analyze = async function (text) {
  // Placeholder for real AI call
  // Later: OpenAI / Azure / local LLM

  return {
    language_detected: ["telugu", "english"],
    intent: "build",
    domain: "software",
    entities: [],
    confidence: 0.0,
    raw: text
  };
};

export default AIClient;
