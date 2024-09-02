import { checkAuth } from "./storeToken.js";
import { loadComponents, onlineApiUrl } from "./commonFunction.js";
import { showErrorToast, showSuccessToast } from "./toastifyMessage.js";

let currentStep = 0;
let selectedSpecialityId = null;
const steps = document.querySelectorAll(".form-step");
const specialityBtn = document.querySelector("#speciality-btn");
const doctorsBtn = document.querySelector("#doctors-btn");
const prevBtn = document.getElementById("prev-btn");

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
          const doctorId = item.dataset.doctorId;
          // Set the selectedSpecialityId based on the doctor's specialty
          selectedSpecialityId =
            data.doctors.find((doc) => doc._id === doctorId)?.specializationId
              ._id || null;
          SlotList(doctorId);
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
          <div class="flex flex-col gap-2 items-center justify-center border rounded-lg shadow-md transform transition duration-500 hover:scale-105 p-2 ${slotClasses}">
            <h5 class="text-xl font-semibold tracking-tight text-gray-900">
              ${new Date(val.date).toLocaleDateString()}
            </h5>
            <h5 class="text-lg font-medium tracking-tight text-blue-600">
              ${val.time}
            </h5>
          </div>
        `;
      });

      document.getElementById("slots-list").innerHTML = options.join(" ");
    })
    .catch((err) => console.log(err));
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
