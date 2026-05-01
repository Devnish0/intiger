import axios from "axios";
const MODE = "production";
let baseURL = MODE === "production" ? "https://intiger.onrender.com" : "/";
const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
export default api;
