import { checkAuth } from "./storeToken.js";
import { loadComponents, onlineApiUrl } from "./commonFunction.js";
import { showErrorToast, showSuccessToast } from "./toastifyMessage.js";

let currentStep = 0;
let selectedSpecialityId = null;
let selectedDoctorId = null;
let selectedSlotId = null;
let selectedPatientId = null;

const steps = document.querySelectorAll(".form-step");
const specialityBtn = document.querySelector("#speciality-btn");
const doctorsBtn = document.querySelector("#doctors-btn");
const prevBtn = document.getElementById("prev-btn");

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("submit-btn").addEventListener("click", handleSubmit);
});

// Authenticate and then load components
checkAuth()
  .then(() => {
    return loadComponents();
  })
  .then(() => SpecialityList())
  .catch((error) => console.log("Error:", error));

function SpecialityList() {
  fetch(`${onlineApiUrl}/speciality`)
    .then((res) => res.json())
    .then((data) => {
      const options = data.specialities.map((val) => {
        return `
          <li
            class="flex w-full gap-2 p-2 bg-slate-50 border border-gray-600 rounded hover:transition shadow-md hover:border-sky-800 hover:shadow-sky-600 cursor-pointer"
            data-speciality-id="${val._id}"
          >
            <img
              src="../img/speciality-icon.jpeg"
              alt="speciality"
              class="w-16 h-16 rounded-full border-2 border-red-500 object-cover"
            />
            <h2 class="pl-2 pt-1 font-semibold md:text-xl text-black">
              ${val.title}
            </h2>
          </li>
        `;
      });

      document.getElementById("speciality-list").innerHTML = options.join(" ");

      // Add event listeners to each speciality item
      document.querySelectorAll("[data-speciality-id]").forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          selectedSpecialityId = item.dataset.specialityId;
          DoctorList(selectedSpecialityId);
          showStep(1);
        });
      });
    })
    .catch((err) => console.log(err));
}

function DoctorList(specialityId) {
  const apiUrl = specialityId
    ? `${onlineApiUrl}/doctors?specializationId=${specialityId}`
    : `${onlineApiUrl}/doctors`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      const options = data.doctors.map((val) => {
        return `
          <div
            class="w-full flex gap-4 bg-white border rounded-lg shadow-md transform transition duration-500 hover:scale-105">
              <img
                class="w-24 h-full rounded border-2 border-red-500 object-cover"
                src="../img/doctor1.png"
                loading="lazy"
              />
              <div class="w-full flex flex-col gap-3">
                <div class="pt-2">
                  <h5 class="text-xl font-semibold tracking-tight text-gray-900 capitalize">
                    ${val.firstName + " " + val.lastName}
                  </h5>
                  <p class="pt-2 text-gray-600 text-base break-all">
                    ${val.specializationId?.title}
                  </p>
                </div>
                <div class="px-2 flex justify-end">
                  <button
                    class="w-full sm:w-auto p-1 font-medium text-white bg-sky-500 shadow-lg shadow-sky-500/50 hover:bg-sky-400 rounded-2xl"
                    type="button"
                    data-doctor-id="${val._id}"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
          </div>
        `;
      });

      document.getElementById("doctors-list").innerHTML = options.join(" ");

      // Add event listeners to each doctor item
      document.querySelectorAll("[data-doctor-id]").forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          selectedDoctorId = item.dataset.doctorId;
          // Set the selectedSpecialityId based on the doctor's specialty
          selectedSpecialityId =
            data.doctors.find((doc) => doc._id === selectedDoctorId)
              ?.specializationId._id || null;
          SlotList(selectedDoctorId);
          showStep(2);
        });
      });
    })
    .catch((err) => console.log(err));
}

