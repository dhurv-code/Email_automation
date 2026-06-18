import { api } from "./api";

export const getEmailLogs = () => api.get("/email-logs");

export const getEmailLog = (id) => api.get(`/email-logs/${id}`);

export const createEmailLog = (data) => api.post("/email-logs", data);

export const updateEmailLog = (id, data) => api.put(`/email-logs/${id}`, data);

export const deleteEmailLog = (id) => api.delete(`/email-logs/${id}`);
