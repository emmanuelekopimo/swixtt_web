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

// Day is not the same as Javascript day counting
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

var urlParams = new URLSearchParams(window.location.search);
var tableID = urlParams.get("t"); // Table ID

fetch(`https://swixtt.cyclic.app/view?t=${tableID}`)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    // Structure the data
    let customDateStr = "Nov 4 2023 9:38:00 ";
    var today = new Date();
    let id = data.id;
    let name = data.name;
    let cards = data.cards;
    let updates = data.updates;
    let holiday = data.holiday;
    let holiday_type = data.holiday_type;
    console.log(id, name);
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
    for (index = 0; index < daysPanel.length; index++) {
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
        bigCard.day.toString() + bigCard.start[0].toString()
      );
      let smallPower = Number(
        smallCard.day.toString() + smallCard.start[0].toString()
      );
      return bigPower - smallPower;
    });

    //cards
    let hRatio = 17;
    onGoing.innerHTML = `Dear werey, no class is ongoing. Read your books. Now wey you get time 🙂`;
    // For each card
    cards.forEach((card) => {
      let start = (card.start[0] - 6) * 60 + card.start[1];
      let end = (card.end[0] - 6) * 60 + card.end[1];
      let left = (start / 60) * 100;
      let width = (end / 60) * 100 - left;
      let top = card.day * hRatio + hRatio;
      let height = hRatio;

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

        if (now_minute > start_minute && now_minute < end_minute) {
          // That class is going on
          onGoing.innerHTML = `<b>Ongoing:</b> ${card.code} @ ${card.location}`;

          element.classList.toggle("now", true);
          onGoing.classList.toggle("hide", false);
        }
      }

      //Finally add the card element to the drawArea
      element.innerHTML = content;
      drawArea.append(element);
    });

    let nextClassNextWeek = true;

    for (cardIndex = 0; cardIndex < cards.length; cardIndex++) {
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
        for (i = 0; i < cards.length; i++) {
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
      // No holiday or break 🥺😒
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
          } else {
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
      for (i = 0; i < cards.length; i++) {
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
      if (today.getDay() - 1 == 4) {
        onGoing.innerHTML = `<b>Swixtt:</b><br>Enjoy your weekend`;
      }
    }
    //updates

    bubble.innerText = updates.length + 1;

    updates.forEach((update) => {
      let created = update.created;
      let text = update.content;
      let target_card_id = update.target_card_id;
      var course_code = "";
      var course_day = "";
      cards.forEach((card) => {
        if (card.id == target_card_id) {
          course_code = card.code;
          course_day = days[card.day];
        }
      });
      let element = document.createElement("div");
      element.classList.add("update");
      let content = `<div class="update-title">${created}: ${course_code} • ${course_day}</div>${text}`;
      element.innerHTML = content;
      updatesArea.append(element);
    });
    let updateElement = document.createElement("div");
    updateElement.classList.add("update");
    updateElement.classList.add("system-update");
    let updateContent = `<div class="update-title">${today.toLocaleDateString()}: Swixtt • Today</div>
    All updates and information about the timetable are shown here. This time table is managed by <b>${
      data.username
    }</b>. Thank you for using Swixtt`;
    updateElement.innerHTML = updateContent;
    updatesArea.append(updateElement);
  });

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
