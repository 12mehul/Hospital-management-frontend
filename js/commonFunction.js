export const onlineApiUrl =
  "https://hospital-management-backend-theta.vercel.app/api";
export const offlineApiUrl = "http://localhost:5000/api";

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const nameRegex = /^[A-Za-z]+$/;
export const uppercaseRegex = /(?=.*[A-Z])/;
export const lowercaseRegex = /(?=.*[a-z])/;
export const specialCharRegex = /(?=.*[@#$%^&-+=()])/;
export const numberRegex = /(?=.*[0-9])/;
export const noWhitespaceRegex = /(?=\S+$)/;
export const lengthRegex = /.{8,15}/;
export const phoneRegex = /^[0-9]{10}$/;
export const pincodeRegex = /^[0-9]{6}$/;

export function isMatchedPass() {
  let pass = document.getElementById("password").value;
  let confPass = document.getElementById("confirmPassword").value;
  return pass === confPass;
}

export function genderValidation() {
  let selectedGender = document.querySelector("input[name='gender']:checked");
  if (!selectedGender) {
    return "Please select a gender";
  }
  return "";
}

export function validatePassword(value) {
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

export function loadComponents() {
  const sidebarContainer = document.getElementById("sidebar-container");
  const headerContainer = document.getElementById("header-container");

  // Fetch both sidebar and header concurrently
  Promise.all([
    fetch("../common/sidebar.html").then((response) => response.text()),
    fetch("../common/header.html").then((response) => response.text()),
  ])
    .then(([sidebarData, headerData]) => {
      sidebarContainer.innerHTML = sidebarData;
      headerContainer.innerHTML = headerData;
    })
    .catch((error) => console.log("Error loading components:", error));
}
