import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useSignup } from "../hooks/useAuthMutations";
import { toast } from "sonner";

export default function SignupPage() {
  const navigate = useNavigate();
  const signupMutation = useSignup();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.name ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.warning("모든 필드를 입력해주세요.");
      return false;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.username)) {
      toast.warning("올바른 이메일 형식을 입력해주세요.");
      return false;
    }

    // 비밀번호 검증 (8자 이상, 영문/숫자/특수문자 포함)
    // 사용자 편의성을 위해 특정 특수문자 제한을 두지 않고 모든 특수문자 허용 (\W_)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.warning(
        "비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다."
      );
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.warning("비밀번호가 일치하지 않습니다.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    signupMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("회원가입이 완료되었습니다. 로그인해주세요.");
        navigate("/login");
      },
      onError: (err: Error) => {
        if (axios.isAxiosError(err) && err.response?.status === 409) {
          toast.error("이미 사용 중인 이메일입니다.");
        } else {
          toast.error("회원가입에 실패했습니다. 다시 시도해주세요.");
        }
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="w-full max-w-md p-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            회원가입
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                이메일
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
                이름
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="홍길동"
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
                placeholder="8자 이상, 영문/숫자/특수문자 포함"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="비밀번호를 다시 입력해주세요"
              />
            </div>

            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {signupMutation.isPending ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            이미 계정이 있으신가요?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
