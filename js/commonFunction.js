import { logout } from "./storeToken.js";

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
  // Create an array of promises for loading components
  const loadSidebar = fetch("../common/sidebar.html")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load sidebar");
      return response.text();
    })
    .then((data) => {
      document.getElementById("sidebar-container").innerHTML = data;
      const sidebarContainer = document.getElementById("menu-items");
      const role = localStorage.getItem("role");

      let sidebarHTML = ``;
      if (role === "doctor") {
        sidebarHTML += `
          <li>
            <a
              href="/html/patientsList.html"
              class="flex items-center p-2 text-base font-semibold rounded-lg group hover:bg-purple-100 hover:text-blue-600"
            >
              <span class="text-xl">🧑‍⚕️</span>
              <span class="flex-1 ml-3 whitespace-nowrap">Patients List</span>
            </a>
          </li>
        `;
      }

      sidebarContainer.innerHTML += sidebarHTML;
    });

  const loadHeader = fetch("../common/header.html")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load header");
      return response.text();
    })
    .then((data) => {
      const headerContainer = document.getElementById("header-container");
      headerContainer.innerHTML = data;

      const logoutBtn = headerContainer.querySelector("button");
      logoutBtn.addEventListener("click", () => {
        logout();
      });
    });

  // Return a promise that resolves when both components are loaded
  return Promise.all([loadSidebar, loadHeader]);
}

export function SpecialityList() {
  fetch(`${onlineApiUrl}/speciality`)
    .then((res) => res.json())
    .then((data) => {
      const options = data.specialities.map((val) => {
        return `<option value="${val._id}">${val.title}</option>`;
      });

      options.unshift(`<option value="">Select Speciality</option>`);
      document.getElementById("specialization").innerHTML = options.join(" ");
    })
    .catch((err) => console.log(err));
}
