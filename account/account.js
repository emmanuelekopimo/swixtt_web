import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
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

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Site start
const user = auth.currentUser;

if (user) {
  console.log(user);
  // User is signed in, see docs for a list of available properties
  // https://firebase.google.com/docs/reference/js/auth.user
  // ...
} else {
  console.log(user);
  // No user is signed in.
}
