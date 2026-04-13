import type { Node } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, X } from "lucide-react";
import { TriggerConfig } from "./config-forms/trigger-config";
import { FilterConfig } from "./config-forms/filter-config";
import { ActionConfig } from "./config-forms/action-config";
import type { TriggerData, FilterData, ActionData } from "@/types/workflow";

interface ConfigPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, data: Record<string, unknown>) => void;
  onDeleteNode: (nodeId: string) => void;
}

export function ConfigPanel({ node, onClose, onUpdateNode, onDeleteNode }: ConfigPanelProps) {
  if (!node) return null;

  const nodeType = node.type as "trigger" | "filter" | "action";
  const titles = {
    trigger: "Trigger Configuration",
    filter: "Filter Configuration",
    action: "Action Configuration",
  };

  return (
    <div className="w-[320px] shrink-0 border-l bg-background overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium text-sm">{titles[nodeType]}</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        {nodeType === "trigger" && (
          <TriggerConfig
            data={node.data as TriggerData}
            onChange={(data) => onUpdateNode(node.id, data)}
          />
        )}
        {nodeType === "filter" && (
          <FilterConfig
            data={node.data as FilterData}
            onChange={(data) => onUpdateNode(node.id, data)}
          />
        )}
        {nodeType === "action" && (
          <ActionConfig
            data={node.data as ActionData}
            onChange={(data) => onUpdateNode(node.id, data)}
          />
        )}
        <Separator className="my-6" />
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
            onDeleteNode(node.id);
            onClose();
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Node
        </Button>
      </div>
    </div>
  );
}
