import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AI_BASE_URL =
  import.meta.env.VITE_AI_API_URL || "http://localhost:8000";

const API = axios.create({
  baseURL: BASE_URL,
});

export const AI_API = axios.create({
  baseURL: AI_BASE_URL,
});

export default API;