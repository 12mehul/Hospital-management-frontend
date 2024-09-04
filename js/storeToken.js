export function checkAuth() {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Decode the token
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Check if the token is expired
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        // If token is expired, clear it and redirect to login
        localStorage.clear();
        window.location.href = "/html/login.html";
        reject(new Error("Token expired. Redirecting to login."));
      } else {
        // Token is valid
        resolve();
      }
    } else {
      // No token found, redirect to login
      window.location.href = "/html/login.html";
      reject(new Error("No token found. Redirecting to login."));
    }
  });
}

export function checkAuthRoute() {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "/html/bookAppointment.html";
  }
}

export function logout() {
  localStorage.clear();
  window.location.href = "/html/login.html";
}
