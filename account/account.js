import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getTwoLettersFromName } from "./../functions.js";

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

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Site start
const userName = document.querySelector(".bottom-text");
const verifiedLogo = document.querySelector(".verified");
const waitScreen = document.querySelector(".wait-screen");
const timeTableList = document.querySelector(".tt-list");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    loadPage(user);
  } else {
    // User is signed out
    // Send user to log in screen
    location.href = "./../login";
  }
});

const loadPage = async (user) => {
  // Resolve owner id into name
  console.log(user);
  let userRef = doc(db, "users", user.uid);
  let userObject = await getDoc(userRef);
  let userData = userObject.data();
  console.log(userData);
  userName.innerText = userData.name;

  if (userData.verified) {
    verifiedLogo.classList.toggle("hide", false);
  }
  let timeTables = userData.timetables;
  timeTables.forEach(async (timeTableId) => {
    let ttRef = doc(db, "timetables", timeTableId);
    let ttObject = await getDoc(ttRef);
    let ttData = ttObject.data();

    let timeTableCardTemplate = `<div class="tt-card">
          <div class="tt-i">
              <div class="tt-icon">

                  <div class="tt-icon-i">
                      ${getTwoLettersFromName(ttData.name)}
                  </div>
              </div>
              <div class="tt-name">${ttData.name}</div>
              <div class="tt-date">${ttData.school}</div>
          </div>
          <div class="tt-ops">
              <button title="Edit" class="op-button" onclick="location.href='./../edit/?t=${
                ttData.id
              }'">Edit</button>
              <button title="View" class="op-button" onclick="location.href='./../view/?t=${
                ttData.id
              }'">View</button>
              <button title="Share" class="op-button">Share</button>
              <button title="Delete" class="op-button">Delete</button>
          </div>
        </div>`;
    let element = document.createElement("div");
    element.innerHTML = timeTableCardTemplate;
    timeTableList.append(element);
  });

  // Remove wait screen
  waitScreen.classList.toggle("hide", true);
};
