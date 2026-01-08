/**
 * index.js
 *
 * Adbhutam – Master Orchestrator (UI → Brain)
 * ------------------------------------------
 * - Reads user input
 * - Passes it through brain pipeline
 * - Displays structured output
 * - NO answering
 * - NO AI
 */

import Understand from "./core/001_understand.js";

// DOM elements
const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");

// Utility: safe render
function renderOutput(data) {
  outputEl.textContent = JSON.stringify(data, null, 2);
}

// Main trigger
function processInput() {
  const rawText = inputEl.value;

  if (!rawText || rawText.trim() === "") {
    renderOutput({
      error: "Input is empty",
      hint: "Type something to start the pipeline"
    });
    return;
  }

  // Stage 1: Understanding
  const understandResult = Understand.process(rawText);

  // For now, just display the understanding output
  renderOutput(understandResult);
}

// Event bindings

// Enter key (Ctrl+Enter or plain Enter)
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    processInput();
  }
});

// Optional: auto-focus
inputEl.focus();

// Initial state
renderOutput({
  status: "Ready",
  next: "Type a request and press Enter",
  pipeline: ["001_understand"]
});
