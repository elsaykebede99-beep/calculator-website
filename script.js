const currentDisplay = document.querySelector("#current-display");
const previousDisplay = document.querySelector("#previous-display");
const buttons = document.querySelectorAll("button");

let currentValue = "0";
let previousValue = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  currentDisplay.textContent = currentValue;

  if (previousValue !== null && operator !== null) {
    previousDisplay.textContent = `${previousValue} ${getOperatorSymbol(operator)}`;
  } else {
    previousDisplay.textContent = "";
  }
}

function getOperatorSymbol(selectedOperator) {
  const symbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
  };

  return symbols[selectedOperator];
}

function enterNumber(number) {
  if (currentValue === "Error" || shouldResetDisplay) {
    currentValue = number === "." ? "0." : number;
    shouldResetDisplay = false;
  } else if (number === "." && currentValue.includes(".")) {
    return;
  } else if (currentValue === "0" && number !== ".") {
    currentValue = number;
  } else {
    currentValue += number;
  }

  updateDisplay();
}

function chooseOperator(selectedOperator) {
  if (currentValue === "Error") {
    return;
  }

  if (operator !== null && !shouldResetDisplay) {
    calculate();
  }

  previousValue = Number(currentValue);
  operator = selectedOperator;
  shouldResetDisplay = true;

  updateDisplay();
}

function calculate() {
  if (operator === null || previousValue === null) {
    return;
  }

  const currentNumber = Number(currentValue);
  let result;

  if (operator === "+") {
    result = previousValue + currentNumber;
  } else if (operator === "-") {
    result = previousValue - currentNumber;
  } else if (operator === "*") {
    result = previousValue * currentNumber;
  } else if (operator === "/") {
    result = currentNumber === 0 ? "Error" : previousValue / currentNumber;
  }

  currentValue = result === "Error"
    ? "Error"
    : String(Number(result.toFixed(10)));

  previousValue = null;
  operator = null;
  shouldResetDisplay = true;

  updateDisplay();
}

function clearCalculator() {
  currentValue = "0";
  previousValue = null;
  operator = null;
  shouldResetDisplay = false;

  updateDisplay();
}

function deleteNumber() {
  if (currentValue === "Error" || shouldResetDisplay) {
    clearCalculator();
    return;
  }

  currentValue = currentValue.length > 1
    ? currentValue.slice(0, -1)
    : "0";

  updateDisplay();
}

function calculatePercent() {
  if (currentValue !== "Error") {
    currentValue = String(Number(currentValue) / 100);
    updateDisplay();
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const number = button.dataset.number;
    const selectedOperator = button.dataset.operator;
    const action = button.dataset.action;

    if (number !== undefined) {
      enterNumber(number);
    } else if (selectedOperator !== undefined) {
      chooseOperator(selectedOperator);
    } else if (action === "calculate") {
      calculate();
    } else if (action === "clear") {
      clearCalculator();
    } else if (action === "delete") {
      deleteNumber();
    } else if (action === "percent") {
      calculatePercent();
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9.]$/.test(event.key)) {
    enterNumber(event.key);
  } else if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    calculate();
  } else if (event.key === "Escape") {
    clearCalculator();
  } else if (event.key === "Backspace") {
    deleteNumber();
  } else if (event.key === "%") {
    calculatePercent();
  }
});
