import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { SightingListResponse, SightingCreate, Sighting } from "@/types/sighting";

export interface SightingFilters {
  pokemon_id?: number;
  region?: string;
  weather?: string;
  time_of_day?: string;
  date_from?: string;
  date_to?: string;
  limit: number;
  offset: number;
}

function buildQueryString(filters: SightingFilters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "" && value !== null) {
      params.set(key, String(value));
    }
  }
  return params.toString();
}

export const sightingKeys = {
  all: ["sightings"] as const,
  list: (filters: SightingFilters) => [...sightingKeys.all, "list", filters] as const,
};

export function useSightings(filters: SightingFilters) {
  return useQuery({
    queryKey: sightingKeys.list(filters),
    queryFn: () => api.get<SightingListResponse>(`/sightings?${buildQueryString(filters)}`),
    placeholderData: keepPreviousData,
  });
}

export function useCreateSighting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, rangerId }: { data: SightingCreate; rangerId: string }) =>
      api.post<Sighting>("/sightings", data, { "X-User-ID": rangerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sightingKeys.all });
    },
  });
}

export function useDeleteSighting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/sightings/${id}`),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: sightingKeys.all });
      const previousQueries = queryClient.getQueriesData<SightingListResponse>({
        queryKey: sightingKeys.all,
      });
      queryClient.setQueriesData<SightingListResponse>({ queryKey: sightingKeys.all }, (old) => {
        if (!old) return old;
        return {
          ...old,
          total: old.total - 1,
          items: old.items.filter((s) => s.id !== deletedId),
        };
      });
      return { previousQueries };
    },
    onError: (_err, _id, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: sightingKeys.all });
    },
  });
}
