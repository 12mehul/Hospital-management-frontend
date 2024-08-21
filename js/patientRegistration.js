import {
  emailRegex,
  nameRegex,
  phoneRegex,
  validatePassword,
  isMatchedPass,
  pincodeRegex,
  genderValidation,
} from "./commonFunction.js";

let currentStep = 0;
const formSteps = document.querySelectorAll(".form-step");

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const nextButtons = document.querySelectorAll("#nextButton");
  const prevButtons = document.querySelectorAll("#prevButton");

  nextButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      nextStep();
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      prevStep();
    });
  });

  // Bind the handleSubmit function to the form's submit event
  document
    .getElementById("registrationForm")
    .addEventListener("submit", handleSubmit);
});

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
        return "Phone number should be exactly 10 digits";
      }
      break;
    case "pincode":
      if (!pincodeRegex.test(value)) {
        return "Pincode should be exactly six digits";
      }
      break;
    default:
      console.log("Invalid input name");
  }
  return "";
}

function validateCurrentStep() {
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
  return allValid;
}

function nextStep() {
  if (validateCurrentStep()) {
    formSteps[currentStep].classList.add("hidden");
    currentStep++;
    if (currentStep < formSteps.length) {
      formSteps[currentStep].classList.remove("hidden");
    }
  }
}

function prevStep() {
  if (currentStep > 0) {
    formSteps[currentStep].classList.add("hidden");
    currentStep--;
    formSteps[currentStep].classList.remove("hidden");
  }
}

function handleSubmit(e) {
  e.preventDefault();

  // Validate the last step before submission
  if (!validateCurrentStep()) {
    return; // Stop submission if validation fails
  }

  const formData = new FormData(document.getElementById("registrationForm"));
  const formObject = {};

  formData.forEach((value, key) => {
    if (key !== "confirmPassword") {
      // Check if the key is part of the address and nest it accordingly
      if (
        ["addressLine", "city", "state", "country", "pincode"].includes(key)
      ) {
        formObject.fullAddress = formObject.fullAddress || {};
        formObject.fullAddress[key] = value;
      } else {
        formObject[key] = value;
      }
    }
  });

  fetch("https://hospital-management-backend-theta.vercel.app/api/patients", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(formObject),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("registrationForm").reset();
      console.log("Success:", data);
    })
    .catch((err) => {
      console.log("Error:", err);
    });

  return false;
}
