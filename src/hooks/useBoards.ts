import { useQuery } from "@tanstack/react-query";
import { getBoards } from "../api/board";

export const useBoards = (page: number, size: number = 10) => {
  return useQuery({
    queryKey: ["boards", page, size],
    queryFn: () => getBoards(page, size),
  });
};
