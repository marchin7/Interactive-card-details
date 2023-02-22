const form = document.getElementById("form");
const thankSection = document.getElementById("thank-section");
const confirmBtn = document.getElementById("confirm-btn");
const continueBtn = document.getElementById("continue-btn");
const formInputs = document.querySelectorAll(".form-input");

const cardholderNameInput = document.getElementById("cardholder-name-input");
const cardNumberInput = document.getElementById("card-number-input");
const expDateMonthInput = document.getElementById("exp-date-month-input");
const expDateYearInput = document.getElementById("exp-date-year-input");
const cvcInput = document.getElementById("cvc-input");

const cardholderNamePrint = document.getElementById("cardholder-name-print");
const cardNumberPrint = document.getElementById("card-number-print");
const expDateMonthPrint = document.getElementById("exp-date-month-print");
const expDateYearPrint = document.getElementById("exp-date-year-print");
const cvcPrint = document.getElementById("cvc-print");

function capitalizeInputValue() {
    let cardholderNameInputValue = cardholderNameInput.value;
    let words = cardholderNameInputValue.split(" ").map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    words = words.join(" ");
    cardholderNameInput.value = words;
}

cardholderNameInput.addEventListener("input", () => {
    cardholderNamePrint.textContent = cardholderNameInput.value;
    capitalizeInputValue();
});

cardNumberInput.addEventListener("input", () => {
    cardNumberInput.value = cardNumberInput.value
        .replace(/\s/g, "")
        .replace(/([0-9]{4})/g, "$1 ")
        .trim();
    cardNumberPrint.textContent = cardNumberInput.value;
});

expDateMonthInput.addEventListener("input", () => {
    expDateMonthPrint.textContent = expDateMonthInput.value;
});

expDateYearInput.addEventListener("input", () => {
    expDateYearPrint.textContent = expDateYearInput.value;
});

cvcInput.addEventListener("input", () => {
    cvcPrint.textContent = cvcInput.value;
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    validateInputs();
    confirmForm();
});

function validateInputs() {
    let cardholderNameInputValue = cardholderNameInput.value.trim();
    let cardNumberInputValue = cardNumberInput.value.trim();
    let expDateMonthInputValue = expDateMonthInput.value.trim();
    let expDateYearInputValue = expDateYearInput.value.trim();
    let cvcInputValue = cvcInput.value.trim();

    cardNumberInputValue = cardNumberInputValue
        .replace(/([0-9]{4})/g, "$1 ")
        .replace(/\s/g, "")
        .trim();

    const cardholderNameRegExp = /^[A-z\.]*\s?([A-z\-\']+\s)+[A-z\-\']+$/;
    const numbersOnlyRegExp = /^[0-9]*$/;

    const year = new Date().getFullYear().toString();
    let currentYear = year.slice(2);

    const month = new Date().getMonth();
    let currentMonth = (month + 1).toString();
    if (currentMonth.length == 1) {
        currentMonth = "0" + currentMonth;
    }

    let maxExpYear = Number(currentYear) + 6;

    // validate cardholder name

    if (cardholderNameInputValue === "") {
        inputError(cardholderNameInput, "Can't be blank");
    } else if (!cardholderNameRegExp.test(cardholderNameInputValue)) {
        inputError(cardholderNameInput, "Name is not valid");
    } else {
        inputSuccess(cardholderNameInput);
    }

    // validate card number

    if (cardNumberInputValue === "") {
        inputError(cardNumberInput, "Can't be blank");
    } else if (!numbersOnlyRegExp.test(cardNumberInputValue)) {
        inputError(cardNumberInput, "Wrong format, numbers only");
    } else if (cardNumberInputValue.length !== 16) {
        inputError(cardNumberInput, "Must be 16 digits long");
    } else {
        inputSuccess(cardNumberInput);
    }

    // validate exp date year

    if (expDateYearInputValue === "") {
        inputError(expDateYearInput, "Can't be blank");
    } else if (!numbersOnlyRegExp.test(expDateYearInputValue)) {
        inputError(expDateYearInput, "Wrong format, numbers only");
    } else if (expDateYearInputValue.length !== 2) {
        inputError(expDateYearInput, "Must be 2 digits long");
    } else if (expDateYearInputValue < currentYear) {
        inputError(expDateYearInput, "Card is expired!");
    } else if (expDateYearInputValue > maxExpYear) {
        inputError(expDateYearInput, "Invalid year!");
    } else {
        inputSuccess(expDateYearInput);
    }

    // validate cvc

    if (cvcInputValue === "") {
        inputError(cvcInput, "Can't be blank");
    } else if (!numbersOnlyRegExp.test(cvcInputValue)) {
        inputError(cvcInput, "Wrong format, numbers only");
    } else if (cvcInputValue.length !== 3) {
        inputError(cvcInput, "Must be 3 digits long");
    } else {
        inputSuccess(cvcInput);
    }

    // validate exp date month

    if (expDateMonthInputValue === "") {
        expDateMonthInputError(expDateMonthInput, "Can't be blank");
    } else if (!numbersOnlyRegExp.test(expDateMonthInputValue)) {
        expDateMonthInputError(expDateMonthInput, "wrong format, numbers only");
    } else if (expDateMonthInputValue.length !== 2) {
        expDateMonthInputError(expDateMonthInput, "Must be 2 digits long");
    } else if (
        expDateMonthInputValue > 12 ||
        expDateMonthInputValue[0] > 1 ||
        expDateMonthInputValue == "00"
    ) {
        expDateMonthInputError(expDateMonthInput, "Must be between 01-12");
    } else if (
        expDateYearInputValue == currentYear &&
        expDateMonthInputValue < currentMonth
    ) {
        expDateMonthInputError(expDateMonthInput, "Card is expired!");
    } else {
        expDateMonthInputSuccess(expDateMonthInput);
    }

    function inputError(input, message) {
        let errorMsg = input.nextElementSibling;
        input.classList.add("error");
        input.classList.remove("success");
        errorMsg.classList.add("error");
        errorMsg.innerText = message;
    }

    function inputSuccess(input, message) {
        let errorMsg = input.nextElementSibling;
        input.classList.remove("error");
        input.classList.add("success");
        errorMsg.classList.remove("error");
    }

    function expDateMonthInputError(input, message) {
        let errorMsg = expDateMonthInput.parentElement.lastElementChild;
        errorMsg.innerText = message;
        input.classList.add("error");
        input.classList.remove("success");
        errorMsg.classList.add("error");
    }

    function expDateMonthInputSuccess(input, message) {
        let errorMsg = expDateMonthInput.parentElement.lastElementChild;
        input.classList.remove("error");
        input.classList.add("success");
    }
}

formInputs.forEach((input) => {
    input.addEventListener("input", () => {
        if (
            input.classList.contains("success") ||
            input.classList.contains("error")
        ) {
            validateInputs();
        }
    });
});

function confirmForm() {
    const formInputsArr = Array.from(formInputs);

    const hasSuccessClass = formInputsArr.every((item) => {
        return item.classList.contains("success");
    });

    const hasErrorClass = formInputsArr.every((item) => {
        return item.classList.contains("error");
    });

    if (hasSuccessClass === true && hasErrorClass === false) {
        form.classList.add("hide");
        thankSection.classList.add("show");
    }
}

continueBtn.addEventListener("click", () => {
    location.reload();
});
