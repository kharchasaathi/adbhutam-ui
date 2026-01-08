import "./index.js";

const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const chat = document.getElementById("chat");

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

sendBtn.onclick = () => {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  addMessage("Thinking…", "system");

  setTimeout(() => {
    const result = window.runAdbhutam(text);
    chat.lastChild.remove(); // remove Thinking…
    addMessage(JSON.stringify(result, null, 2), "system");
  }, 10);
};

input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});
