// 로그인 요청
export interface LoginRequest {
  username: string;
  password: string;
}

// 회원가입 요청
export interface SignupRequest {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
}

// 인증 응답
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

// 사용자 정보 (JWT 디코딩)
export interface User {
  username: string;
  name: string;
}
