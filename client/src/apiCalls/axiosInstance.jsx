import axios from "axios";

export const url = "http://localhost:3000";

export const axiosInstance = axios.create({
  baseURL: url,
});

axiosInstance.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});