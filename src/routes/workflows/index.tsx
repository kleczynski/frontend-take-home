import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useWorkflows, useCreateWorkflow, useDeleteWorkflow } from "@/hooks/use-workflows";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, GitBranch } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/workflows/")({
  component: WorkflowListPage,
});

function WorkflowListPage() {
  const navigate = useNavigate();
  const { data: workflows, isLoading } = useWorkflows();
  const createWorkflow = useCreateWorkflow();
  const deleteWorkflow = useDeleteWorkflow();

  async function handleCreate() {
    try {
      const wf = await createWorkflow.mutateAsync({
        name: "Untitled Workflow",
        nodes: [],
        edges: [],
      });
      navigate({ to: "/workflows/$workflowId", params: { workflowId: wf.id } });
    } catch (err) {
      toast.error("Failed to create workflow", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  function handleDelete(id: string) {
    deleteWorkflow.mutate(id, {
      onError: (err) => {
        toast.error("Failed to delete workflow", {
          description: err.message,
        });
      },
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Workflows" description="Automate responses to sighting events">
        <Button onClick={handleCreate} disabled={createWorkflow.isPending}>
          <Plus className="mr-2 h-4 w-4" />
          {createWorkflow.isPending ? "Creating..." : "Create Workflow"}
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : workflows?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No workflows yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first workflow to automate sighting responses.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflows?.map((wf) => (
            <Card key={wf.id} className="group">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">{wf.name}</CardTitle>
                  {wf.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{wf.description}</p>
                  )}
                </div>
                <Badge variant={wf.is_active ? "default" : "secondary"}>
                  {wf.is_active ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {wf.nodes.length} nodes &middot; {formatDate(wf.created_at)}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        navigate({
                          to: "/workflows/$workflowId",
                          params: { workflowId: wf.id },
                        })
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={<Button variant="ghost" size="icon" className="h-8 w-8" />}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete &ldquo;{wf.name}&rdquo;. This action cannot
                            be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(wf.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
