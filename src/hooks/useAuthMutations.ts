import { useMutation } from "@tanstack/react-query";
import { login, signup } from "../api/auth";
import type { LoginRequest, SignupRequest } from "../types/auth";
import { useAuthStore, decodeToken } from "../stores/authStore";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      // 로그인 성공 시 토큰 저장 및 사용자 정보 디코딩
      const { accessToken, refreshToken } = data;
      const user = decodeToken(accessToken);
      
      if (user) {
        useAuthStore.getState().login(accessToken, refreshToken, user);
      }
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupRequest) => signup(data),
  });
};
