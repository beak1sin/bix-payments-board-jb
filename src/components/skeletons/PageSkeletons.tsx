import {
  Skeleton,
  SkeletonTitle,
  SkeletonText,
  SkeletonInput,
  SkeletonTextarea,
  SkeletonButton,
  SkeletonTableRow,
} from "./Skeleton";

// 게시글 상세 페이지 Skeleton
export function BoardDetailSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* 카테고리 & 제목 */}
          <div className="mb-6">
            <Skeleton className="h-6 w-16 rounded mb-4" />
            <SkeletonTitle className="w-2/3 mb-2" />
            <SkeletonText className="w-32" />
          </div>

          {/* 이미지 placeholder */}
          <Skeleton className="h-64 w-full rounded-lg mb-6" />

          {/* 본문 */}
          <div className="space-y-3 mb-8">
            <SkeletonText className="w-full" />
            <SkeletonText className="w-full" />
            <SkeletonText className="w-5/6" />
            <SkeletonText className="w-4/6" />
            <SkeletonText className="w-full" />
            <SkeletonText className="w-3/4" />
          </div>

          {/* 버튼 */}
          <div className="flex justify-between items-center pt-6 border-t border-white/10">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-3">
              <SkeletonButton />
              <SkeletonButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 게시글 수정/작성 폼 Skeleton
export function BoardFormSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <SkeletonTitle className="w-24 mb-8" />

          <div className="space-y-6">
            {/* 카테고리 */}
            <div>
              <SkeletonText className="w-16 mb-2" />
              <SkeletonInput />
            </div>

            {/* 제목 */}
            <div>
              <SkeletonText className="w-12 mb-2" />
              <SkeletonInput />
            </div>

            {/* 내용 */}
            <div>
              <SkeletonText className="w-12 mb-2" />
              <SkeletonTextarea />
            </div>

            {/* 파일 업로드 */}
            <div>
              <SkeletonText className="w-28 mb-2" />
              <SkeletonButton className="w-20" />
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 pt-4">
              <SkeletonButton />
              <SkeletonButton className="w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 게시글 목록 테이블 Skeleton
export function BoardListSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
      <table className="w-full">
        <thead className="bg-white/5">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 w-24">
              카테고리
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
              제목
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 w-40">
              작성일
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300 w-32">
              관리
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonTableRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
