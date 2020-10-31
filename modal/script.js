"use strict";

const showButtons = document.querySelectorAll(".show-modal");
const hiddenEls = document.querySelectorAll(".hidden");
const closeButton = document.querySelector(".close-modal");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");

// EVENT LISTENERS

showButtons.forEach((button) => button.addEventListener("click", showModal));

closeButton.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

// FUNCTIONS

function showModal() {
  hiddenEls.forEach((el) => el.classList.remove("hidden"));
}

function closeModal() {
  hiddenEls.forEach((el) => el.classList.add("hidden"));
}
