import api from "./api.js";

export const swapService = {
  request: (data) => api.post("/swaps/request", data),
  getMy: (params) => api.get("/swaps/my", { params }),
  respond: (id, action) => api.patch(`/swaps/${id}/respond`, { action }),
  schedule: (id, scheduledAt) => api.patch(`/swaps/${id}/schedule`, { scheduledAt }),
  complete: (id) => api.patch(`/swaps/${id}/complete`),
  cancel: (id) => api.patch(`/swaps/${id}/cancel`),
};
