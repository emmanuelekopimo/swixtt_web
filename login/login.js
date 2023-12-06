import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyBM8oDdRAye1lkB2OKyaz5I4QnzVnxrFb8",
  authDomain: "swixtt.firebaseapp.com",
  databaseURL: "https://swixtt-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "swixtt",
  storageBucket: "swixtt.appspot.com",
  messagingSenderId: "440156692325",
  appId: "1:440156692325:web:299e5dc817b6ee8ec38b8c",
  measurementId: "G-4GPEMZ0PQG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Site start
const emailBox = document.querySelector(".email-box");
const passwordBox = document.querySelector(".pass-box");
const smallButton = document.querySelector(".small-button");

const logIn = () => {
  let email = emailBox.value;
  let password = passwordBox.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
};

smallButton.addEventListener("click", logIn);
