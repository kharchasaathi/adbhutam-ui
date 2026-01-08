/**
 * LLM Gateway
 * -----------
 * - Secure bridge between Adbhutam Brain and ChatGPT API
 * - NO UI
 * - NO business logic
 * - Cost & safety controlled
 */

import fetch from "node-fetch";

// 🔒 Config
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = "gpt-4o-mini";
const MAX_TOKENS = 800;
const TEMPERATURE = 0.4;

/**
 * Call ChatGPT LLM safely
 */
export async function callLLM({ system, user }) {
  // Safety: API key check
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE
    })
  });

  // ❌ API-level failure
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`LLM API error: ${errText}`);
  }

  const data = await response.json();

  // ❌ Unexpected shape safety
  if (
    !data.choices ||
    !data.choices[0] ||
    !data.choices[0].message
  ) {
    throw new Error("Invalid LLM response format");
  }

  return data.choices[0].message.content.trim();
}
