interface SkeletonProps {
  className?: string;
}

// 기본 Skeleton (펄스 애니메이션 적용)
export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse bg-white/10 rounded ${className}`} />;
}

// 텍스트 라인 Skeleton
export function SkeletonText({ className = "" }: SkeletonProps) {
  return <Skeleton className={`h-4 ${className}`} />;
}

// 제목 Skeleton
export function SkeletonTitle({ className = "" }: SkeletonProps) {
  return <Skeleton className={`h-8 ${className}`} />;
}

// 버튼 Skeleton
export function SkeletonButton({ className = "" }: SkeletonProps) {
  return <Skeleton className={`h-10 w-24 rounded-lg ${className}`} />;
}

// 이미지 Skeleton
export function SkeletonImage({ className = "" }: SkeletonProps) {
  return <Skeleton className={`aspect-video rounded-lg ${className}`} />;
}

// 아바타 Skeleton
export function SkeletonAvatar({ className = "" }: SkeletonProps) {
  return <Skeleton className={`h-10 w-10 rounded-full ${className}`} />;
}

// Input Skeleton
export function SkeletonInput({ className = "" }: SkeletonProps) {
  return <Skeleton className={`h-12 w-full rounded-lg ${className}`} />;
}

// Textarea Skeleton
export function SkeletonTextarea({ className = "" }: SkeletonProps) {
  return <Skeleton className={`h-48 w-full rounded-lg ${className}`} />;
}

// 카드 Skeleton
export function SkeletonCard({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 ${className}`}
    >
      <SkeletonTitle className="w-1/3 mb-6" />
      <div className="space-y-3">
        <SkeletonText className="w-full" />
        <SkeletonText className="w-5/6" />
        <SkeletonText className="w-4/6" />
      </div>
    </div>
  );
}

// 테이블 Row Skeleton
export function SkeletonTableRow() {
  return (
    <tr className="border-b border-white/5">
      <td className="px-6 py-4">
        <Skeleton className="h-6 w-16 rounded" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-48" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-2">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
        </div>
      </td>
    </tr>
  );
}
