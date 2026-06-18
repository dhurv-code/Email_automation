import { api } from "./api";

export const getDashboardData = () => api.get("/dashboard");

export const getDashboardStats = () => api.get("/dashboard/stats");

export const getDashboardMetrics = () => api.get("/dashboard/metrics");
