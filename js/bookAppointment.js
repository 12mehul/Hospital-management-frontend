import { checkAuth } from "./storeToken.js";
import { loadComponents, onlineApiUrl } from "./commonFunction.js";
import { showErrorToast, showSuccessToast } from "./toastifyMessage.js";

let currentStep = 0;
const steps = document.querySelectorAll(".form-step");
const nextBtn = document.getElementById("next-btn");
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
            class="flex w-full gap-2 p-2 bg-slate-50 border border-gray-600 rounded hover:transition shadow-md hover:border-sky-800 hover:shadow-sky-600">
              <a href="#" class="overflow-hidden rounded-full border-2 border-red-500" data-speciality-id="${val._id}">
                <img
                  src="../img/speciality-icon.jpeg"
                  alt="speciality"
                  class="w-16 h-16"
                />
              </a>
              <h2 class="flex items-center justify-center pl-2 font-semibold md:text-xl text-black">
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
          const specialityId = item.dataset.specialityId;
          DoctorList(specialityId);
          showStep(1);
        });
      });
    })
    .catch((err) => console.log(err));
}

DoctorList();

function DoctorList() {
  fetch(`${onlineApiUrl}/doctors`)
    .then((res) => res.json())
    .then((data) => {
      const options = data.doctors.map((val) => {
        return `
          <div
            class="bg-white border rounded-lg shadow-md transform transition duration-500 hover:scale-105">
              <div class="p-2 flex">
                <a href="#" data-doctor-id="${val._id}">
                  <img
                    class="w-24 h-24"
                    src="../img/doctor1.png"
                    loading="lazy"
                  />
                </a>
              </div>
              <div class="px-4 pb-3">
                <h5 class="text-xl font-semibold tracking-tight hover:text-violet-800 text-gray-900 capitalize">
                  ${val.firstName + " " + val.lastName}
                </h5>
                <p class="pt-2 text-gray-600 text-base break-all">
                  ${val.specializationId?.title}
                </p>
              </div>
              <div class="px-4 pb-4 flex justify-end">
                <button
                  class="w-full sm:w-auto p-1 font-medium text-white bg-sky-500 shadow-lg shadow-sky-500/50 hover:bg-sky-400 rounded-2xl"
                  type="button"
                >
                  Book Appointment
                </button>
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
          SlotList(doctorId);
          showStep(2);
        });
      });
    })
    .catch((err) => console.log(err));
}

function SlotList(doctorId) {
  fetch(`${onlineApiUrl}/slots?doctor=${doctorId}`)
    .then((res) => res.json())
    .then((data) => {
      const options = data.slots.map(
        (val) => `
          <div class="bg-white border rounded-lg shadow-md transform transition duration-500 hover:scale-105 p-2">
              <h5 class="text-xl font-semibold tracking-tight text-gray-900">
                ${new Date(val.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h5>
          </div>
        `
      );

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
  nextBtn.disabled = currentStep === steps.length - 1;
}

// Navigation button listeners
nextBtn.addEventListener("click", () => {
  if (currentStep < steps.length - 1) {
    showStep(currentStep + 1);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    showStep(currentStep - 1);
  }
});