function SlotList(doctorId) {
  fetch(`${onlineApiUrl}/slots?doctorId=${doctorId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.slots.length === 0) {
        document.getElementById("slots-list").innerHTML = `
          <div class="text-center font-semibold text-gray-600 text-2xl">
            No slots available.
          </div>
        `;
        return;
      }
      const options = data.slots.map((val) => {
        const isBooked = !val.isAvailable;
        const slotClasses = isBooked
          ? "bg-gray-300 cursor-not-allowed opacity-50"
          : "bg-white cursor-pointer hover:shadow-sky-400";
        return `
          <div class="flex gap-4 items-center justify-center border rounded-lg shadow-md transform transition duration-500 hover:scale-105 p-2 ${slotClasses}"
            data-slot-id="${val._id}" ${isBooked ? "disabled" : ""}>
            <span class="text-xl">📅</span>
            <div>
              <h5 class="text-xl font-semibold tracking-tight text-gray-900">
                ${new Date(val.date).toLocaleDateString()}
              </h5>
              <h5 class="text-lg font-medium tracking-tight text-blue-600">
                ${val.time}
              </h5>
            </div>
          </div>
        `;
      });

      document.getElementById("slots-list").innerHTML = options.join(" ");

      // Add event listeners to each available slot
      document
        .querySelectorAll("[data-slot-id]:not([disabled])")
        .forEach((item) => {
          item.addEventListener("click", (e) => {
            e.preventDefault();
            selectedSlotId = item.dataset.slotId;
            showStep(3);
            PatientList();
          });
        });
    })
    .catch((err) => console.log(err));
}

function PatientList() {
  const searchInput = document.getElementById("search-input");

  // Listen for input in the search field
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value;

    if (query.length > 0) {
      fetch(`${onlineApiUrl}/patients/search?name=${query}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.patients.length === 0) {
            document.getElementById("patients-list").innerHTML = `
              <div class="p-2 text-center font-semibold text-gray-600 text-2xl">
                No patients found.
              </div>
            `;
            return;
          }

          const options = data.patients.map((patient) => {
            return `
              <div
                class="patient-item flex justify-between p-3 hover:shadow-md hover:shadow-sky-400 cursor-pointer"
                data-patient-id="${patient._id}">
                  <h5 class="text-xl font-semibold tracking-tight text-gray-800 capitalize">
                    ${patient.firstName + " " + patient.lastName}
                  </h5>
                  <p class="font-semibold text-gray-600">
                    ${patient.patientID}
                  </p>
              </div>
            `;
          });

          document.getElementById("patients-list").innerHTML =
            options.join(" ");

          // Add event listeners to each patient item
          document.querySelectorAll("[data-patient-id]").forEach((item) => {
            item.addEventListener("click", (e) => {
              e.preventDefault();

              // Remove 'selected' class from previously selected patient
              document.querySelectorAll(".patient-item").forEach((el) => {
                el.classList.remove("bg-sky-100", "border", "border-sky-500");
              });

              // Add 'selected' class to the clicked item
              item.classList.add("bg-sky-100", "border", "border-sky-500");
              selectedPatientId = item.dataset.patientId;
            });
          });
        })
        .catch((err) => console.log(err));
    } else {
      document.getElementById("patients-list").innerHTML = "";
    }
  });
}

function showStep(step) {
  currentStep = step;
  steps.forEach((step, index) => {
    step.classList.toggle("hidden", index !== currentStep);
  });

  prevBtn.disabled = currentStep === 0;
}

specialityBtn.addEventListener("click", () => {
  showStep(0);
});

doctorsBtn.addEventListener("click", () => {
  DoctorList();
  showStep(1);
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    showStep(currentStep - 1);
  }
});

async function handleSubmit(e) {
  e.preventDefault();
  // Validate all required fields
  if (!selectedSpecialityId) {
    showErrorToast("Speciality is required.");
    return;
  }
  if (!selectedDoctorId) {
    showErrorToast("Doctor is required.");
    return;
  }
  if (!selectedSlotId) {
    showErrorToast("Slot is required.");
    return;
  }
  if (!selectedPatientId) {
    showErrorToast("Patient is required.");
    return;
  }

  const appointmentData = {
    specializationId: selectedSpecialityId,
    doctorId: selectedDoctorId,
    slotId: selectedSlotId,
    patientId: selectedPatientId,
  };

  try {
    const response = await fetch(`${onlineApiUrl}/appointments`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(appointmentData),
    });
    const data = await response.json();
    if (!response.ok) {
      showErrorToast(data.msg);
      return;
    }
    if (response.ok) {
      showSuccessToast(data.msg);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  } catch (err) {
    showErrorToast("Failed to fetch data");
  }

  return false;
}
