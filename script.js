'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2025-03-17T09:15:04.904Z',
    '2025-03-18T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EGP',
  locale: 'ar-EG', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2024-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2025-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'ar-SY',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
//making the log out fynction
/*
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60));
    const sec = String(time % 60);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};
*/
const startTimerLogOut = function () {
  const trick = function () {
    const minute = String(Math.trunc(time / 60));
    const sec = String(time % 60);
    labelTimer.textContent = `${minute}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'login to to start';
    }
    time--;
  };
  let time = 30;
  trick();
  const timer = setInterval(trick, 1000);
  return timer;
};
const currencyFormat = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
console.log(
  currencyFormat(account1.movements.at(1), account1.locale, account1.currency)
);
const formatDate = function (date) {
  const calcPassedDate = Math.round(
    Math.abs(new Date() - date) / (1000 * 60 * 60 * 24)
  );
  if (calcPassedDate === 1) return `yeaterDay`;
  if (calcPassedDate === 0) return 'toDay';
  if (calcPassedDate === 7) return 'weekAgo';
  else {
    // const year = date.getFullYear();
    // const month = date.getMonth() + 1;
    // const Day = date.getDate();
    // return `${year}/${month}/${Day}`;
    return new Intl.DateTimeFormat(currentAccount.locale).format(date);
  }
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const displayMovementDate = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));
  console.log(displayMovementDate);
  if (sort) displayMovementDate.sort((a, b) => a.movement - b.movement);
  displayMovementDate.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const now = formatDate(new Date(movementDate));
    const formattedMov = currencyFormat(movement, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${now}</div>
        <div class="movements__value">${formattedMov}</div>
        
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = currencyFormat(
    acc.balance,
    acc.local,
    acc.currency
  );
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${currencyFormat(
    incomes,
    acc.local,
    acc.currency
  )}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${currencyFormat(out, acc.local, acc.currency)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${currencyFormat(
    interest,
    acc.local,
    acc.currency
  )}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // startTimerLogOut();
    // Update UI
    if (timer) clearInterval(timer);
    timer = startTimerLogOut();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  console.log(currentAccount.balance);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    console.log(currentAccount.balance);
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date());
      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach((mov, i) => {
    if (i % 2 === 0) {
      mov.style.color = 'orangered';
    } else {
      mov.style.color = 'blue';
    }
  });
});
//fake logged in
// const fakeAccount = account1;
// updateUI(fakeAccount);
// containerApp.style.opacity = 100;

//impleent the date for both

// const year = dateOfarrive.getFullYear();
// const month = dateOfarrive.getMonth() + 1;
// const Day = dateOfarrive.getDate();
// labelDate.textContent = `${year}/${month}/${Day}`;
const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  // weekday: 'long',
};
// const locale = navigator.language;
// console.log(locale);

labelDate.textContent = new Intl.DateTimeFormat('ar-SY', options).format(now);
//implement the push for the date array in the transfer btn and the loan btn

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
///////////////
//converting the number to string first how ?
// concatination with string
// console.log(+'23');
// //parsing
// //value of string for example from css
// console.log(Number.parseInt('23', 10));
// console.log(Number.parseFloat('23.5px', 10));
// //value of string
// console.log(Number.isNaN('23'));
// console.log(Number.isNaN(23));
// //finite does not convert to number the ultimat way to check whether it s integer or not

// console.log(Number.isFinite(+'10'));
// console.log(Math.sqrt(25));
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1)) + min;
// console.log(randomInt(2, 10));
// // Numeric Separators
// const numericSeparetor = 200_000;
// console.log(numericSeparetor);
// //Bigint
// console.log(20n == '20');
// //creating dates
// const deates = new Date(' Dec Sat 2004');
// console.log(deates);
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future.getDate());
// console.log(future);
// console.log(future.toISOString());
// console.log(future.getTime()); //time stamp
// console.log(new Date(future.getTime()));
const milePerHour = {
  style: 'unit',
  unit: 'kilometer-per-hour',
};
const syraiFormat = 15059542.05;
console.log(new Intl.NumberFormat('ar-SY', milePerHour).format(syraiFormat));
const stopWatch = setTimeout(
  (ing1, ing2) => console.log(`the ingredents are ${ing1} and ${ing2}`),
  3000,
  'pizza',
  'spanish'
);
//set intervals do the the same function repeatly
// const setTimerChallenge = setInterval(function () {
//   const setSecond = new Date();
//   console.log(setSecond.getSeconds());
// }, 1000);
// console.log(setTimerChallenge);
