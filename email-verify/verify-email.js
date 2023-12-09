import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import {
  getAuth,
  sendEmailVerification,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBu5o6QgRZWtG7CPsREmTJ7YNf0lD0gg7A",
  authDomain: "swxitt-x.firebaseapp.com",
  projectId: "swxitt-x",
  storageBucket: "swxitt-x.appspot.com",
  messagingSenderId: "136667624581",
  appId: "1:136667624581:web:0529be08bb7531972065ec",
  measurementId: "G-1J12EFBLKZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

//Site Start
const resendLink = document.querySelector(".resend");
const waitText = document.querySelector(".wait");
const resentText = document.querySelector(".tagline");
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    // ...
    setTimeout(() => {
      resendLink.classList.toggle("hide", false);
      waitText.classList.toggle("hide", true);
      resentText.classList.toggle("hide", true);
    }, 6000);
  } else {
    // User is signed out
    // ...
    location.href = "./../login";
  }
});

resendLink.addEventListener("click", (event) => {
  // Send email verification
  sendEmailVerification(auth.currentUser, {
    url: "https://swixtt.netlify.app/login",
  }).then(() => {
    // Email verification sent!
    console.log("Verification email sent");
    resentText.classList.toggle("hide", false);
    resendLink.classList.toggle("hide", true);
    waitText.classList.toggle("hide", false);
    setTimeout(() => {
      resendLink.classList.toggle("hide", false);
      waitText.classList.toggle("hide", true);
      resentText.classList.toggle("hide", true);
    }, 10000);
  });
});
