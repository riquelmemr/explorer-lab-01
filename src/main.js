import "./css/index.css";
import IMask, { MaskedRange } from "imask";

const bgPrimaryColor = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const bgSecondaryColor = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const logoCard = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  };

  bgPrimaryColor.setAttribute("fill", colors[type][0]);
  bgSecondaryColor.setAttribute("fill", colors[type][1]);
  logoCard.setAttribute("src", `/cc-${type}.svg`);
}

globalThis.setCardType = setCardType;

const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
  mask: "0000",
};
const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex);
    });

    console.log(foundMask);

    return foundMask;
  },
};

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault()
  alert("Seu cartão foi registrado, e está seguro conosco!")
});

const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", () => {
  updateCCName(cardHolder.value)
});

function updateCCName(name) {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText = name.length === 0 ? 'FULANO DA SILVA' : name
}

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

function updateCardNumber(code) {
  const cardNumber = document.querySelector(".cc-number")
  cardNumber.innerText = code.length === 0 ? "1234 5678 9012 3456" : code
}

function updateExpirationDate(code) {
  const expirationDate = document.querySelector(".cc-expiration .value")
  expirationDate.innerText = code.length === 0 ? "02/32" : code
}

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})


