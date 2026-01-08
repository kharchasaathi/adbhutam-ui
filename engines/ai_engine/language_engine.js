/**
 * engines/ai_engine/language_engine.js
 *
 * Adbhutam – AI Language Engine
 * ----------------------------
 * Responsibility:
 *  - Enhance understanding using AI
 *  - Normalize Telugu / English mixed input
 */

import AIClient from "./ai_client.js";

const LanguageEngine = {};

LanguageEngine.process = async function (rawText) {
  if (!rawText || typeof rawText !== "string") {
    return {
      stage: "ai_language",
      status: "failed",
      error: "Invalid input text"
    };
  }

  const analysis = await AIClient.analyze(rawText);

  return {
    stage: "ai_language",
    status: "ok",
    analysis
  };
};

export default LanguageEngine;
