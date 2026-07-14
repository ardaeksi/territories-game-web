import axios from "axios";

// Derived from the page's own hostname, not hardcoded, so LAN peers work too.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? `https://${window.location.hostname}:8443`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
