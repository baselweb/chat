import { initializeTheme } from 'js/theme.js';
import { loginUser, registerUser, logoutUser } from 'js/auth.js';
import { joinOrCreateRoom } from 'js/room.js';
import { loadMessages, sendMessage } from 'js/messages.js';
import { loadUsers } from 'js/users.js';
import { loadTypingIndicator, updateTypingStatus } from 'js/typing.js';

document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();

  const loginButton = document.getElementById("login");
  const registerButton = document.getElementById("register");
  const joinRoomButton = document.getElementById("join-room");
  const createRoomButton = document.getElementById("create-room");
  const sendButton = document.getElementById("send-button");
  const messageInput = document.getElementById("message-input");
  const roomNameInput = document.getElementById("room-name");
  const logoutButton = document.getElementById("logout-button");
  
  let currentRoom = null;
  let currentUsername = null;

  loginButton.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    loginUser(email, password, displayError, appendLogoutButton);
  });

  registerButton.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    registerUser(email, password, displayError, appendLogoutButton);
  });

  joinRoomButton.addEventListener("click", () => {
    joinOrCreateRoom(roomNameInput.value, 'join', showChat, displayError);
  });

  createRoomButton.addEventListener("click", () => {
    joinOrCreateRoom(roomNameInput.value, 'create', showChat, displayError);
  });

  sendButton.addEventListener("click", () => {
    sendMessage(currentRoom, currentUsername, messageInput);
  });

  messageInput.addEventListener("input", () => {
    updateTypingStatus(currentRoom, currentUsername);
  });

  function showChat() {
  }

  function displayError(message) {
  }

  function appendLogoutButton() {
  }
});
