import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Zap, X } from "lucide-react";
import type { TriggerData } from "@/types/workflow";
import { TRIGGER_EVENTS } from "@/types/workflow";

type TriggerNodeProps = NodeProps & {
  data: TriggerData & { onDelete?: (id: string) => void };
};

export const TriggerNode = memo(function TriggerNode({ id, data, selected }: TriggerNodeProps) {
  const eventLabel = TRIGGER_EVENTS.find((e) => e.value === data.event)?.label ?? data.event;

  return (
    <div
      className={`group rounded-lg border-2 bg-card shadow-sm min-w-[180px] ${
        selected ? "border-blue-500 ring-2 ring-blue-200" : "border-blue-300"
      }`}
    >
      <div className="flex items-center gap-2 rounded-t-md bg-blue-50 px-3 py-2 border-b border-blue-200">
        <Zap className="h-4 w-4 text-blue-600" />
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider flex-1">
          Trigger
        </span>
        {data.onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete!(id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity rounded-sm p-0.5 hover:bg-blue-200"
          >
            <X className="h-3 w-3 text-blue-700" />
          </button>
        )}
      </div>
      <div className="px-3 py-2">
        <p className="text-sm font-medium truncate">{data.label}</p>
        <p className="text-xs text-muted-foreground truncate">{eventLabel}</p>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-3 !h-3" />
    </div>
  );
});
