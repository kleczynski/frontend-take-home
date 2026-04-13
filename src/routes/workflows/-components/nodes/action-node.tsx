import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Play, X } from "lucide-react";
import type { ActionData } from "@/types/workflow";
import { ACTION_TYPES } from "@/types/workflow";

type ActionNodeProps = NodeProps & {
  data: ActionData & { onDelete?: (id: string) => void };
};

export const ActionNode = memo(function ActionNode({ id, data, selected }: ActionNodeProps) {
  const actionLabel = ACTION_TYPES.find((a) => a.value === data.action)?.label ?? data.action;

  return (
    <div
      className={`group rounded-lg border-2 bg-card shadow-sm min-w-[180px] ${
        selected ? "border-green-500 ring-2 ring-green-200" : "border-green-300"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-green-500 !w-3 !h-3" />
      <div className="flex items-center gap-2 rounded-t-md bg-green-50 px-3 py-2 border-b border-green-200">
        <Play className="h-4 w-4 text-green-600" />
        <span className="text-xs font-semibold text-green-700 uppercase tracking-wider flex-1">
          Action
        </span>
        {data.onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete!(id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity rounded-sm p-0.5 hover:bg-green-200"
          >
            <X className="h-3 w-3 text-green-700" />
          </button>
        )}
      </div>
      <div className="px-3 py-2">
        <p className="text-sm font-medium truncate">{data.label}</p>
        <p className="text-xs text-muted-foreground truncate">{actionLabel}</p>
      </div>
    </div>
  );
});
