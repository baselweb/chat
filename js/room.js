import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const database = getDatabase();

export function joinOrCreateRoom(roomName, action, showChat, displayError) {
  if (roomName) {
    const roomRef = ref(database, `rooms/${roomName}`);
    if (action === "create") {
      set(roomRef, { createdAt: Date.now() }).then(() => showChat());
    } else {
      onValue(roomRef, (snapshot) => {
        if (snapshot.exists()) {
          showChat();
        } else {
          displayError("Room does not exist. Try creating it.");
        }
      });
    }
  } else {
    displayError("Room name cannot be empty.");
  }
}
