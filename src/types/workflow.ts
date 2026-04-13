export type TriggerEvent = "new_sighting" | "sighting_confirmed" | "campaign_completed" | "manual";
export type FilterField =
  | "rarity"
  | "region"
  | "weather"
  | "time_of_day"
  | "is_shiny"
  | "is_confirmed";
export type FilterOp = "eq" | "neq";
export type ActionType = "require_confirmation" | "assign_campaign" | "flag_anomaly" | "add_note";

export const TRIGGER_EVENTS: { value: TriggerEvent; label: string }[] = [
  { value: "new_sighting", label: "New sighting logged" },
  { value: "sighting_confirmed", label: "Sighting confirmed by peer" },
  { value: "campaign_completed", label: "Campaign completed" },
  { value: "manual", label: "Manual trigger" },
];

export const FILTER_FIELDS: { value: FilterField; label: string }[] = [
  { value: "rarity", label: "Rarity tier" },
  { value: "region", label: "Region" },
  { value: "weather", label: "Weather" },
  { value: "time_of_day", label: "Time of day" },
  { value: "is_shiny", label: "Is shiny" },
  { value: "is_confirmed", label: "Is confirmed" },
];

export const FILTER_OPS: { value: FilterOp; label: string }[] = [
  { value: "eq", label: "equals" },
  { value: "neq", label: "does not equal" },
];

export const ACTION_TYPES: { value: ActionType; label: string }[] = [
  { value: "require_confirmation", label: "Require peer confirmation" },
  { value: "assign_campaign", label: "Assign to campaign" },
  { value: "flag_anomaly", label: "Flag as anomaly" },
  { value: "add_note", label: "Add note to sighting" },
];

export interface TriggerData {
  [key: string]: unknown;
  label: string;
  event: TriggerEvent;
}

export interface FilterData {
  [key: string]: unknown;
  label: string;
  field: FilterField;
  op: FilterOp;
  value: string;
}

export interface ActionData {
  [key: string]: unknown;
  label: string;
  action: ActionType;
  campaign_id?: string;
  note?: string;
}

export type NodeData = TriggerData | FilterData | ActionData;

export interface WFNode {
  id: string;
  type: "trigger" | "filter" | "action";
  position: { x: number; y: number };
  data: NodeData;
}

export interface WFEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  nodes: WFNode[];
  edges: WFEdge[];
  created_at: string;
  updated_at: string;
}

export interface WorkflowCreate {
  name: string;
  description?: string;
  is_active?: boolean;
  nodes: WFNode[];
  edges: WFEdge[];
}

export interface WorkflowUpdate {
  name?: string;
  description?: string;
  is_active?: boolean;
  nodes?: WFNode[];
  edges?: WFEdge[];
}
