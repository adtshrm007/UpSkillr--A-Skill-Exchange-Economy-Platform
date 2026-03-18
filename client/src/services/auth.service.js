import api from "./api.js";

export const authService = {
  register: (data) => api.post("/user/register", data),
  login: (data) => api.post("/user/login", data),
  logout: () => api.post("/user/logout"),
  getMe: () => api.get("/user/me"),
  getDashboard: () => api.get("/user/dashboard"),
  updateProfile: (data) => api.put("/user/update", data),
  checkLoggedIn: () => api.get("/user/checkLoggedIn"),
  getPublicProfile: (id) => api.get(`/user/profile/${id}`),
};
