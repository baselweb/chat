import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

export function loadTypingIndicator(currentRoom, currentUsername) {
  const typingIndicatorRef = ref(database, `rooms/${currentRoom}/typing`);
  onValue(typingIndicatorRef, (snapshot) => {
    const typingData = snapshot.val();
    const isTyping = typingData && typingData[currentUsername];
    document.getElementById("typing-indicator").style.display = isTyping ? "block" : "none";
  });
}

export function updateTypingStatus(currentRoom, currentUsername) {
  const typingRef = ref(database, `rooms/${currentRoom}/typing`);
  set(typingRef, { [currentUsername]: true });

  clearTimeout(window.typingTimeout);
  window.typingTimeout = setTimeout(() => {
    set(typingRef, { [currentUsername]: false });
  }, 3000);
}
