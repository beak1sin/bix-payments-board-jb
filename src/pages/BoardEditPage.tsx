import { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useBoard } from "../hooks/useBoard";
import { useUpdateBoard } from "../hooks/useBoardMutations";
import { useCategories } from "../hooks/useCategories";
import type { BoardCategory, Board } from "../types/board";
import { BoardFormSkeleton } from "../components/skeletons";
import { toast } from "sonner";

export default function BoardEditPage() {
  const { id } = useParams<{ id: string }>();

  const { data: board, isLoading: isFetching } = useBoard(
    id ? Number(id) : undefined
  );

  if (isFetching) {
    return <BoardFormSkeleton />;
  }

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white">게시글을 찾을 수 없습니다.</div>
      </div>
    );
  }

  // board가 확실히 존재할 때만 BoardEditForm을 렌더링
  // 이렇게 하면 BoardEditForm에서 board 데이터를 초기값으로 바로 사용 가능
  return <BoardEditForm board={board} />;
}

function BoardEditForm({ board }: { board: Board }) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateBoard = useUpdateBoard();
  const { data: categoriesData = {} } = useCategories();

  // API 응답을 select용 배열로 변환
  const categories = Object.entries(categoriesData).map(([value, label]) => ({
    value: value as BoardCategory,
    label,
  }));

  // board 데이터를 useState 초기값으로 직접 사용 (useEffect 불필요)
  const [formData, setFormData] = useState({
    title: board.title,
    content: board.content,
    category: board.boardCategory,
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(
    board.imageUrl ?? null
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setExistingImage(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setExistingImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.warning("제목과 내용을 입력해주세요.");
      return;
    }

    updateBoard.mutate(
      {
        id: board.id,
        data: {
          ...formData,
          file: file || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("게시글이 수정되었습니다.");
          navigate(`/boards/${board.id}`);
        },
        onError: () => {
          toast.error("게시글 수정에 실패했습니다.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8">글 수정</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                카테고리
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              >
                {categories.map((cat) => (
                  <option
                    key={cat.value}
                    value={cat.value}
                    className="bg-slate-800"
                  >
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                제목
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={255}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="제목을 입력하세요"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {formData.title.length} / 255
              </div>
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                내용
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={10}
                maxLength={255}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                placeholder="내용을 입력하세요"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {formData.content.length} / 255
              </div>
            </div>

            {/* 파일 업로드 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                이미지 첨부 (선택)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition"
              >
                파일 선택
              </button>
              {(preview || existingImage) && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={
                      preview ||
                      (existingImage
                        ? `${import.meta.env.VITE_API_BASE_URL}${existingImage}`
                        : "")
                    }
                    alt="미리보기"
                    className="max-w-xs rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 pt-4">
              <Link
                to={`/boards/${board.id}`}
                className="px-6 py-3 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={updateBoard.isPending}
                className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {updateBoard.isPending ? "저장 중..." : "수정"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
