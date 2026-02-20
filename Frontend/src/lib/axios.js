import { logoutUser } from "@/store/authSlice";
import { store } from "@/store/store";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.DEV
  ? "http://localhost:3000/api/v1"
  : "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logoutUser());
    }

    return Promise.reject(error);
  }
);

export default api;