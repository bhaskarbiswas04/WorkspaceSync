import axios from "axios";

let accessToken = null;
let refreshPromise = null;
let onAuthenticationFailure = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Register a callback to clear Redux authentication state
export const setAuthenticationFailureHandler = (callback) => {
  onAuthenticationFailure = callback;
};

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate client prevents refresh requests from triggering
// the same response interceptor.
const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Response interceptor
// we management
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const excludedEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/auth/logout",
    ];

    const requestUrl = originalRequest.url || "";

    const isAuthEndpoint = excludedEndpoints.some((endpoint) =>
      requestUrl.includes(endpoint),
    );

    if (isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Multiple simultaneous 401 responses share one refresh request.
      if (!refreshPromise) {
        refreshPromise = refreshClient
          .post("/auth/refresh")
          .then(({ data }) => {
            setAccessToken(data.accessToken);
            return data.accessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // Retry the original request with the refreshed token.
      return api(originalRequest);
    } catch (refreshError) {
      setAccessToken(null);
      onAuthenticationFailure?.();

      return Promise.reject(refreshError);
    }
  },
);

export default api;