export function checkAuth(protectedRoute) {
  const token = localStorage.getItem("token");

  if (token) {
    // If the token exists, redirect to the protected route
    window.location.href = protectedRoute;
  } else {
    // If no token, redirect to the login page
    window.location.href = "/html/login.html";
  }
}
