import axios from 'axios';

const apiClient = axios.create({
  withCredentials: true, // Ensure cookies are sent with requests
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Request a new access token using the refresh token stored in cookies
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        // Reattempt the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
