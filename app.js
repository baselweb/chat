document.addEventListener("DOMContentLoaded", () => {
  // Detects the user's system theme preference (light or dark)
  function detectSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  // Applies the selected theme to the website
  function applyTheme(theme) {
    const elementsToUpdate = [
      document.body,
      document.querySelector('.header'),
      document.querySelector('#typing-indicator'),
      document.querySelector('#logout-button'),
      document.querySelector('#go-back'),
      document.querySelector('.container'),
      document.querySelector('.messages'),
      document.querySelector('.input-area'),
      ...document.querySelectorAll('.login-register'),
      ...document.querySelectorAll('.message')
    ];

    elementsToUpdate.forEach(element => {
      if (element) {
        if (theme === 'dark') {
          element.classList.add('dark-theme');
        } else {
          element.classList.remove('dark-theme');
        }
      }
    });

    const themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
    if (themeColorMetaTag) {
      if (theme === 'dark') {
        themeColorMetaTag.setAttribute('content', '#121212');
      } else {
        themeColorMetaTag.setAttribute('content', '#ffffff');
      }
    }

    localStorage.setItem("theme", theme);
  }

  function initializeTheme() {
    const savedTheme = localStorage.getItem("theme");
    const theme = savedTheme || detectSystemTheme();
    applyTheme(theme);
  }

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    const theme = e.matches ? "dark" : "light";
    applyTheme(theme);
  });

  initializeTheme();
});

import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAC49cgzmUZjqRM1akkEJmIOLz_NKBCC5k",
  authDomain: "adiasta-686e4.firebaseapp.com",
  databaseURL: "https://adiasta-686e4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "adiasta-686e4",
  storageBucket: "adiasta-686e4.appspot.com",
  messagingSenderId: "822931467224",
  appId: "1:822931467224:web:46f81b5779491efe6260ad",
  measurementId: "G-68996BGLFE",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();

const authContainer = document.getElementById("auth");
const roomSelection = document.getElementById("room-selection");
const chatContainer = document.getElementById("chat");
const loginButton = document.getElementById("login");
const registerButton = document.getElementById("register");
const joinRoomButton = document.getElementById("join-room");
const createRoomButton = document.getElementById("create-room");
const roomNameInput = document.getElementById("room-name");
const authError = document.getElementById("auth-error");
const roomError = document.getElementById("room-error");
const messagesDiv = document.getElementById("message-list");
const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");
const userList = document.getElementById("user-list");
const goBackButton = document.getElementById("go-back");

let currentRoom = null;
let currentUsername = null;
let privateChatWith = null;

const savedUser = localStorage.getItem("loggedInUser");
const logoutButton = document.createElement("button");
logoutButton.textContent = "Logout";
logoutButton.id = "logout-button";
logoutButton.addEventListener("click", () => {
  signOut(auth).then(() => {
    localStorage.removeItem("loggedInUser");
    location.reload();
  });
});

function appendLogoutButton() {
  document.body.appendChild(logoutButton);
}

if (savedUser) {
  const { uid, username } = JSON.parse(savedUser);
  currentUsername = username;
  showRoomSelection();
  appendLogoutButton();
}

function displayError(element, message) {
  element.textContent = message;
  element.style.color = "red";
  setTimeout(() => (element.textContent = ""), 3000);
}

function showRoomSelection() {
  authContainer.style.display = "none";
  roomSelection.style.display = "block";
}

function showChat() {
  roomSelection.style.display = "none";
  chatContainer.style.display = "flex";
  const usersHeader = document.querySelector(".header h3");
  usersHeader.textContent = currentRoom;
  loadMessages();
  loadUsers();
  loadTypingIndicator();
  goBackButton.style.display = "inline-block"; // Show Go Back button
}

loginButton.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      currentUsername = user.email.split("@")[0];
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ uid: user.uid, username: currentUsername })
      );
      showRoomSelection();
      appendLogoutButton();
    })
    .catch((error) => displayError(authError, error.message));
});

registerButton.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      currentUsername = user.email.split("@")[0];
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ uid: user.uid, username: currentUsername })
      );
      showRoomSelection();
      appendLogoutButton();
    })
    .catch((error) => displayError(authError, error.message));
});

function joinOrCreateRoom(action) {
  const roomName = roomNameInput.value.trim();
  if (roomName) {
    currentRoom = roomName;
    const roomRef = ref(database, `rooms/${roomName}`);
    if (action === "create") {
      set(roomRef, { createdAt: Date.now() }).then(() => showChat());
    } else {
      onValue(roomRef, (snapshot) => {
        if (snapshot.exists()) {
          showChat();
        } else {
          displayError(roomError, "Room does not exist. Try creating it.");
        }
      });
    }
  } else {
    displayError(roomError, "Room name cannot be empty.");
  }
}

joinRoomButton.addEventListener("click", () => joinOrCreateRoom("join"));
createRoomButton.addEventListener("click", () => joinOrCreateRoom("create"));

function loadMessages() {
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
      autoScrollToBottom(); // Ensure auto-scrolling
    }
  });
}

function autoScrollToBottom() {
  const messagesDiv = document.getElementById("message-list");
  if (messagesDiv) {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
}

function loadUsers() {
  const usersRef = ref(database, `rooms/${currentRoom}/users`);
  onValue(usersRef, (snapshot) => {
    userList.innerHTML = "";
    const users = snapshot.val();
    if (users) {
      for (let user in users) {
        const userDiv = document.createElement("div");
        userDiv.textContent = user;
        userList.appendChild(userDiv);
      }
    }
  });
}

function loadTypingIndicator() {
  const typingIndicatorRef = ref(database, `rooms/${currentRoom}/typing`);
  onValue(typingIndicatorRef, (snapshot) => {
    const typingData = snapshot.val();
    const isTyping = typingData && typingData[currentUsername];
    document.getElementById("typing-indicator").style.display = isTyping ? "block" : "none";
  });
}

messageInput.addEventListener("input", () => {
  if (currentRoom) {
    const typingRef = ref(database, `rooms/${currentRoom}/typing`);
    set(typingRef, { [currentUsername]: true });

    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      set(typingRef, { [currentUsername]: false });
    }, 3000);
  }
});

sendButton.addEventListener("click", () => {
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
      loadMessages(); // Reload messages
    });
  }
});

goBackButton.addEventListener("click", () => {
  currentRoom = null;
  showRoomSelection();
  goBackButton.style.display = "none"; // Hide Go Back button
});
