import { useQuery } from "@tanstack/react-query";
import { getBoard } from "../api/board";

export const useBoard = (id: number | undefined) => {
  return useQuery({
    queryKey: ["board", id],
    queryFn: () => getBoard(id!),
    enabled: !!id,
  });
};
