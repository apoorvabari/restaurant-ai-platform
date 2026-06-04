import axios from 'axios';
import keycloak from '../config/keycloak';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor: always use the live token from the keycloak instance.
// ReactKeycloakProvider silently refreshes the token; reading keycloak.token
// here ensures we never send a stale/expired token.
axiosInstance.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated) {
      // If the token is about to expire in the next 30 seconds, refresh it first.
      try {
        await keycloak.updateToken(30);
      } catch {
        // If refresh fails (e.g. session ended), proceed with the current token.
        // The 401 response interceptor below will handle the logout flow.
      }
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: on 401 try one token refresh, then redirect to login.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshed = await keycloak.updateToken(5);
        if (refreshed) {
          originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
          return axiosInstance(originalRequest);
        }
      } catch {
        keycloak.login();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;