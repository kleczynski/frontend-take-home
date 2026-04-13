import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Filter, X } from "lucide-react";
import type { FilterData } from "@/types/workflow";
import { FILTER_FIELDS, FILTER_OPS } from "@/types/workflow";

type FilterNodeProps = NodeProps & {
  data: FilterData & { onDelete?: (id: string) => void };
};

export const FilterNode = memo(function FilterNode({ id, data, selected }: FilterNodeProps) {
  const fieldLabel = FILTER_FIELDS.find((f) => f.value === data.field)?.label ?? data.field;
  const opLabel = FILTER_OPS.find((o) => o.value === data.op)?.label ?? data.op;

  return (
    <div
      className={`group rounded-lg border-2 bg-card shadow-sm min-w-[180px] ${
        selected ? "border-amber-500 ring-2 ring-amber-200" : "border-amber-300"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-amber-500 !w-3 !h-3" />
      <div className="flex items-center gap-2 rounded-t-md bg-amber-50 px-3 py-2 border-b border-amber-200">
        <Filter className="h-4 w-4 text-amber-600" />
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex-1">
          Filter
        </span>
        {data.onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete!(id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity rounded-sm p-0.5 hover:bg-amber-200"
          >
            <X className="h-3 w-3 text-amber-700" />
          </button>
        )}
      </div>
      <div className="px-3 py-2">
        <p className="text-sm font-medium truncate">{data.label}</p>
        <p className="text-xs text-muted-foreground truncate">
          {fieldLabel} {opLabel} &ldquo;{data.value}&rdquo;
        </p>
      </div>
      <div className="flex justify-between px-3 pb-2">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-medium text-green-600 mb-1">match</span>
          <Handle
            type="source"
            position={Position.Bottom}
            id="match"
            className="!bg-green-500 !w-3 !h-3 !relative !transform-none !inset-auto"
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-medium text-red-500 mb-1">no match</span>
          <Handle
            type="source"
            position={Position.Bottom}
            id="no-match"
            className="!bg-red-500 !w-3 !h-3 !relative !transform-none !inset-auto"
          />
        </div>
      </div>
    </div>
  );
});
