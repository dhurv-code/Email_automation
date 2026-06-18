import { api } from "./api";

export const getConversations = () => api.get("/conversations");

export const getConversation = (id) => api.get(`/conversations/${id}`);

export const createConversation = (data) => api.post("/conversations", data);

export const updateConversation = (id, data) => api.put(`/conversations/${id}`, data);

export const deleteConversation = (id) => api.delete(`/conversations/${id}`);
