import { emailRegex, onlineApiUrl } from "./commonFunction.js";
import { checkAuthRoute } from "./storeToken.js";
import { showErrorToast, showSuccessToast } from "./toastifyMessage.js";

document.addEventListener("DOMContentLoaded", () => {
  checkAuthRoute();
  document.getElementById("loginForm").addEventListener("submit", handleSubmit);
});

function checkValidation(name, value) {
  if (!value) {
    return `Please enter ${name.replace(/([A-Z])/g, " $1").toLowerCase()}`;
  }

  if (name === "email" && !emailRegex.test(value)) {
    return "Please enter a valid email address";
  }

  return "";
}

function manageValidation() {
  const inputs = document.querySelectorAll("input");
  let isValid = true;

  inputs.forEach((input) => {
    const message = checkValidation(input.name, input.value);
    document.getElementById(`error-${input.name}`).innerHTML = message;
    if (message) {
      isValid = false;
    }

    input.addEventListener("change", function () {
      const message = checkValidation(input.name, input.value);
      document.getElementById(`error-${input.name}`).innerHTML = message;
    });
  });
  return isValid;
}

async function handleSubmit(e) {
  e.preventDefault();
  if (!manageValidation()) {
    return;
  }

  const formData = new FormData(document.getElementById("loginForm"));
  const formObject = {};

  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  try {
    const response = await fetch(`${onlineApiUrl}/accounts/login`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(formObject),
    });
    const data = await response.json();
    if (!response.ok) {
      showErrorToast(data.msg);
      return;
    }
    if (response.ok) {
      document.getElementById("loginForm").reset();
      showSuccessToast(data.msg);
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.userId);
      localStorage.setItem("role", data.role);
      setTimeout(() => {
        window.location.href = "/html/bookAppointment.html";
      }, 3000);
    }
  } catch (err) {
    showErrorToast("Failed to fetch data");
  }

  return false;
}
