// ===== Currency Converter =====

// Free API
const BASE_URL = "https://open.er-api.com/v6/latest/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Currency List
const currencies = [
  "USD","INR","EUR","GBP","JPY","AUD","CAD","CHF","CNY",
  "SGD","NZD","AED","SAR","PKR","BDT","NPR","LKR","ZAR"
];

// Dropdown Fill
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");

    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.appendChild(option);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    updateExchangeRate();
  });
}

function updateFlag(element) {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  let img = element.parentElement.querySelector("img");

  img.src = `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;
}

const swapBtn = document.querySelector(".fa-arrow-right-arrow-left");

swapBtn.addEventListener("click", () => {
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});


// Amount change hote hi auto convert
const amountInput = document.querySelector(".amount input");

amountInput.addEventListener("input", () => {
  updateExchangeRate();
});

// Currency change hote hi auto convert
fromCurr.addEventListener("change", () => {
  updateFlag(fromCurr);
  updateExchangeRate();
});

toCurr.addEventListener("change", () => {
  updateFlag(toCurr);
  updateExchangeRate();
});


// Currency Convert Function
async function updateExchangeRate() {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal <= 0) {
    amtVal = 1;
    amount.value = 1;
  }

  try {
    const response = await fetch(`${BASE_URL}${fromCurr.value}`);
    const data = await response.json();

    if (data.result === "success") {
      const rate = data.rates[toCurr.value];

      const finalAmount = (amtVal * rate).toFixed(2);

      msg.innerText =
        `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } else {
      msg.innerText = "Unable to fetch exchange rate.";
    }
  } catch (error) {
    console.error(error);
    msg.innerText = "Error fetching exchange rate.";
  }
}

// Convert Button
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Auto Convert On Load
window.addEventListener("load", () => {
  updateExchangeRate();
});

// Auto Convert On Currency Change
fromCurr.addEventListener("change", updateExchangeRate);
toCurr.addEventListener("change", updateExchangeRate);