/**
 * index.js
 *
 * Adbhutam – Master Orchestrator
 * ------------------------------
 * Full Pipeline:
 * UI →
 * 001_understand →
 * 002_decide →
 * 003_plan →
 * 004_execute →
 * 005_validate →
 * 006_finalize →
 * UI Output
 */

import Understand from "./core/001_understand.js";
import Decide from "./core/002_decide.js";
import Plan from "./core/003_plan.js";
import Execute from "./core/004_execute.js";
import Validate from "./core/005_validate.js";
import Finalize from "./core/006_finalize.js";

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

  // 001 – Understand
  const understandResult = Understand.process(rawText);

  // 002 – Decide
  const decideResult = Decide.process(understandResult);

  // 003 – Plan
  const planResult = Plan.process(decideResult, understandResult);

  // 004 – Execute
  const executeResult = Execute.process(planResult);

  // 005 – Validate
  const validateResult = Validate.process(executeResult);

  // 006 – Finalize
  const finalResult = Finalize.process(validateResult);

  // UI shows ONLY final, trusted output
  renderOutput({
    pipeline: [
      "001_understand",
      "002_decide",
      "003_plan",
      "004_execute",
      "005_validate",
      "006_finalize"
    ],
    result: finalResult
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
  pipeline: [
    "001_understand",
    "002_decide",
    "003_plan",
    "004_execute",
    "005_validate",
    "006_finalize"
  ],
  message: "Type a request and press Enter"
});
