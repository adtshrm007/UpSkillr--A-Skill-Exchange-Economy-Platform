import api from "./api.js";

export const sessionService = {
  book: (data) => api.post("/sessions/book", data),
  getMy: (params) => api.get("/sessions/my", { params }),
  getById: (id) => api.get(`/sessions/${id}`),
  cancel: (id, reason) => api.patch(`/sessions/${id}/cancel`, { reason }),
  complete: (id) => api.patch(`/sessions/${id}/complete`),
};
