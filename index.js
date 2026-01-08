/**
 * index.js
 *
 * Adbhutam – Master Orchestrator
 * ------------------------------
 * Pipeline:
 *   UI → 001_understand → 002_decide → output
 */

import Understand from "./core/001_understand.js";
import Decide from "./core/002_decide.js";

// DOM elements
const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");

// Utility: render JSON safely
function renderOutput(data) {
  outputEl.textContent = JSON.stringify(data, null, 2);
}

// Main pipeline executor
function processInput() {
  const rawText = inputEl.value;

  if (!rawText || rawText.trim() === "") {
    renderOutput({
      stage: "ui",
      error: "Input is empty",
      hint: "Type something and press Enter"
    });
    return;
  }

  // Stage 1: Understand
  const understandResult = Understand.process(rawText);

  // Stage 2: Decide
  const decideResult = Decide.process(understandResult);

  // Final combined output (for now)
  renderOutput({
    pipeline: ["001_understand", "002_decide"],
    understand: understandResult,
    decide: decideResult
  });
}

// Event bindings
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    processInput();
  }
});

// Auto-focus
inputEl.focus();

// Initial state
renderOutput({
  status: "Ready",
  pipeline: ["001_understand", "002_decide"],
  message: "Type a request and press Enter"
});
