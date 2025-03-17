import axios from "axios";

// const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8082/api/";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
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
      localStorage.removeItem("token");
      console.error("Token expired:", error);
    }
    return Promise.reject(error);
  }
);

export default api;
