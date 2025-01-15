import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const auth = getAuth();

export function loginUser(email, password, displayError, appendLogoutButton) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const currentUsername = user.email.split("@")[0];
      localStorage.setItem("loggedInUser", JSON.stringify({ uid: user.uid, username: currentUsername }));
      appendLogoutButton();
    })
    .catch((error) => displayError(error.message));
}

export function registerUser(email, password, displayError, appendLogoutButton) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const currentUsername = user.email.split("@")[0];
      localStorage.setItem("loggedInUser", JSON.stringify({ uid: user.uid, username: currentUsername }));
      appendLogoutButton();
    })
    .catch((error) => displayError(error.message));
}

export function logoutUser() {
  signOut(auth).then(() => {
    localStorage.removeItem("loggedInUser");
    location.reload();
  });
}
