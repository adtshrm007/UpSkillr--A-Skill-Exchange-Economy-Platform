import api from "./api.js";

export const reviewService = {
  create: (data) => api.post("/reviews", data),
  getByUser: (userId, params) => api.get(`/reviews/user/${userId}`, { params }),
};
