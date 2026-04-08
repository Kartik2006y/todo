import axios from "axios";

import { AUTH_STORAGE_KEY } from "../constants";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

apiClient.interceptors.request.use((config) => {
  const rawAuth = localStorage.getItem(AUTH_STORAGE_KEY);

  if (rawAuth) {
    const auth = JSON.parse(rawAuth);

    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
  }

  return config;
});

export default apiClient;
