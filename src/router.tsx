import { createBrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "./components/RouteGuards";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BoardListPage from "./pages/BoardListPage";
import BoardDetailPage from "./pages/BoardDetailPage";
import BoardCreatePage from "./pages/BoardCreatePage";
import BoardEditPage from "./pages/BoardEditPage";

export const router = createBrowserRouter([
  // 인증 페이지
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    ),
  },

  // 게시판 페이지
  {
    path: "/",
    element: (
      <PrivateRoute>
        <BoardListPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/boards/new",
    element: (
      <PrivateRoute>
        <BoardCreatePage />
      </PrivateRoute>
    ),
  },
  {
    path: "/boards/:id",
    element: (
      <PrivateRoute>
        <BoardDetailPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/boards/:id/edit",
    element: (
      <PrivateRoute>
        <BoardEditPage />
      </PrivateRoute>
    ),
  },

  // 404 - 메인으로 리다이렉트
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
