import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/board";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // 1시간 캐싱 (카테고리는 자주 변경되지 않음)
  });
};
