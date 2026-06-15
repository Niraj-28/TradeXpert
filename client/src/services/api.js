import axios from "axios";

export const BASE_API_URL = import.meta.env.VITE_SOCKET_URL 
  ? `${import.meta.env.VITE_SOCKET_URL}/api` 
  : "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_API_URL,
});

export default API;