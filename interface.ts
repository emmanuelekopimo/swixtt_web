const actionButton: HTMLButtonElement =
  document.querySelector(".action-button")!;
const optionModal: HTMLDivElement = document.querySelector(".option-modal")!;
const transCover: HTMLDivElement = document.querySelector(".trans-cover")!;

actionButton.addEventListener("click", (event) => {
  if (!actionButton.classList.contains("active")) {
    optionModal.classList.toggle("hide", false);
    actionButton.classList.toggle("active", true);
    transCover.classList.toggle("active", true);
  } else {
    optionModal.classList.toggle("hide", true);
    actionButton.classList.toggle("active", false);
    transCover.classList.toggle("active", false);
  }
});

transCover.addEventListener("click", (event) => {
  optionModal.classList.toggle("hide", true);
  actionButton.classList.toggle("active", false);
  transCover.classList.toggle("active", false);
});
// document.addEventListener("touchstart", (e) => {
//   if (optionModal != e.target) {
//     optionModal.classList.toggle("hide", true);
//     actionButton.classList.toggle("active", false);
//   }
//   if (actionButton == e.target) {
//     optionModal.classList.toggle("hide", false);
//     actionButton.classList.toggle("active", true);
//   }
//   if (actionButton.classList.contains("active")) {
//     optionModal.classList.toggle("hide", true);
//     actionButton.classList.toggle("active", false);
//   }
// });
