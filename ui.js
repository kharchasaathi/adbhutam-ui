/**
 * UI Layer (ChatGPT-style)
 * ------------------------
 * - Rendering only
 * - Talks to Cloud Brain via HTTP
 */

const API_BASE = "https://adbhutam-cloud-brain.up.railway.app";

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

function showThinking() {
  thinkingBubble = addMessage("Thinking…", "system");
}

function removeThinking() {
  if (thinkingBubble) {
    thinkingBubble.remove();
    thinkingBubble = null;
  }
}

/* ---------------- Main send logic ---------------- */

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";
  showThinking();

  try {
    const res = await fetch(`${API_BASE}/brain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    removeThinking();

    const reply =
      data?.result?.decision?.status
        ? JSON.stringify(data.result, null, 2)
        : "No response";

    addMessage(reply, "system");

  } catch (err) {
    removeThinking();
    addMessage("⚠️ Server error. Please try again.", "system");
    console.error(err);
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
