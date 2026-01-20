import api from './axios';
import type { Board, BoardListResponse, BoardCreateRequest, BoardUpdateRequest } from '../types/board';

// 게시글 목록 조회 (페이지네이션)
export const getBoards = async (page: number = 0, size: number = 10): Promise<BoardListResponse> => {
  const response = await api.get<BoardListResponse>('/boards', {
    params: { page, size },
  });
  return response.data;
};

// 카테고리 목록 조회
export const getCategories = async (): Promise<Record<string, string>> => {
  const response = await api.get<Record<string, string>>('/boards/categories');
  return response.data;
};

// 게시글 상세 조회
export const getBoard = async (id: number): Promise<Board> => {
  const response = await api.get<Board>(`/boards/${id}`);
  return response.data;
};

// 게시글 작성
export const createBoard = async (data: BoardCreateRequest): Promise<Board> => {
  const formData = new FormData();
  formData.append('request', new Blob([JSON.stringify({
    title: data.title,
    content: data.content,
    category: data.category,
  })], { type: 'application/json' }));
  
  if (data.file) {
    formData.append('file', data.file);
  }

  const response = await api.post<Board>('/boards', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 게시글 수정
export const updateBoard = async (id: number, data: BoardUpdateRequest): Promise<Board> => {
  const formData = new FormData();
  formData.append('request', new Blob([JSON.stringify({
    title: data.title,
    content: data.content,
    category: data.category,
  })], { type: 'application/json' }));
  
  if (data.file) {
    formData.append('file', data.file);
  }

  const response = await api.patch<Board>(`/boards/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 게시글 삭제
export const deleteBoard = async (id: number): Promise<void> => {
  await api.delete(`/boards/${id}`);
};
