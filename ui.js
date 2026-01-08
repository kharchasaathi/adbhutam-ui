/**
 * UI Layer (ChatGPT-style)
 * ------------------------
 * - Brain debug (deterministic)
 * - Human-style reply (LLM)
 * - Production safe
 */

// ✅ FINAL BACKEND URL
const API_BASE =
  "https://adbhutam-cloud-brain-production.up.railway.app";

const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

let thinkingBubble = null;

/* ---------------- UI helpers ---------------- */

function addMessage(text, cls) {
  const wrap = document.createElement("div");
  wrap.className = "msg " + cls;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  wrap.appendChild(bubble);
  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;

  return wrap;
}

function showThinking(label = "Thinking…") {
  thinkingBubble = addMessage(label, "system");
}

function removeThinking() {
  if (thinkingBubble) {
    thinkingBubble.remove();
    thinkingBubble = null;
  }
}

/* ---------------- Main logic ---------------- */

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // User message
  addMessage(text, "user");
  input.value = "";

  showThinking("🧠 Processing…");

  try {
    /* 1️⃣ Brain (deterministic) */
    const brainRes = await fetch(`${API_BASE}/brain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const brainData = await brainRes.json();
    removeThinking();

    // 🧠 Brain Debug Output (same as old, but labeled)
    addMessage(
      "🧠 Brain Output:\n" +
        JSON.stringify(brainData.result, null, 2),
      "system"
    );

    /* 2️⃣ LLM (human reply) */
    showThinking("💬 Generating reply…");

    try {
      const llmRes = await fetch(`${API_BASE}/llm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text })
      });

      const llmData = await llmRes.json();
      removeThinking();

      addMessage(
        llmData?.out || "No human reply available",
        "system"
      );
    } catch (llmErr) {
      removeThinking();
      addMessage(
        "⚠️ Brain OK, but human reply unavailable",
        "system"
      );
      console.error("LLM error:", llmErr);
    }

  } catch (err) {
    removeThinking();
    addMessage("⚠️ Cloud Brain not reachable", "system");
    console.error("Brain error:", err);
  }
}

/* ---------------- Events ---------------- */

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
