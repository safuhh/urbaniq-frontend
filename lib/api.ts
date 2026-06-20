import axios from 'axios';

// Get API base URL from environment variable or fallback to local
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to handle FormData
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Let the browser set the Content-Type with the boundary automatically
    delete config.headers['Content-Type'];
  }
  return config;
});

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token using the HttpOnly cookie
        await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
        
        // Retry original request since browser will automatically attach the new cookie
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear user session
        if (typeof window !== 'undefined') {
          // No need to clear localStorage, just redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default api;
