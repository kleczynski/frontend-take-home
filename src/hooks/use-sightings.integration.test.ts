import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { useSightings, useCreateSighting, useDeleteSighting } from "./use-sightings";
import { mockSightings } from "@/test/mocks/data";
import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return {
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children),
    queryClient,
  };
}

describe("useSightings (integration with MSW)", () => {
  it("fetches sightings from the API", async () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useSightings({ limit: 50, offset: 0 }), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toHaveLength(mockSightings.length);
    expect(result.current.data?.items[0].pokemon_name).toBe("Pikachu");
    expect(result.current.data?.total).toBe(mockSightings.length);
  });

  it("filters sightings by region", async () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useSightings({ region: "Kanto", limit: 50, offset: 0 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const kantoSightings = mockSightings.filter((s) => s.region === "Kanto");
    expect(result.current.data?.items).toHaveLength(kantoSightings.length);
    result.current.data?.items.forEach((item) => {
      expect(item.region).toBe("Kanto");
    });
  });

  it("filters sightings by pokemon_id", async () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useSightings({ pokemon_id: 25, limit: 50, offset: 0 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.items[0].pokemon_name).toBe("Pikachu");
  });

  it("respects pagination parameters", async () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useSightings({ limit: 1, offset: 0 }), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.limit).toBe(1);
    expect(result.current.data?.offset).toBe(0);
  });
});

describe("useCreateSighting (integration with MSW)", () => {
  it("creates a sighting with X-User-ID header", async () => {
    const { wrapper, queryClient } = createWrapper();

    // Pre-populate sightings cache
    queryClient.setQueryData(["sightings"], { items: [], total: 0 });

    const { result } = renderHook(() => useCreateSighting(), { wrapper });

    result.current.mutate({
      data: {
        pokemon_id: 25,
        region: "Kanto",
        route: "Route 1",
        date: "2024-06-15T10:30:00Z",
        weather: "sunny",
        time_of_day: "morning",
        height: 0.4,
        weight: 6.0,
      },
      rangerId: "ranger-1",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.region).toBe("Kanto");
    expect(result.current.data?.ranger_id).toBe("ranger-1");
  });

  it("fails when X-User-ID is missing", async () => {
    // Override the handler to simulate the real backend behavior
    server.use(
      http.post("/api/sightings", ({ request }) => {
        const userId = request.headers.get("X-User-ID");
        if (!userId) {
          return HttpResponse.json({ detail: "X-User-ID header is required" }, { status: 401 });
        }
        return HttpResponse.json({}, { status: 201 });
      }),
    );

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useCreateSighting(), { wrapper });

    result.current.mutate({
      data: {
        pokemon_id: 25,
        region: "Kanto",
        route: "Route 1",
        date: "2024-06-15T10:30:00Z",
        weather: "sunny",
        time_of_day: "morning",
        height: 0.4,
        weight: 6.0,
      },
      rangerId: "",
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useDeleteSighting (integration with MSW)", () => {
  it("deletes a sighting and invalidates cache", async () => {
    const { wrapper, queryClient } = createWrapper();

    // Pre-populate cache with sightings
    const cacheKey = ["sightings", "list", { limit: 50, offset: 0 }];
    queryClient.setQueryData(cacheKey, {
      total: 3,
      limit: 50,
      offset: 0,
      items: [...mockSightings],
    });

    const { result } = renderHook(() => useDeleteSighting(), { wrapper });

    result.current.mutate("sight-1");

    // Optimistic update should remove the item immediately
    await waitFor(() => {
      const cached = queryClient.getQueryData(cacheKey) as { items: { id: string }[] } | undefined;
      expect(cached?.items.find((s) => s.id === "sight-1")).toBeUndefined();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("reports error when server returns 500", async () => {
    server.use(
      http.delete("/api/sightings/:id", () => {
        return HttpResponse.json({ detail: "Server error" }, { status: 500 });
      }),
    );

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useDeleteSighting(), { wrapper });

    result.current.mutate("sight-1");

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Server error");
  });
});
