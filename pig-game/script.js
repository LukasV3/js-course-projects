"use strict";

const diceEl = document.querySelector(".dice");
const rollButton = document.querySelector(".btn--roll");
const newGameButton = document.querySelector(".btn--new");
const holdButton = document.querySelector(".btn--hold");

const currentScore1 = document.querySelector("#current--0");
const totalScore1 = document.querySelector("#score--0");
const currentScore2 = document.querySelector("#current--1");
const totalScore2 = document.querySelector("#score--1");

const player1 = document.querySelector(".player--0");
const player2 = document.querySelector(".player--1");

let player, totalDice, playing;

resetGame();

// EVENT LISTENERS

newGameButton.addEventListener("click", () => {
  resetGame();
});

rollButton.addEventListener("click", () => {
  if (!playing) return;
  let diceNumber = randomNumber();

  diceEl.classList.remove("hidden");
  diceEl.src = `dice-${diceNumber}.png`;

  if (diceNumber === 1) {
    resetCurrent();
    switchPlayer();
  } else {
    totalDice += diceNumber;
    updateCurrent();
  }
});

holdButton.addEventListener("click", () => {
  if (!playing) return;
  updateTotal();
  checkWinner();
  if (playing) switchPlayer();
});

// FUNCTIONS

function randomNumber() {
  return Math.trunc(Math.random() * 6) + 1;
}

function setTextToZero(arr) {
  arr.forEach((el) => (el.textContent = 0));
}

function resetGame() {
  playing = true;
  player = 1;
  totalDice = 0;

  diceEl.classList.add("hidden");

  player1.classList.add("player--active");
  player2.classList.remove("player--active");
  player1.classList.remove("player--winner");
  player2.classList.remove("player--winner");

  setTextToZero([currentScore1, totalScore1, currentScore2, totalScore2]);
}

function updateCurrent() {
  if (player === 1) {
    currentScore1.textContent = totalDice;
  } else {
    currentScore2.textContent = totalDice;
  }
}

function resetCurrent() {
  if (player === 1) {
    currentScore1.textContent = 0;
  } else {
    currentScore2.textContent = 0;
  }
}

function switchPlayer() {
  totalDice = 0;
  player = player === 1 ? 2 : 1;

  player1.classList.toggle("player--active");
  player2.classList.toggle("player--active");
}

function updateTotal() {
  if (player === 1) {
    totalScore1.textContent =
      Number(totalScore1.textContent) + Number(currentScore1.textContent);
    currentScore1.textContent = 0;
  } else {
    totalScore2.textContent =
      Number(totalScore2.textContent) + Number(currentScore2.textContent);
    currentScore2.textContent = 0;
  }
}

function checkWinner() {
  if (player === 1 && totalScore1.textContent >= 100) {
    player1.classList.add("player--winner");
    playing = false;
  }
  if (player === 2 && totalScore2.textContent >= 100) {
    player2.classList.add("player--winner");
    playing = false;
  }
}
