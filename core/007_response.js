/**
 * core/007_response.js
 *
 * Response Layer (LLM-powered)
 * -----------------------------
 * - Converts FINAL pipeline state → human reply
 * - Delegates language + reasoning to ChatGPT
 * - NO fake intelligence
 * - NO hardcoded answers
 */

import { callLLM } from "../server/llmGateway.js";

const Response = {};

Response.process = async function (finalPayload, rawText) {
  // Safety guard
  if (!rawText || !rawText.trim()) {
    return "Please type something first.";
  }

  const systemPrompt = `
You are "Adbhutam Brain".

Rules:
- Understand Telugu, English, or mixed input
- Reply naturally in the SAME language as the user
- Be clear, concise, and human-like
- Use reasoning, not canned responses
- If information is missing, ASK instead of assuming
- Do NOT hallucinate facts or code
`;

  const userPrompt = `
User Input:
${rawText}

System State (JSON):
${JSON.stringify(finalPayload, null, 2)}

Task:
Generate the best possible reply for the user.
`;

  const reply = await callLLM({
    system: systemPrompt,
    user: userPrompt
  });

  return reply;
};

export default Response;
