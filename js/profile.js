import { checkAuth } from "../js/storeToken.js";
import { loadComponents, onlineApiUrl } from "../js/commonFunction.js";

// Authenticate and then load components and profile
checkAuth()
  .then(() => {
    return loadComponents();
  })
  .then(() => {
    loadProfile();
  })
  .catch((error) => {
    console.log("Error:", error);
  });

function loadProfile() {
  const profileContainer = document.getElementById("profile-container");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  let profilePage = "";

  if (role === "doctor") {
    profilePage = "../common/doctorProfile.html";
  } else if (role === "patient") {
    profilePage = "../common/patientProfile.html";
  } else {
    profileContainer.innerHTML = "<p>Error: Role not recognized.</p>";
    return;
  }

  // Fetch the appropriate profile page
  fetch(profilePage)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.text();
    })
    .then((data) => {
      profileContainer.innerHTML = data;
      // Fetch the profile data from the API
      fetchProfileData(role, token);
    })
    .catch((error) => {
      profileContainer.innerHTML = "<p>Error loading profile.</p>";
      console.log("Error fetching profile:", error);
    });
}

function fetchProfileData(role, token) {
  fetch(`${onlineApiUrl}/accounts/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      populateForm(role, data);
    })
    .catch((err) => {
      console.log("Error fetching profile data:", err);
    });
}

const roleFields = {
  patient: [
    "firstName",
    "lastName",
    "email",
    "password",
    "dob",
    "phone",
    "addressLine",
  ],
  doctor: [
    "firstName",
    "lastName",
    "email",
    "password",
    "specialization",
    "licenseNumber",
  ],
};

function populateForm(role, data) {
  const fields = roleFields[role] || [];

  fields.forEach((field) => {
    const inputElement = document.querySelector(`input[name="${field}"]`);
    if (inputElement) {
      inputElement.value = data[field] || "";
    }
  });

  // Handling the nested address object
  if (data.fullAddress) {
    const addressFields = [
      "addressLine",
      "city",
      "state",
      "country",
      "pincode",
    ];
    addressFields.forEach((field) => {
      const inputElement = document.querySelector(
        `input[name="fullAddress.${field}"]`
      );
      if (inputElement) {
        inputElement.value = data.fullAddress[field] || "";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("profileForm")
    .addEventListener("submit", handleSubmit);
});

async function handleSubmit(e) {
  e.preventDefault();

  const role = localStorage.getItem("role");
  const fields = roleFields[role] || [];
  const formData = {};

  // Handle non-address fields
  fields.forEach((field) => {
    formData[field] = document.querySelector(`input[name="${field}"]`).value;
  });

  // Handle the nested address object
  formData.fullAddress = {};
  const addressFields = ["addressLine", "city", "state", "country", "pincode"];
  addressFields.forEach((field) => {
    formData.address[field] = document.querySelector(
      `input[name="fullAddress.${field}"]`
    ).value;
  });

  fetch("/api/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Profile updated successfully:", data);
    })
    .catch((error) => {
      console.log("Error updating profile:", error);
    });
}
