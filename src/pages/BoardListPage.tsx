import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useBoards } from "../hooks/useBoards";
import { useDeleteBoard } from "../hooks/useBoardMutations";
import { useCategories } from "../hooks/useCategories";
import { useAuthStore } from "../stores/authStore";
import { useAlertStore } from "@/stores/alertStore";
import type { BoardCategory } from "../types/board";
import { BoardListSkeleton } from "../components/skeletons";
import { useFormatDate } from "../hooks/useFormatDate";
import { toast } from "sonner";

const categoryColors: Record<BoardCategory, string> = {
  NOTICE: "bg-red-500/20 text-red-400",
  FREE: "bg-blue-500/20 text-blue-400",
  QNA: "bg-green-500/20 text-green-400",
  ETC: "bg-gray-500/20 text-gray-400",
};

export default function BoardListPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { openConfirm } = useAlertStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const formatDate = useFormatDate();
  const { data: categories = {} } = useCategories();
  // 페이지네이션 상태를 URL 쿼리 파라미터('page')와 동기화
  // 장점: 새로고침해도 현재 페이지 유지, 특정 페이지 링크 공유 가능 (Deep Linking)
  const pageParam = searchParams.get("page");

  // URL은 1-based index (사용자 친화적), API는 0-based index
  // page=1 -> API call page=0
  const currentPage = pageParam ? Number(pageParam) - 1 : 0;

  const { data, isLoading } = useBoards(currentPage, 10);
  const deleteBoard = useDeleteBoard();

  const boards = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleDelete = (id: number) => {
    openConfirm({
      title: "삭제 확인",
      description: "정말 이 게시글을 삭제하시겠습니까?",
      onConfirm: () => {
        deleteBoard.mutate(id, {
          onSuccess: () => {
            toast.success("게시글이 삭제되었습니다.");
          },
          onError: (error) => {
            console.error("게시글 삭제 실패:", error);
            toast.error("삭제에 실패했습니다.");
          },
        });
      },
    });
  };

  const handleLogout = () => {
    logout();
    toast.success("로그아웃되었습니다.");
    navigate("/login");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            로그인이 필요합니다
          </h1>
          <Link
            to="/login"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 헤더 */}
      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">게시판</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">
              <span className="text-purple-400 font-semibold">
                {user?.name}
              </span>
              님 환영합니다
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-300 hover:text-white transition"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 글쓰기 버튼 */}
        <div className="flex justify-end mb-6">
          <Link
            to="/boards/new"
            className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            글쓰기
          </Link>
        </div>

        {/* 게시글 목록 */}
        {isLoading ? (
          <BoardListSkeleton />
        ) : boards.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            게시글이 없습니다. 첫 번째 글을 작성해보세요!
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-2 py-3 md:px-6 md:py-4 text-center text-xs md:text-sm font-semibold text-gray-300 whitespace-nowrap w-16 md:w-30">
                    카테고리
                  </th>
                  <th className="px-2 py-3 md:px-6 md:py-4 text-center text-xs md:text-sm font-semibold text-gray-300 whitespace-nowrap">
                    제목
                  </th>
                  <th className="px-2 py-3 md:px-6 md:py-4 text-center text-xs md:text-sm font-semibold text-gray-300 whitespace-nowrap w-24 md:w-40">
                    작성일
                  </th>
                  <th className="px-2 py-3 md:px-6 md:py-4 text-center text-xs md:text-sm font-semibold text-gray-300 whitespace-nowrap w-20 md:w-32">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {boards.map((board) => (
                  <tr key={board.id} className="hover:bg-white/5 transition">
                    <td className="px-2 py-3 md:px-6 md:py-4 text-center whitespace-nowrap">
                      <span
                        className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[10px] md:text-xs font-medium ${categoryColors[board.category]}`}
                      >
                        {categories[board.category] || board.category}
                      </span>
                    </td>
                    <td className="px-2 py-3 md:px-6 md:py-4 max-w-[100px] sm:max-w-[200px] md:max-w-md whitespace-nowrap">
                      <Link
                        to={`/boards/${board.id}`}
                        className="text-white hover:text-purple-400 transition block truncate text-xs md:text-base"
                      >
                        {board.title}
                      </Link>
                    </td>
                    <td className="px-2 py-3 md:px-6 md:py-4 text-center text-gray-400 text-[10px] md:text-sm whitespace-nowrap">
                      {formatDate(board.createdAt)}
                    </td>
                    <td className="px-2 py-3 md:px-6 md:py-4 text-center whitespace-nowrap">
                      <Link
                        to={`/boards/${board.id}/edit`}
                        className="text-purple-400 hover:text-purple-300 text-[10px] md:text-sm mr-2 md:mr-3"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(board.id)}
                        className="text-red-400 hover:text-red-300 text-[10px] md:text-sm"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setSearchParams({ page: String(currentPage) })} // 현재(0-based)가 1이면 page=1 (이전 페이지)
              disabled={currentPage === 0}
              className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setSearchParams({ page: String(i + 1) })}
                className={`px-4 py-2 rounded-lg transition ${
                  i === currentPage
                    ? "bg-purple-600 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setSearchParams({ page: String(currentPage + 2) })} // 현재(0-based)가 0이면 다음은 2페이지(1-based)
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition"
            >
              다음
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
