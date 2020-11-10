"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

const account1 = {
  owner: "Lukas Volk",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-11-06T17:01:17.194Z",
    "2020-11-07T23:36:17.929Z",
    "2020-11-09T10:51:36.790Z",
  ],
  currency: "GBP",
  locale: "en-GB",
};

const account2 = {
  owner: "Jonas Schmedtmann",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "de-DE",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = ` 
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((a, b) => a + b);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter((mov) => mov > 0).reduce((a, b) => a + b);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements.filter((mov) => mov < 0).reduce((a, b) => a + b);
  labelSumOut.textContent = formatCur(Math.abs(outcomes), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((a, b) => a + b);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((str) => str[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUi = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const totalMinutes = 5;
  let totalSeconds = totalMinutes * 60;

  const tick = function () {
    let minutes = `${Math.floor(totalSeconds / 60)}`.padStart(2, 0);
    let seconds = `${totalSeconds % 60}`.padStart(2, 0);

    labelTimer.textContent = `${minutes}:${seconds}`;

    if (totalSeconds === 0) {
      clearInterval(interval);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    totalSeconds--;
  };
  tick();
  const interval = setInterval(tick, 1000);
  return interval;
};

///////////////////////////////////////
// Event handlers
let currentAccount, interval;

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  if (interval) clearInterval(interval);
  interval = startLogOutTimer();

  currentAccount = accounts.find((acc) => acc.username === inputLoginUsername.value);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    const firstName = currentAccount.owner.split(" ")[0];
    labelWelcome.textContent = `Welcome Back, ${firstName}!`;
    containerApp.style.opacity = 1;

    // Create current date and time
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    const locale = currentAccount.locale;
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

    // Clear input fileds
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    updateUi(currentAccount);
  }
});

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const recieverAcc = accounts.find((acc) => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUi(currentAccount);

    // Reset timer
    clearInterval(interval);
    interval = startLogOutTimer();
  }
});

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some((mov) => mov >= amount / 10)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUi(currentAccount);
    }, 2500);
  }

  // Reset timer
  clearInterval(interval);
  interval = startLogOutTimer();

  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex((acc) => acc.username === currentAccount.username);
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
