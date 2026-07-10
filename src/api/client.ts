import axios from "axios";

// Falls back to the current page's own hostname (not a hardcoded "localhost") so this
// works unchanged whether the page was loaded via localhost or a LAN peer's IP address -
// hardcoding localhost here would silently break every machine except the host itself.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? `https://${window.location.hostname}:8443`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
