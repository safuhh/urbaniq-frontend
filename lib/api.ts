import axios from 'axios';

// Get API base URL from environment variable or fallback to local
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the JWT token if present
api.interceptors.request.use(
  (config) => {
    // In Next.js, localStorage is only available in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('urbaniq_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
        const res = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
        
        const newToken = res.data.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('urbaniq_token', newToken);
        }
        
        // Update the authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear user session
        if (typeof window !== 'undefined') {
          localStorage.removeItem('urbaniq_token');
          localStorage.removeItem('urbaniq_user');
          // Optionally redirect to login page
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
