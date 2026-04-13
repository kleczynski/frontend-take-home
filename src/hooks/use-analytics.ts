import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { AnalyticsSummary } from "@/types/analytics";

export interface AnalyticsFilters {
  region?: string;
  date_from?: string;
  date_to?: string;
}

export function useAnalyticsSummary(filters: AnalyticsFilters) {
  const params = new URLSearchParams();
  if (filters.region) params.set("region", filters.region);
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);
  const qs = params.toString();
  return useQuery({
    queryKey: ["analytics", "summary", filters],
    queryFn: () => api.get<AnalyticsSummary>(`/analytics/summary${qs ? `?${qs}` : ""}`),
    placeholderData: keepPreviousData,
  });
}
