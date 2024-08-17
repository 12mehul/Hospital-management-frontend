let currentStep = 0;
const formSteps = document.querySelectorAll(".form-step");

function nextStep() {
  formSteps[currentStep].classList.add("hidden");
  currentStep++;
  formSteps[currentStep].classList.remove("hidden");
}
