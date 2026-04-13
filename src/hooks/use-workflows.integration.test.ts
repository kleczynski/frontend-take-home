import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { useWorkflows, useWorkflow, useCreateWorkflow, useDeleteWorkflow } from "./use-workflows";
import { mockWorkflows } from "@/test/mocks/data";
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

describe("useWorkflows (integration with MSW)", () => {
  it("fetches all workflows", async () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useWorkflows(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(mockWorkflows.length);
    expect(result.current.data?.[0].name).toBe("Flag rare night sightings");
  });
});

describe("useWorkflow (integration with MSW)", () => {
  it("fetches a single workflow by ID", async () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useWorkflow("wf-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.name).toBe("Flag rare night sightings");
    expect(result.current.data?.nodes).toHaveLength(2);
    expect(result.current.data?.edges).toHaveLength(1);
  });

  it("returns error for non-existent workflow", async () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useWorkflow("wf-nonexistent"), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useCreateWorkflow (integration with MSW)", () => {
  it("creates a new workflow", async () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useCreateWorkflow(), { wrapper });

    result.current.mutate({
      name: "New Workflow",
      nodes: [],
      edges: [],
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.name).toBe("New Workflow");
    expect(result.current.data?.id).toBeDefined();
    expect(result.current.data?.nodes).toEqual([]);
    expect(result.current.data?.edges).toEqual([]);
  });
});

describe("useDeleteWorkflow (integration with MSW)", () => {
  it("deletes a workflow", async () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useDeleteWorkflow(), { wrapper });

    result.current.mutate("wf-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("handles server error on delete", async () => {
    server.use(
      http.delete("/api/workflows/:id", () => {
        return HttpResponse.json({ detail: "Cannot delete" }, { status: 403 });
      }),
    );

    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useDeleteWorkflow(), { wrapper });

    result.current.mutate("wf-1");

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
