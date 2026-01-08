/**
 * LLM Gateway
 * -----------
 * - Secure bridge between Adbhutam Brain and ChatGPT API
 * - NO UI
 * - NO business logic
 */

import fetch from "node-fetch";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = "gpt-4o-mini";

export async function callLLM({ system, user }) {
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
      temperature: 0.4,
      max_tokens: 800
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
