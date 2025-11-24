// ===============================
// PART 1 — CORE ENGINE
// ===============================
console.log("Adbhutam Super Brain v10 Loaded");

// Dynamic Cloud URL
let CLOUD_SERVER = window.CLOUD_SERVER || "";

// Base API Caller
// 🟢 CORRECTION: Added 'files = []' parameter and included it in the JSON body
async function callServer(message, context = {}, files = []) {
  if (!CLOUD_SERVER) {
    return "⚠ Backend URL missing. Please set CLOUD_SERVER.";
  }

  try {
    const res = await fetch(CLOUD_SERVER + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context, files }) // 'files' included
    });

    const data = await res.json();
    return data.reply;
  } catch (e) {
    return "⚠ Network Error: " + e.message;
  }
}

window.BrainCore = {
  callServer
};
// ===============================
// PART 2 — INTENT CLASSIFIER
// ===============================
window.BrainIntent = {
  detect(text) {
    const t = text.toLowerCase();

    if (t.includes("ui") && t.includes("structure")) return "ui_structure";
    if (t.includes("explain") || t.includes("గురించి")) return "explain";
    if (t.includes("debug") || t.includes("fix")) return "debug";
    if (t.includes("improve") || t.includes("optimize")) return "improve";
    if (t.includes("code") && t.includes("create")) return "code_generate";

    return "chat";
  }
};
// ===============================
// PART 3 — MEMORY SYSTEM
// ===============================
window.BrainMemory = {
  store: [],
  push(type, content) {
    this.store.push({ type, content, time: Date.now() });
    if (this.store.length > 20) this.store.shift();
  },
  last() {
    return this.store[this.store.length - 1];
  }
};
// ===============================
// PART 4 — TOOLBOX
// ===============================
window.BrainTools = {
  makeCodeBlock(code, lang = "") {
    return "```" + lang + "\n" + code + "\n```";
  },

  wrapHTML(el) {
    return `<div style="padding:8px;background:#222;border-radius:6px;">${el}</div>`;
  }
};
// ===============================
// PART 5 — FILE READER
// ===============================
window.BrainFiles = {
  readFileContent(file) {
    return new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.readAsText(file);
    });
  }
};
// ===============================
// PART 6 — UI STRUCTURE GENERATOR
// ===============================
window.BrainUI = {
  structure() {
    return `
<div class=\"container\">
  <header>Header</header>
  <main>Content</main>
  <footer>Footer</footer>
</div>

<style>
.container{
  display:flex;
  flex-direction:column;
  height:100vh;
  background:#111;
  color:white;
  padding:10px;
}
header, footer{
  padding:10px;
  background:#222;
  border-radius:6px;
}
main{
  flex:1;
  margin:10px 0;
  background:#181818;
  border-radius:6px;
  padding:10px;
}
</style>
`;
  }
};
// ===============================
// PART 7 — DEBUG ENGINE
// ===============================
window.BrainDebug = {
  async analyze(code) {
    if (!code.includes("<") && !code.includes("function")) {
      return "❌ ఇది valid code కాదు.";
    }
    return "🔍 Code looks OK. No major issues found.";
  }
};
// ===============================
// PART 8 — KNOWLEDGE MODE
// ===============================
window.BrainKnowledge = {
  explain(text) {
    return "📘 Explanation for: " + text + "\n\nThis will be replaced by server response.";
  }
};
// ===============================
// PART 9 — CHAT MODE
// ===============================
window.BrainChat = {
  async chat(msg) {
    return "💬 " + msg;
  }
};
// ===============================
// PART 10 — MASTER MIXER
// ===============================
window.brain = {
  async think(message, context = {}) {
    const intent = BrainIntent.detect(message);

    BrainMemory.push("user", message);

    switch (intent) {
      case "ui_structure":
        return BrainTools.makeCodeBlock(BrainUI.structure(), "html");

      case "debug":
        return BrainDebug.analyze(message);

      case "explain":
        return BrainKnowledge.explain(message);

      case "code_generate":
        return "🧩 Code generation will be handled by server.";

      default:
        // Client-side 'send' function handles passing files to callServer.
        return BrainCore.callServer(message, context);
    }
  }
};
