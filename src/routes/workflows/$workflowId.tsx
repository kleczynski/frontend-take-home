import { useState, useCallback, useEffect, useRef, type DragEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkflow, useUpdateWorkflow } from "@/hooks/use-workflows";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { TriggerNode } from "./-components/nodes/trigger-node";
import { FilterNode } from "./-components/nodes/filter-node";
import { ActionNode } from "./-components/nodes/action-node";
import { NodePalette } from "./-components/node-palette";
import { ConfigPanel } from "./-components/config-panel";
import { AnimatedEdge } from "./-components/animated-edge";
import {
  convertToRFNodes,
  convertToRFEdges,
  convertFromRFNodes,
  convertFromRFEdges,
  defaultNodeData,
} from "@/lib/workflow-utils";

export const Route = createFileRoute("/workflows/$workflowId")({
  component: () => (
    <ReactFlowProvider>
      <WorkflowEditorPage />
    </ReactFlowProvider>
  ),
});

const nodeTypes = {
  trigger: TriggerNode,
  filter: FilterNode,
  action: ActionNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

function WorkflowEditorPage() {
  const { workflowId } = Route.useParams();
  const { data: workflow, isLoading } = useWorkflow(workflowId);
  const updateMutation = useUpdateWorkflow(workflowId);
  const reactFlowInstance = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [workflowName, setWorkflowName] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialized = useRef(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const nodeIdCounter = useRef(0);

  useEffect(() => {
    if (workflow && !initialized.current) {
      const rfNodes = convertToRFNodes(workflow.nodes);
      // Inject onDelete callback into each node's data
      const nodesWithDelete = rfNodes.map((n) => ({
        ...n,
        data: { ...n.data, onDelete: deleteNode },
      }));
      setNodes(nodesWithDelete);
      setEdges(convertToRFEdges(workflow.edges));
      setWorkflowName(workflow.name);
      nodeIdCounter.current = workflow.nodes.length;
      initialized.current = true;
    }
  }, [workflow, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, id: `edge-${Date.now()}`, type: "animated" }, eds));
      setHasUnsavedChanges(true);
    },
    [setEdges],
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  function generateNodeId() {
    nodeIdCounter.current += 1;
    return `node-${Date.now()}-${nodeIdCounter.current}`;
  }

  function addNode(type: "trigger" | "filter" | "action", position?: { x: number; y: number }) {
    const pos = position ?? {
      x: Math.random() * 300 + 100,
      y: Math.random() * 300 + 100,
    };
    const newNode: Node = {
      id: generateNodeId(),
      type,
      position: pos,
      data: { ...defaultNodeData[type], onDelete: deleteNode },
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(newNode);
    setHasUnsavedChanges(true);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    const type = e.dataTransfer.getData("application/reactflow") as "trigger" | "filter" | "action";
    if (!type || !reactFlowWrapper.current) return;

    const position = reactFlowInstance.screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });
    addNode(type, position);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function updateNodeData(nodeId: string, data: Record<string, unknown>) {
    setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data } : n)));
    setSelectedNode((prev) => (prev?.id === nodeId ? { ...prev, data } : prev));
    setHasUnsavedChanges(true);
  }

  function deleteNode(nodeId: string) {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
    setHasUnsavedChanges(true);
  }

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      deleted.forEach((n) => {
        setEdges((eds) => eds.filter((e) => e.source !== n.id && e.target !== n.id));
      });
      setHasUnsavedChanges(true);
    },
    [setEdges],
  );

  function handleSave() {
    updateMutation.mutate(
      {
        name: workflowName,
        nodes: convertFromRFNodes(nodes),
        edges: convertFromRFEdges(edges),
      },
      {
        onSuccess: () => {
          setHasUnsavedChanges(false);
          toast.success("Workflow saved");
        },
        onError: (err) => {
          toast.error("Failed to save workflow", {
            description: err.message,
          });
        },
      },
    );
  }

  // Track changes to nodes/edges
  const handleNodesChange: typeof onNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      const hasMeaningfulChange = changes.some((c) => c.type === "position" || c.type === "remove");
      if (hasMeaningfulChange) {
        setHasUnsavedChanges(true);
      }
    },
    [onNodesChange],
  );

  const handleEdgesChange: typeof onEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
      if (changes.some((c) => c.type === "remove")) {
        setHasUnsavedChanges(true);
      }
    },
    [onEdgesChange],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.12))] -m-6">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b px-4 py-2 bg-background shrink-0">
        <Link to="/workflows">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <Input
          value={workflowName}
          onChange={(e) => {
            setWorkflowName(e.target.value);
            setHasUnsavedChanges(true);
          }}
          className="max-w-[300px] font-medium"
        />
        <div className="flex-1" />
        {hasUnsavedChanges && (
          <span className="text-xs text-muted-foreground">Unsaved changes</span>
        )}
        <Button onClick={handleSave} disabled={updateMutation.isPending || !hasUnsavedChanges}>
          {updateMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save
        </Button>
      </div>

      {/* Canvas area */}
      <div className="flex flex-1 min-h-0">
        <NodePalette onAddNode={addNode} />
        <div
          ref={reactFlowWrapper}
          className="flex-1"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onNodesDelete={onNodesDelete}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={{ type: "animated" }}
            deleteKeyCode={["Backspace", "Delete"]}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background />
            <Controls />
            <MiniMap nodeStrokeWidth={3} className="!bg-muted/50" />
          </ReactFlow>
        </div>
        {/* Config panel — inline beside canvas */}
        <ConfigPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdateNode={updateNodeData}
          onDeleteNode={deleteNode}
        />
      </div>
    </div>
  );
}
