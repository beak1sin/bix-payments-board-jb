import axios from 'axios';
import type { LoginRequest, SignupRequest, AuthResponse } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 인증 API는 인터셉터 없이 기본 axios 사용
// (로그인/회원가입 실패 시 토큰 갱신 로직이 동작하지 않도록)

// 회원가입
export const signup = async (data: SignupRequest): Promise<void> => {
  await axios.post(`${API_BASE_URL}/auth/signup`, data);
};

// 로그인
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/signin`, data);
  return response.data;
};

// 토큰 갱신
export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/refresh`, { refreshToken });
  return response.data;
};
