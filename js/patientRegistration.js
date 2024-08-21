import {
  emailRegex,
  nameRegex,
  phoneRegex,
  validatePassword,
  isMatchedPass,
} from "./commonFunction.js";

let currentStep = 0;
const formSteps = document.querySelectorAll(".form-step");

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const nextButtons = document.querySelectorAll("#nextButton");

  nextButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      nextStep();
    });
  });
});

function genderValidation() {
  let selectedGender = document.querySelector("input[name='gender']:checked");
  if (!selectedGender) {
    return "Please select a gender";
  }
  return "";
}

function checkValidation(name, value) {
  if (!value) {
    return `Please enter ${name.replace(/([A-Z])/g, " $1").toLowerCase()}`;
  }

  switch (name) {
    case "name":
      if (!nameRegex.test(value)) {
        return "Name should contain only letters";
      }
      break;
    case "email":
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
      break;
    case "gender":
      return genderValidation();
    case "password":
      return validatePassword(value);
    case "confirmPassword":
      const passwordError = validatePassword(value);
      if (passwordError) {
        return passwordError;
      } else if (!isMatchedPass()) {
        return "Passwords do not match";
      }
      break;
    case "phone":
      if (!phoneRegex.test(value)) {
        return "Phone number must be 10 digits long";
      }
      break;
    default:
      console.log("Invalid input name");
  }
  return "";
}

function nextStep() {
  // Validate all input fields in the current step
  const inputs = formSteps[currentStep].querySelectorAll("input");
  let allValid = true;

  inputs.forEach((input) => {
    // Validate immediately on the first "Next" button click
    const message = checkValidation(input.name, input.value);
    document.getElementById(`error-${input.name}`).innerHTML = message;
    if (message) {
      allValid = false; // If any field is invalid, set allValid to false
    }

    // Add input event listener for real-time validation
    input.addEventListener("change", function () {
      const message = checkValidation(input.name, input.value);
      document.getElementById(`error-${input.name}`).innerHTML = message;
      if (message) {
        allValid = false;
      } else {
        allValid = true;
      }
    });
  });

  if (allValid) {
    formSteps[currentStep].classList.add("hidden");
    currentStep++;
    if (currentStep < formSteps.length) {
      formSteps[currentStep].classList.remove("hidden");
    }
  }
}

function performValidation() {
  nextStep();
}
