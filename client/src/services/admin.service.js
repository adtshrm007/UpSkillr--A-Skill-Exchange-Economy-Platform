import api from "./api.js";

export const adminService = {
  getUsers: (params) => api.get("/admin/users", { params }),
  getUserDetail: (id) => api.get(`/admin/users/${id}`),
  getStats: () => api.get("/admin/stats"),
  toggleStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
};
