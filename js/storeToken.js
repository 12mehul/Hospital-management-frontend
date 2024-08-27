export function checkAuth() {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (token) {
      resolve();
    } else {
      window.location.href = "/html/login.html";
      reject(new Error("No token found. Redirecting to login."));
    }
  });
}

export function logout() {
  localStorage.clear();
  window.location.href = "/login/login.html";
}
