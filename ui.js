import "./index.js";

/**
 * UI Layer (ChatGPT-style)
 * ------------------------
 * - Handles rendering only
 * - NO pipeline logic
 * - Talks to Brain via window.runAdbhutam()
 */

const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

let thinkingBubble = null;

/**
 * Render message bubble
 */
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

/**
 * Show "Thinking…" indicator
 */
function showThinking() {
  thinkingBubble = addMessage("Thinking…", "system");
}

/**
 * Remove thinking bubble safely
 */
function removeThinking() {
  if (thinkingBubble) {
    thinkingBubble.remove();
    thinkingBubble = null;
  }
}

/**
 * Handle send
 */
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // User message
  addMessage(text, "user");
  input.value = "";

  // System thinking
  showThinking();

  // Small async gap (feels natural, avoids UI freeze)
  setTimeout(() => {
    const result = window.runAdbhutam(text);

    removeThinking();

    // Fallback safety
    const reply =
      result?.reply ||
      "Something went wrong. Please try again.";

    addMessage(reply, "system");

    // 🔍 Optional dev debug (comment out in prod)
    // console.debug("Adbhutam debug:", result);

  }, 20);
}

/**
 * Events
 */
sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
