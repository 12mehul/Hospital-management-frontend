const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[a-zA-Z]+$/;
const uppercaseRegex = /(?=.*[A-Z])/;
const lowercaseRegex = /(?=.*[a-z])/;
const specialCharRegex = /(?=.*[@#$%^&-+=()])/;
const numberRegex = /(?=.*[0-9])/;
const noWhitespaceRegex = /(?=\S+$)/;
const lengthRegex = /.{8,15}/;
const phoneRegex = /^[0-9]{10}$/;

let currentStep = 0;
const formSteps = document.querySelectorAll(".form-step");

function isMatchedPass() {
  let pass = document.getElementById("password").value;
  let confPass = document.getElementById("confirmPassword").value;
  return pass === confPass;
}

function validatePassword(value) {
  if (!uppercaseRegex.test(value)) {
    return "Password must contain at least one uppercase letter";
  } else if (!lowercaseRegex.test(value)) {
    return "Password must contain at least one lowercase letter";
  } else if (!specialCharRegex.test(value)) {
    return "Password must contain at least one special character";
  } else if (!numberRegex.test(value)) {
    return "Password must contain at least one numeric digit";
  } else if (!noWhitespaceRegex.test(value)) {
    return "Password must not contain any whitespace";
  } else if (!lengthRegex.test(value)) {
    return "Password must be 8-15 characters long";
  }
  return "";
}

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
    formSteps[currentStep].classList.remove("hidden");
  }
}

function performValidation() {
  nextStep();
}
