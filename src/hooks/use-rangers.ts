import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Ranger } from "@/types/ranger";

export function useRangers() {
  return useQuery({
    queryKey: ["rangers"],
    queryFn: () => api.get<Ranger[]>("/rangers"),
    staleTime: Infinity,
  });
}
