import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Ensure cookies are sent with requests
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the access token has expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Request a new access token using the refresh token stored in cookies
        await apiClient.post('/api/auth/refresh', {}, { withCredentials: true });

        // Reattempt the original request 어세스토큰 갱신되었으면 원래 요청 다시시도
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 리프레시 갱신 실패시
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
