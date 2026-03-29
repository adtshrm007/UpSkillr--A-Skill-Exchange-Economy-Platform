import api from "./api";

export const mentorsService = {
  find: (params) => api.get("/matches", { params }),
};
