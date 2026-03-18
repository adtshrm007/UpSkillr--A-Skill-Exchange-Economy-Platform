import api from "./api.js";

export const chatService = {
  getHistory: (sessionId) => api.get(`/chat/${sessionId}/history`),
};
