import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface RouteGuardProps {
  children: React.ReactNode;
}

// 인증 필요 라우트 래퍼
export function PrivateRoute({ children }: RouteGuardProps) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// 비인증 전용 라우트 래퍼 (로그인/회원가입)
export function PublicRoute({ children }: RouteGuardProps) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}
