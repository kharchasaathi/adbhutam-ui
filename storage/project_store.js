/**
 * storage/project_store.js
 *
 * Adbhutam – Project Storage Engine
 * --------------------------------
 * Responsibility:
 *  - Store generated code chunks
 *  - Maintain version history
 *  - Prevent accidental overwrite
 *  - Enable rollback foundation
 */

const STORE_KEY = "adbhutam_project_store_v1";

const ProjectStore = {};

/**
 * Load full store
 */
function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save full store
 */
function saveStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

/**
 * Create or update a project
 */
ProjectStore.saveChunk = function ({
  project,
  module,
  language,
  chunk_id,
  content
}) {
  if (!project || !module || !chunk_id) {
    throw new Error("Invalid storage parameters");
  }

  const store = loadStore();

  if (!store[project]) {
    store[project] = {
      created_at: Date.now(),
      modules: {}
    };
  }

  if (!store[project].modules[module]) {
    store[project].modules[module] = {
      language,
      versions: []
    };
  }

  store[project].modules[module].versions.push({
    chunk_id,
    content,
    saved_at: Date.now()
  });

  saveStore(store);

  return {
    stored: true,
    project,
    module,
    chunk_id
  };
};

/**
 * Get project snapshot
 */
ProjectStore.getProject = function (project) {
  const store = loadStore();
  return store[project] || null;
};

/**
 * Clear entire store (manual use only)
 */
ProjectStore.clearAll = function () {
  localStorage.removeItem(STORE_KEY);
};

export default ProjectStore;
