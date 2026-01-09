/**
 * UI Layer (ChatGPT-style)
 * ------------------------
 * - Brain debug (deterministic)
 * - Human-style reply (Gemini LLM)
 * - Strong error handling
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

  /* USER MESSAGE */
  addMessage(text, "user");
  input.value = "";

  /* ---------------- BRAIN ---------------- */

  showThinking("🧠 Processing…");

  try {
    const brainRes = await fetch(`${API_BASE}/brain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    if (!brainRes.ok) {
      throw new Error("Brain API failed");
    }

    const brainData = await brainRes.json();
    removeThinking();

    addMessage(
      "🧠 Brain Output:\n" +
        JSON.stringify(brainData.result, null, 2),
      "system"
    );

  } catch (brainErr) {
    removeThinking();
    addMessage("⚠️ Brain service unreachable", "system");
    console.error("Brain error:", brainErr);
    return; // ❌ STOP — no LLM if brain failed
  }

  /* ---------------- LLM (GEMINI) ---------------- */

  showThinking("💬 Generating reply…");

  try {
    const llmRes = await fetch(`${API_BASE}/llm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text })
    });

    if (!llmRes.ok) {
      const errText = await llmRes.text();
      throw new Error(errText || "LLM request failed");
    }

    const llmData = await llmRes.json();
    removeThinking();

    addMessage(
      llmData.out || "⚠️ Gemini returned empty response",
      "system"
    );

  } catch (llmErr) {
    removeThinking();
    addMessage(
      "⚠️ Gemini reply failed (check backend logs)",
      "system"
    );
    console.error("LLM error:", llmErr);
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
