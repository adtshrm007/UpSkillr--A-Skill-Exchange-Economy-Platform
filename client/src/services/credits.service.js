import api from "./api.js";

export const creditsService = {
  getBalance: () => api.get("/credits/balance"),
  getTransactions: (params) => api.get("/credits/transactions", { params }),
};
