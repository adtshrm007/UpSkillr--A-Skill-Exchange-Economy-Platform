import api from "./api.js";

export const analyticsService = {
  ping: () => api.post("/analytics/ping"),
  getWeekly: () => api.get("/analytics/weekly"),
};
