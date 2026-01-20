import { useParams, useNavigate, Link } from "react-router-dom";
import { useBoard } from "../hooks/useBoard";
import { useDeleteBoard } from "../hooks/useBoardMutations";
import { useCategories } from "../hooks/useCategories";
import type { BoardCategory } from "../types/board";
import { BoardDetailSkeleton } from "../components/skeletons";
import { useAuthStore } from "../stores/authStore";
import { useAlertStore } from "@/stores/alertStore";
import { useFormatDate } from "../hooks/useFormatDate";
import { toast } from "sonner";

const categoryColors: Record<BoardCategory, string> = {
  NOTICE: "bg-red-500/20 text-red-400",
  FREE: "bg-blue-500/20 text-blue-400",
  QNA: "bg-green-500/20 text-green-400",
  ETC: "bg-gray-500/20 text-gray-400",
};

export default function BoardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { openConfirm } = useAlertStore();
  const deleteBoard = useDeleteBoard();
  const formatDate = useFormatDate();
  const { data: categories = {} } = useCategories();

  const {
    data: board,
    isLoading,
    isError,
  } = useBoard(id ? Number(id) : undefined);

  const handleDelete = () => {
    if (!id) return;

    openConfirm({
      title: "삭제 확인",
      description: "정말 이 게시글을 삭제하시겠습니까?",
      onConfirm: () => {
        deleteBoard.mutate(Number(id), {
          onSuccess: () => {
            toast.success("게시글이 삭제되었습니다.");
            navigate("/");
          },
          onError: () => {
            toast.error("삭제에 실패했습니다.");
          },
        });
      },
    });
  };

  if (isLoading) {
    return <BoardDetailSkeleton />;
  }

  if (isError || !board) {
    toast.error("게시글을 찾을 수 없습니다.");
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <p className="text-red-400 mb-4">게시글을 찾을 수 없습니다.</p>
          <Link to="/" className="text-purple-400 hover:text-purple-300">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* 헤더 */}
          <div className="border-b border-white/10 pb-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border border-white/10 ${
                  categoryColors[board.boardCategory]
                }`}
              >
                {categories[board.boardCategory] || board.boardCategory}
              </span>
              <span className="text-gray-400 text-sm">
                {formatDate(board.createdAt, "full")}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              {board.title}
            </h1>
            <div className="flex items-center justify-end">
              {/* 버튼 */}
              {isAuthenticated && (
                <div className="flex gap-3">
                  <Link
                    to={`/boards/${id}/edit`}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    수정
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 이미지 */}
          {board.imageUrl && (
            <div className="mb-6">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${board.imageUrl}`}
                alt={board.title}
                className="max-w-full rounded-lg"
              />
            </div>
          )}

          {/* 본문 */}
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {board.content}
            </p>
          </div>

          {/* 목록으로 버튼 */}
          <div className="flex justify-start pt-6 border-t border-white/10">
            <Link to="/" className="text-gray-400 hover:text-white transition">
              ← 목록으로
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
