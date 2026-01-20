// 게시글 카테고리
export type BoardCategory = 'NOTICE' | 'FREE' | 'QNA' | 'ETC';

// 게시글 상세 (GET /boards/:id)
export interface Board {
  id: number;
  title: string;
  content: string;
  boardCategory: BoardCategory;
  imageUrl?: string;
  createdAt: string;
}

// 게시글 목록 아이템 (GET /boards)
export interface BoardListItem {
  id: number;
  title: string;
  category: BoardCategory; // 목록 조회 시 category
  createdAt: string;
}

// 페이지네이션 정보
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  offset: number;
  unpaged: boolean;
  paged: boolean;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
}

// 게시글 목록 응답 (페이지네이션)
export interface BoardListResponse {
  content: BoardListItem[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
}

// 게시글 작성 요청
export interface BoardCreateRequest {
  title: string;
  content: string;
  category: BoardCategory;
  file?: File;
}

// 게시글 수정 요청
export interface BoardUpdateRequest {
  title: string;
  content: string;
  category: BoardCategory;
  file?: File;
}
