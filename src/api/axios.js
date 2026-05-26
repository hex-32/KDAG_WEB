import axios from "axios";

const api = axios.create({
  baseURL: "https://kdagweb-production.up.railway.app",
  timeout: 8000,
});

export default api;

