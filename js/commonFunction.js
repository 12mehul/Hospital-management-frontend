export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const nameRegex = /^[a-zA-Z]+$/;
export const uppercaseRegex = /(?=.*[A-Z])/;
export const lowercaseRegex = /(?=.*[a-z])/;
export const specialCharRegex = /(?=.*[@#$%^&-+=()])/;
export const numberRegex = /(?=.*[0-9])/;
export const noWhitespaceRegex = /(?=\S+$)/;
export const lengthRegex = /.{8,15}/;
export const phoneRegex = /^[0-9]{10}$/;

export function isMatchedPass() {
  let pass = document.getElementById("password").value;
  let confPass = document.getElementById("confirmPassword").value;
  return pass === confPass;
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
