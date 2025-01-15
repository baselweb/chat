import { ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

export function loadMessages(currentRoom, messagesDiv) {
  const messagesRef = ref(database, `rooms/${currentRoom}/messages`);
  messagesDiv.innerHTML = "";

  onValue(messagesRef, (snapshot) => {
    const messages = snapshot.val();
    if (messages) {
      messagesDiv.innerHTML = "";
      for (let id in messages) {
        const message = messages[id];
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.classList.add(message.username === currentUsername ? "sent" : "received");
        messageDiv.id = `message-${id}`;
        messageDiv.innerHTML = `
          <strong>${message.username}:</strong> ${message.text}
          <div style="font-size: 0.8em; color: gray;">${new Date(message.timestamp).toLocaleTimeString()}</div>
        `;
        messagesDiv.appendChild(messageDiv);
      }
      autoScrollToBottom();
    }
  });
}

export function sendMessage(currentRoom, currentUsername, messageInput) {
  const messageText = messageInput.value.trim();
  if (messageText && currentRoom) {
    const messagesRef = ref(database, `rooms/${currentRoom}/messages`);
    const newMessageRef = push(messagesRef);
    set(newMessageRef, {
      username: currentUsername,
      text: messageText,
      timestamp: Date.now(),
    }).then(() => {
      messageInput.value = "";
    });
  }
}

export function autoScrollToBottom() {
  const messagesDiv = document.getElementById("message-list");
  if (messagesDiv) {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
}
