"use strict";

const checkButton = document.querySelector(".check");
const againButton = document.querySelector(".again");
const input = document.querySelector(".guess");
const message = document.querySelector(".message");
const scoreEl = document.querySelector(".score");
const highscoreEl = document.querySelector(".highscore");
const numberEl = document.querySelector(".number");

let randomNumber = randomNum();
let guess = undefined;
let score = 20;
let highscore = 0;

scoreEl.innerText = score;
againButton.style.display = "none";

// EVENT LISTENERS

checkButton.addEventListener("click", () => {
  guess = Number(input.value);
  input.value = "";

  if (guess > 20 || guess < 1 || guess === undefined) {
    message.innerText = "Number must be between 1 and 20";
  } else {
    checkNumber();
  }
});

againButton.addEventListener("click", () => {
  resetGame();
});

// FUNCTIONS

function randomNum() {
  return Math.floor(Math.random() * 20) + 1;
}

function checkNumber() {
  if (guess === randomNumber) {
    setHighscore();
    numberEl.innerText = randomNumber;
    checkButton.style.display = "none";
    againButton.style.display = "block";
    document.body.style.backgroundColor = "#60b347";
  } else {
    wrongGuess();
  }
}

function resetGame() {
  document.body.style.backgroundColor = "#222";

  checkButton.style.display = "block";
  againButton.style.display = "none";
  numberEl.innerText = "?";
  message.innerText = "Start guessing...";

  scoreEl.innerText = score = 20;
  randomNumber = randomNum();
  console.log(randomNumber);
}

function wrongGuess() {
  if (guess > randomNumber) {
    message.innerText = "Too high!";
  } else {
    message.innerText = "Too low!";
  }
  score--;
  scoreEl.innerText = score;
}

function setHighscore() {
  if (score > highscore) {
    highscoreEl.innerText = highscore = score;
    message.innerText = "New Highscore!!";
  } else {
    message.innerText = "Correct!";
  }
}

console.log(randomNumber);
