import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Workflow, WorkflowCreate, WorkflowUpdate } from "@/types/workflow";

export const workflowKeys = {
  all: ["workflows"] as const,
  detail: (id: string) => [...workflowKeys.all, id] as const,
};

export function useWorkflows() {
  return useQuery({
    queryKey: workflowKeys.all,
    queryFn: () => api.get<Workflow[]>("/workflows"),
  });
}

export function useWorkflow(id: string) {
  return useQuery({
    queryKey: workflowKeys.detail(id),
    queryFn: () => api.get<Workflow>(`/workflows/${id}`),
  });
}

export function useCreateWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkflowCreate) => api.post<Workflow>("/workflows", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: workflowKeys.all }),
  });
}

export function useUpdateWorkflow(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkflowUpdate) => api.put<Workflow>(`/workflows/${id}`, data),
    onSuccess: (updated) => {
      qc.setQueryData(workflowKeys.detail(id), updated);
      qc.invalidateQueries({ queryKey: workflowKeys.all });
    },
  });
}

export function useDeleteWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/workflows/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: workflowKeys.all }),
  });
}
