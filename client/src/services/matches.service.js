import api from "./api.js";

export const matchesService = {
  find: (params) => api.get("/matches", { params }),
};
