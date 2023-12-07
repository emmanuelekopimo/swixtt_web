import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Site start
const emailBox = document.querySelector(".email-box");
const passwordBox = document.querySelector(".pass-box");
const smallButton = document.querySelector(".small-button");

const signUp = () => {
  let email = emailBox.value;
  let password = passwordBox.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log(user);
      // ...
      sendEmailVerification(auth.currentUser).then(() => {
        // Email verification sent!
        // ...
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
};

smallButton.addEventListener("click", signUp);
