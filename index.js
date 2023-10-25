const drawArea = document.querySelector(".draw-area");

fetch("./data.json")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    // Structure the data
    let id = data.id;
    let name = data.name;
    let cards = data.cards;
    let updates = data.updates;
    console.log(id, name);

    //cards
    let hRatio = 17;
    cards.forEach((card, index) => {
      let start = (card.start[0] - 6) * 60 + card.start[1];
      let end = (card.end[0] - 6) * 60 + card.end[1];
      let left = (start / 60) * 100;
      let width = (end / 60) * 100 - left;
      let top = card.day * hRatio + hRatio;
      let height = hRatio;

      let element = document.createElement("div");
      element.classList.add("class-card");
      element.style.top = top.toString() + "%";
      element.style.left = left.toString() + "px";
      element.style.width = width.toString() + "px";
      element.style.height = height.toString() + "%";
      let content = `<span class="card-title">${card.code}</span>
                    <br>
                    <span class="card-location">${card.location}</span> `;

      element.innerHTML = content;
      drawArea.append(element);
    });
  });
