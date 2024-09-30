export function isAuthenticated() {
  return !!sessionStorage.getItem("access_token");
}

export function logout(navigate) {
  sessionStorage.removeItem("access_token");
  navigate("/");
}
