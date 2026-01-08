/**
 * core/007_response.js
 *
 * Adbhutam – Response Layer
 * ------------------------
 * - Converts FINAL pipeline output into human text
 * - NO logic decisions
 * - NO execution
 */

const Response = {};

Response.process = function (finalPayload, rawText) {
  // Safety fallback
  if (!finalPayload || !finalPayload.result) {
    return "Something went wrong. Please try again.";
  }

  const r = finalPayload.result;

  // Friendly greeting
  if (rawText.trim().toLowerCase() === "hi") {
    return "Hello 👋 How can I help you today?";
  }

  // Validation failed → helpful guidance
  if (r.trusted === false) {
    return (
      "I understood your request, but something is missing.\n\n" +
      "Issue: " + r.summary + "\n" +
      "Next step: " + r.next.replace(/_/g, " ")
    );
  }

  // Success case
  return (
    "✅ Done.\n\n" +
    "Summary:\n" +
    (r.summary || "Request processed successfully.")
  );
};

export default Response;
