import type { Node, Edge } from "@xyflow/react";
import type {
  WFNode,
  WFEdge,
  TriggerData,
  FilterData,
  ActionData,
  NodeData,
} from "@/types/workflow";

export function convertToRFNodes(apiNodes: WFNode[]): Node[] {
  return apiNodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: n.data,
  }));
}

export function convertToRFEdges(apiEdges: WFEdge[]): Edge[] {
  return apiEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: "animated",
    sourceHandle: e.sourceHandle ?? undefined,
    targetHandle: e.targetHandle ?? undefined,
  }));
}

export function convertFromRFNodes(rfNodes: Node[]): WFNode[] {
  return rfNodes.map((n) => {
    const data = n.data as NodeData & { onDelete?: unknown };
    return {
      id: n.id,
      type: n.type as "trigger" | "filter" | "action",
      position: { x: n.position.x, y: n.position.y },
      data: data as TriggerData | FilterData | ActionData,
    };
  });
}

export function convertFromRFEdges(rfEdges: Edge[]): WFEdge[] {
  return rfEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? null,
    targetHandle: e.targetHandle ?? null,
  }));
}

export const defaultNodeData: Record<string, TriggerData | FilterData | ActionData> = {
  trigger: { label: "New Trigger", event: "new_sighting" },
  filter: { label: "New Filter", field: "region", op: "eq", value: "" },
  action: { label: "New Action", action: "flag_anomaly" },
};
