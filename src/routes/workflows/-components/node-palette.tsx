import type { DragEvent } from "react";
import { Zap, Filter, Play } from "lucide-react";

const NODE_TYPES = [
  {
    type: "trigger",
    label: "Trigger",
    icon: Zap,
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    type: "filter",
    label: "Filter",
    icon: Filter,
    color: "bg-amber-50 border-amber-200 text-amber-700",
  },
  {
    type: "action",
    label: "Action",
    icon: Play,
    color: "bg-green-50 border-green-200 text-green-700",
  },
] as const;

interface NodePaletteProps {
  onAddNode: (type: "trigger" | "filter" | "action") => void;
}

export function NodePalette({ onAddNode }: NodePaletteProps) {
  function handleDragStart(e: DragEvent, type: string) {
    e.dataTransfer.setData("application/reactflow", type);
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <div className="space-y-2 p-3 border-r bg-muted/30 w-[140px] shrink-0">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Nodes
      </p>
      {NODE_TYPES.map(({ type, label, icon: Icon, color }) => (
        <div
          key={type}
          draggable
          onDragStart={(e) => handleDragStart(e, type)}
          onClick={() => onAddNode(type)}
          className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow ${color}`}
        >
          <Icon className="h-4 w-4" />
          <span className="text-xs font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}
