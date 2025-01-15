import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

export function loadUsers(currentRoom, userList) {
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
