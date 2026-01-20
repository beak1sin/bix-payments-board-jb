import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { API_BASE_URL };

// 요청 인터셉터 - 토큰 자동 첨부
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 토큰 만료 시 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 401 Unauthorized 또는 CORS/Network 에러 발생 시 토큰 갱신 시도
    // (개발 환경에서 CORS 에러로 인해 status 응답이 없을 수 있음을 방어적으로 처리)
    const isAuthError = error.response?.status === 401 || (error.code === 'ERR_NETWORK' && !error.response);

    // _retry 플래그를 확인하여 무한 재시도 루프 방지 (1회만 시도)
    if (isAuthError && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = useAuthStore.getState();
        
        // 리프레시 토큰이 없으면 갱신 불가능하므로 즉시 실패 처리
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data;
        
        // Zustand 스토어 업데이트 (자동으로 localStorage에 persist)
        // refreshToken이 갱신되어 내려오는 경우도 고려 (없으면 기존 값 유지)
        const newRefreshToken = response.data.refreshToken || refreshToken;
        useAuthStore.getState().setTokens(accessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 갱신 실패 시 로그아웃 처리
        console.error("Token refresh failed:", refreshError);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
