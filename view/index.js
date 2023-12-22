import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import {
  getFirestore,
  doc,
  getDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

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

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Site start
// Elements
const drawArea = document.querySelector(".draw-area");
const updatesButton = document.querySelector(".updates-button");
const modal = document.querySelector(".modal");
const updateBar = document.querySelector(".update-bar");
const modalCover = document.querySelector(".modal-cover");
const updatesArea = document.querySelector(".updates-area");
const bubble = document.querySelector(".bubble");
const onGoing = document.querySelector(".on-going");
const textMinor = document.querySelector(".text-minor");
const textMajor = document.querySelector(".text-major");
const textDetails = document.querySelector(".text-details");
const daysPanel = document.querySelectorAll("tbody>tr");
const tableName = document.querySelector(".table-name");
const tagLine = document.querySelector(".tagline");
const daysSat = document.querySelector(".day-saturday");
const waitScreen = document.querySelector(".wait-screen");

// Days is not the same as Javascript day counting
// Possible school days
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

var urlParams = new URLSearchParams(window.location.search);
var tableID = urlParams.get("t"); // Table ID
const serverUrl = "https://swixtt.cyclic.app";
// const serverUrl = "http://127.0.0.1:3000";

const updateInfo = () => {
  const docRef = doc(db, "timetables", tableID);
  getDoc(docRef)
    .then(async (docSnap) => {
      if (docSnap.exists()) {
        console.log(docSnap.data());
        let data = docSnap.data();
        let customDateStr = "Dec 9 2023 7:00:00 ";
        var today = new Date();
        let id = data.id; // Database id
        let name = data.name; // Time table name
        let school = data.school; // School/ University
        let year = data.year; // Entry year
        let cards = data.cards; // lecture cards
        let updates = data.updates; // time table updates
        let holiday = data.holiday; // holiday (boolean)
        let holiday_type = data.holiday_type; // type of holiday
        let saturday = data.saturday; // Saturday classes
        let owner = data.owner;

        // Resolve owner id into name
        let ownerRef = doc(db, "users", owner);
        let ownerObject = await getDoc(ownerRef);
        let ownerData = ownerObject.data();
        let ownerName = ownerData.name;
        let ownerVerified = ownerData.verified;

        //Update time table header
        tableName.innerText = name;
        tagLine.innerText = year + " • " + school;

        // Set up draw area
        drawArea.innerHTML = `
          
        <div class="start-pin">
        <span class="space"></span>6<br>
        <span class="space"></span>AM
        </div>
        <div class="static-pin" style="left:100px">
            <span class="space"></span>7<br>
            <span class="space"></span>AM
        </div>
        <div class="static-pin" style="left:200px">
            <span class="space"></span>8<br>
            <span class="space"></span>AM
        </div>
        <div class="static-pin" style="left:300px">
            <span class="space"></span>9<br>
            <span class="space"></span>AM
        </div>
        <div class="static-pin" style="left:400px">
            <span class="space"></span>10<br>
            <span class="space"></span>AM
        </div>
        <div class="static-pin" style="left:500px">
            <span class="space"></span>11<br>
            <span class="space"></span>AM
        </div>
        <div class="static-pin" style="left:600px">
            <span class="space"></span>12<br>
            <span class="space"></span>PM
        </div>
        <div class="static-pin" style="left:700px">
            <span class="space"></span>1<br>
            <span class="space"></span>PM
        </div>
        <div class="static-pin" style="left:800px">
            <span class="space"></span>2<br>
            <span class="space"></span>PM
        </div>
        <div class="static-pin" style="left:900px">
            <span class="space"></span>3<br>
            <span class="space"></span>PM
        </div>
        <div class="static-pin" style="left:1000px">
            <span class="space"></span>4<br>
            <span class="space"></span>PM
        </div>
        <div class="static-pin" style="left:1100px">
            <span class="space"></span>5<br>
            <span class="space"></span>PM
        </div>
        <div class="end-pin">
            <span class="space"></span>6<br>
            <span class="space"></span>PM
        </div>
        <div class="time-bar">
  
        </div>
        `;

        // Add time mark
        let todayLeft =
          (((today.getHours() - 6) * 60 + today.getMinutes()) / 60) * 100;
        if (todayLeft > 0 && todayLeft < 1200) {
          let timeElement = document.createElement("div");
          timeElement.classList.add("time-mark");
          timeElement.style.top = "0px";
          timeElement.style.left = todayLeft.toString() + "px";
          timeElement.style.width = "4px";
          timeElement.style.height = "10px";
          drawArea.append(timeElement);
        }
        // Add day mark
        for (let index = 0; index < daysPanel.length; index++) {
          if (index > 0) {
            if (today.getDay() == index) {
              daysPanel[index].classList.toggle("today-day", true);
            }
          }
        }

        // Sort the cards according to time they are scheduled for
        // Forget the funny variable naming. Just to help me get it right
        cards.sort((bigCard, smallCard) => {
          let bigPower = Number(
            bigCard.day.toString() +
              bigCard.start[0].toString().padStart(2, "0")
          );
          let smallPower = Number(
            smallCard.day.toString() +
              smallCard.start[0].toString().padStart(2, "0")
          );
          return bigPower - smallPower;
        });
        console.log(cards);
        let rows = 6;
        let hRatio = 17;
        if (saturday) {
          //cards
          rows = 7;
          hRatio = 14.28571428;
        } else {
          daysSat.classList.toggle("hide", true);
        }
        `No lecture going on now. Read your books in anticipation for the next lectures`;
        onGoing.innerHTML = `No lecture going on now. Read your books in anticipation for the next lectures`;
        // For each card
        cards.forEach((card) => {
          let start = (card.start[0] - 6) * 60 + card.start[1];
          let end = (card.end[0] - 6) * 60 + card.end[1];
          let left = (start / 60) * 100;
          let width = (end / 60) * 100 - left;
          let top = card.day * hRatio + hRatio;
          let height = hRatio;
          if (saturday) {
            top += 1;
          }

          let element = document.createElement("div");
          element.classList.add("class-card");
          if (!card.active) {
            element.classList.add("not-hold");
          }
          element.style.top = top.toString() + "%";
          element.style.left = left.toString() + "px";
          element.style.width = width.toString() + "px";
          element.style.height = height.toString() + "%";
          let content = `<span class="card-title">${card.code}</span>
                      <br>
                      <span class="card-location">${card.location}</span> `;

          // Checking class that is going on now
          if (card.day == today.getDay() - 1 && card.active && !holiday) {
            let start_minute = card.start[0] * 60 + card.start[1];
            let end_minute = card.end[0] * 60 + card.end[1];
            let now_minute = today.getHours() * 60 + today.getMinutes();

            if (now_minute >= start_minute && now_minute < end_minute) {
              // That class is going on
              onGoing.innerHTML = `<b>Ongoing:</b> ${card.code} @ ${card.location}`;

              element.classList.toggle("now", true);
              onGoing.classList.toggle("hide", false);
            }
          }
          if (saturday) {
            element.classList.add("mini");
          }

          //Finally add the card element to the drawArea
          element.innerHTML = content;
          drawArea.append(element);
        });

        let nextClassNextWeek = true;

        for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
          let card = cards[cardIndex];
          let start_minute = card.start[0] * 60 + card.start[1];
          let now_minute = today.getHours() * 60 + today.getMinutes();
          //One day or public holiday
          if (holiday && holiday_type == "one-day") {
            if (card.day > today.getDay() - 1 && card.active) {
              // That is the next class
              nextClassNextWeek = false;
              textMajor.innerText = card.code;
              textDetails.innerText = card.location;
              onGoing.innerHTML = `<b>Swixtt:</b><br>Enjoy your holiday`;
              if (card.day == today.getDay() - 1) {
                let intervalMins = start_minute - now_minute;
                let cardDate = new Date();
                cardDate.setHours(0, 0, 0);
                cardDate.setMinutes(intervalMins);
                let nextHours = cardDate.getHours();
                let nextMinutes = cardDate.getMinutes();
                let minuteStr = "";
                if (nextMinutes > 0) {
                  minuteStr = `${cardDate.getMinutes()} minute${
                    nextMinutes > 1 ? "s" : ""
                  }`;
                }
                if (nextHours >= 1) {
                  textMinor.innerHTML = `Next lecture in <b>${nextHours} hour${
                    nextHours > 1 ? "s" : ""
                  } ${minuteStr}</b>`;
                } else {
                  textMinor.innerHTML = `Next lecture in <b>${minuteStr}</b>`;
                }
              } else {
                let day = days[card.day];
                if (card.day - (today.getDay() - 1) == 1) {
                  textMinor.innerHTML = `First lecture <b>tomorrow</b>`;
                } else {
                  textMinor.innerHTML = `First lecture on <b>${day}</b>`;
                }
              }
              break;
            }
            break;
          }

          //Holiday is more than one week or a break or strike
          else if (holiday && holiday_type == "break") {
            nextClassNextWeek = false;
            let cCode = cards[0].code;
            let cLocation = cards[0].location;
            for (let i = 0; i < cards.length; i++) {
              let card = cards[i];
              if (card.active) {
                cCode = cards[i].code;
                cLocation = cards[i].location;
                break;
              }
            }
            textMajor.innerText = cCode;
            textDetails.innerText = cLocation;
            textMinor.innerHTML = `First lecture <b>on resumption</b>`;
            onGoing.innerHTML = `<b>Swixtt:</b><br>Enjoy your break`;
          }
          // No holiday or break
          else {
            if (card.day >= today.getDay() - 1 && card.active) {
              // That is the next class

              if (card.day == today.getDay() - 1 && start_minute > now_minute) {
                nextClassNextWeek = false;
                textMajor.innerText = card.code;
                textDetails.innerText = card.location;
                let intervalMins = start_minute - now_minute;
                console.log(intervalMins);
                let cardDate = new Date();
                cardDate.setHours(0, 0, 0);
                cardDate.setMinutes(intervalMins);
                let nextHours = cardDate.getHours();
                let nextMinutes = cardDate.getMinutes();

                let minuteStr = "";
                if (nextMinutes > 0) {
                  minuteStr = `${cardDate.getMinutes()} minute${
                    nextMinutes > 1 ? "s" : ""
                  }`;
                }
                if (nextHours >= 1) {
                  textMinor.innerHTML = `Next lecture in <b>${nextHours} hour${
                    nextHours > 1 ? "s" : ""
                  } ${minuteStr}</b>`;
                } else {
                  textMinor.innerHTML = `Next lecture in <b>${minuteStr}</b>`;
                }
                break;
              } else if (card.day > today.getDay() - 1) {
                nextClassNextWeek = false;
                if (card.day - (today.getDay() - 1) == 1) {
                  textMajor.innerText = card.code;
                  textDetails.innerText = card.location;
                  textMinor.innerHTML = `First lecture <b>tomorrow</b>`;
                  break;
                } else {
                  textMajor.innerText = card.code;
                  textDetails.innerText = card.location;
                  let day = days[card.day];
                  textMinor.innerHTML = `First lecture on <b>${day}</b>`;
                  break;
                }
              }
            }
          }
        }

        // If the next class is next week
        if (nextClassNextWeek) {
          let cCode = cards[0].code;
          let cLocation = cards[0].location;
          for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            if (card.active) {
              cCode = cards[i].code;
              cLocation = cards[i].location;
              break;
            }
          }
          textMajor.innerText = cCode;
          textDetails.innerText = cLocation;
          textMinor.innerHTML = `First lecture <b>next week</b>`;
          if (today.getDay() - 1 >= 5) {
            onGoing.innerHTML = `<b>SwixttBot:</b><br>Enjoy your weekend`;
          }
        }
        //updates

        bubble.innerText = updates.length + 1;
        updatesArea.innerHTML = "";
        updates.forEach((update) => {
          let created = new Timestamp(
            update.created.seconds,
            update.created.nanoseconds
          )
            .toDate()
            .toLocaleDateString();
          let text = update.content;
          let target_card_id = update.target;
          var course_code = "";
          var course_day = "";
          cards.forEach((card) => {
            if (card.id == target_card_id) {
              course_code = card.code;
              course_day = "• " + days[card.day];
            }
          });
          let element = document.createElement("div");
          element.classList.add("update");
          let content = `<div class="update-title">${created}: ${course_code}  ${course_day}</div>${text}`;
          element.innerHTML = content;
          updatesArea.append(element);
        });
        let updateElement = document.createElement("div");
        updateElement.classList.add("update");
        updateElement.classList.add("system-update");
        let updateContent = `<div class="update-title">${today.toLocaleDateString()}: Swixtt • Today</div>
      All updates for the timetable are shown here. This time table is managed by <b>${ownerName}</b> <img src="./../res/icons/verified-.png" alt="Verified Account" class="verified hide">. Thank you for using Swixtt`;
        updateElement.innerHTML = updateContent;
        updatesArea.append(updateElement);
        //hide class verified if user is not verified
        if (ownerVerified) {
          let verifiedIcons = document.querySelectorAll(".verified");
          verifiedIcons.forEach((icon) => {
            icon.classList.remove("hide");
          });
        }
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // ..
    });

  // else if (d.type == "PRIVATE") {
  //   // In a case where the owner set it to private
  //   window.location.href = `./../error?e=private?t=${tableID}`;
  // } else if (d.type == "DELETED") {
  //   // Time table was deleted
  //   window.location.href = `./../error?e=deleted?t=${tableID}`;
  // } else if (d.type == "NOT-FOUND") {
  //   // Time table not found on the server
  //   window.location.href = `./../error?e=not-found?t=${tableID}`;
  // } else {
  //   // The error is not specified by server
  //   window.location.href = `./../error?e=unknown?t=${tableID}`;
  // }
  // TODO: Move waitscreen to the appropaite place
  // Remove wait screen
  waitScreen.classList.toggle("hide", true);
};

updatesButton.addEventListener("click", () => {
  modal.classList.toggle("hide", false);
  modalCover.classList.toggle("hide", false);
});
updateBar.addEventListener("click", () => {
  modal.classList.toggle("hide", true);
  modalCover.classList.toggle("hide", true);
});
modalCover.addEventListener("click", () => {
  modal.classList.toggle("hide", true);
  modalCover.classList.toggle("hide", true);
});

updateInfo();
setInterval(updateInfo, 15000);
