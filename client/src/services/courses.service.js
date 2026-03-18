import api from "./api.js";

export const coursesService = {
  create: (data) => api.post("/courses", data),
  getAll: (params) => api.get("/courses", { params }),
  getMyCreated: () => api.get("/courses/my-created"),
  getMyEnrolled: () => api.get("/courses/my-enrolled"),
  getById: (id) => api.get(`/courses/${id}`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  addLesson: (id, data) => api.post(`/courses/${id}/lessons`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};
