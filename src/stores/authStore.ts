import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  
  // 액션
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

// JWT 디코딩 함수
// 외부 라이브러리(jwt-decode 등) 의존성을 줄이고, 간단한 페이로드 파싱을 위해 직접 구현
// Base64Url 인코딩을 처리하고 UTF-8 문자열을 올바르게 복원
export const decodeToken = (token: string): User | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);

    return {
      username: payload.sub || payload.username,
      name: payload.name || payload.sub,
    };
  } catch (e) {
    console.error("Token decode failed:", e);
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      login: (accessToken, refreshToken, user) => {
        set({
          isAuthenticated: true,
          accessToken,
          refreshToken,
          user,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          user: null,
        });
      },

      setTokens: (accessToken, refreshToken) => {
        const user = decodeToken(accessToken);
        set({
          accessToken,
          refreshToken,
          user,
        });
      },
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 키 이름
      // 저장할 상태 선택 (함수는 제외)
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
