/**
 * index.js
 *
 * Adbhutam – Brain Engine (NO UI)
 * ------------------------------
 * Pure pipeline execution
 * - NO DOM access
 * - NO rendering
 * - NO event listeners
 *
 * UI / API / CLI can call this safely
 */

import Understand from "./core/001_understand.js";
import Decide from "./core/002_decide.js";
import Plan from "./core/003_plan.js";
import Execute from "./core/004_execute.js";
import Validate from "./core/005_validate.js";
import Finalize from "./core/006_finalize.js";

/**
 * Global pipeline runner
 * ----------------------
 * This is the ONLY public entry
 */
window.runAdbhutam = function (rawText) {
  if (!rawText || String(rawText).trim() === "") {
    return {
      stage: "ui",
      error: "Input is empty"
    };
  }

  // 001 – Understand
  const u = Understand.process(rawText);

  // 002 – Decide
  const d = Decide.process(u);

  // 003 – Plan
  const p = Plan.process(d, u);

  // 004 – Execute
  const e = Execute.process(p);

  // 005 – Validate
  const v = Validate.process(e);

  // 006 – Finalize
  const f = Finalize.process(v);

  return {
    pipeline: [
      "001_understand",
      "002_decide",
      "003_plan",
      "004_execute",
      "005_validate",
      "006_finalize"
    ],
    result: f
  };
};
