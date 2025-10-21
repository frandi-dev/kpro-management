const API_BASE_URL = "http://localhost:5000";

import axios from "axios";

// 🧠 Buat instance axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🪄 Interceptor untuk otomatis tambah token (jika ada)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚙️ Interceptor untuk tangani error global
apiClient.interceptors.response.use(
  (response) => response.data, // langsung return data saja
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    const message =
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan jaringan";

    return Promise.reject(new Error(message));
  }
);

// 🚀 Fungsi helper
export async function send(
  endpoint,
  method = "GET",
  data = null,
  customHeaders = {}
) {
  const config = {
    method,
    url: endpoint,
    headers: customHeaders,
    data,
  };

  return apiClient(config);
}

const api = {
  get: (url, config) => apiClient.send(url, "GET", config),
  post: (url, data, config) => apiClient.send(url, "POST", data, config),
  put: (url, data, config) => apiClient.send(url, "PUT", data, config),
  patch: (url, data, config) => apiClient.send(url, "PATCH", data, config),
  delete: (url, config) => apiClient.send(url, "DELETE", config),
  setToken: (token) => localStorage.setItem("token", token),
  getToken: () => localStorage.getItem("token"),
  clearToken: () => localStorage.removeItem("token"),
};

export default api;
