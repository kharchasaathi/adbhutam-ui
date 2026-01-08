import "./index.js";

/**
 * UI Layer
 * --------
 * - Renders user + system messages
 * - NO logic
 * - NO pipeline
 */

const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");

function addMessage(text, cls) {
  const wrap = document.createElement("div");
  wrap.className = "msg " + cls;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  wrap.appendChild(bubble);
  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
}

/**
 * Hook pipeline output safely
 */
window.renderOutput = function (data) {
  addMessage(JSON.stringify(data, null, 2), "system");
};

/**
 * Send user input
 */
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  // Trigger pipeline (simulate Enter)
  const evt = new KeyboardEvent("keydown", { key: "Enter" });
  input.dispatchEvent(evt);
}

send.onclick = sendMessage;

input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
