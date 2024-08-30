import { checkAuth } from "./storeToken.js";
import { loadComponents, onlineApiUrl } from "./commonFunction.js";
import { showErrorToast, showSuccessToast } from "./toastifyMessage.js";

// Authenticate and then load components
checkAuth()
  .then(() => {
    return loadComponents();
  })
  .catch((error) => console.log("Error:", error));
