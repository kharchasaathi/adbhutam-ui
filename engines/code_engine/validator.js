/**
 * engines/code_engine/validator.js
 *
 * Adbhutam – Code Validation Engine
 * --------------------------------
 * Responsibility:
 *  - Validate generated code instructions
 *  - Detect conflicts, duplicates, unsafe output
 *  - Enforce chunk completeness
 */

const CodeValidator = {};

/**
 * Validate a prepared generation task
 */
CodeValidator.validateTask = function (task) {
  const issues = [];

  if (!task || typeof task !== "object") {
    return {
      valid: false,
      issues: ["Task is missing or invalid"]
    };
  }

  if (!task.task_id) {
    issues.push("Missing task_id");
  }

  if (!task.module) {
    issues.push("Module name is missing");
  }

  if (!task.language) {
    issues.push("Target language is missing");
  }

  if (!Array.isArray(task.chunks) || task.chunks.length === 0) {
    issues.push("No chunks defined for generation");
  }

  // Check chunk integrity
  const seenChunks = new Set();
  for (const chunk of task.chunks) {
    if (!chunk.chunk_id) {
      issues.push("Chunk without chunk_id detected");
      continue;
    }

    if (seenChunks.has(chunk.chunk_id)) {
      issues.push(`Duplicate chunk_id detected: ${chunk.chunk_id}`);
    }

    seenChunks.add(chunk.chunk_id);

    if (chunk.max_lines <= 0) {
      issues.push(`Invalid max_lines for chunk ${chunk.chunk_id}`);
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
};

/**
 * MAIN ENTRY
 */
CodeValidator.process = function (generatorOutput) {
  if (
    !generatorOutput ||
    generatorOutput.engine !== "code_generator" ||
    generatorOutput.status !== "prepared"
  ) {
    return {
      engine: "code_validator",
      status: "failed",
      issues: ["Invalid generator output"]
    };
  }

  const result = CodeValidator.validateTask(generatorOutput.task);

  if (!result.valid) {
    return {
      engine: "code_validator",
      status: "failed",
      issues: result.issues
    };
  }

  return {
    engine: "code_validator",
    status: "passed",
    task: generatorOutput.task
  };
};

export default CodeValidator;
