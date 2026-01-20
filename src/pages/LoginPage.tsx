import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../hooks/useAuthMutations";
import { useAuthStore } from "../stores/authStore";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();
  const loginMutation = useLogin();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.warning("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    loginMutation.mutate(formData, {
      onSuccess: (response) => {
        // JWT에서 사용자 정보 추출
        const payload = JSON.parse(atob(response.accessToken.split(".")[1]));
        const user = {
          username: payload.sub || payload.username,
          name: payload.name || payload.sub,
        };

        storeLogin(response.accessToken, response.refreshToken, user);
        navigate("/");
      },
      onError: () => {
        toast.error("아이디 또는 비밀번호가 올바르지 않습니다.");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md p-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            로그인
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                아이디 (이메일)
              </label>
              <input
                type="email"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loginMutation.isPending ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            계정이 없으신가요?{" "}
            <Link
              to="/signup"
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
