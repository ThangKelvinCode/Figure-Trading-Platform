import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(
  function (config) {
    const token = sessionStorage.getItem("token"); // Changed from localStorage to sessionStorage
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    console.error("Axios request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("token"); // Changed from localStorage to sessionStorage
      sessionStorage.removeItem("refresh_token"); // Clear refresh token as well
      console.error("Token expired:", error);
    }
    return Promise.reject(error);
  }
);

export default api;