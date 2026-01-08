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

document.addEventListener("DOMContentLoaded", () => {

  const inputEl = document.getElementById("input");
  const outputEl = document.getElementById("output");

  if (!inputEl || !outputEl) {
    console.error("UI elements not found", { inputEl, outputEl });
    return;
  }

  function renderOutput(data) {
    outputEl.textContent = JSON.stringify(data, null, 2);
  }

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

    const understandResult = Understand.process(rawText);
    const decideResult = Decide.process(understandResult);
    const planResult = Plan.process(decideResult, understandResult);
    const executeResult = Execute.process(planResult);
    const validateResult = Validate.process(executeResult);
    const finalResult = Finalize.process(validateResult);

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

  // expose safely (for future chat UI, debugging, etc.)
  window.Adbhutham = {
    processInput,
    renderOutput
  };

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      processInput();
    }
  });

  inputEl.focus();

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

});
