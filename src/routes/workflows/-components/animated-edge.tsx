import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
  type Edge,
} from "@xyflow/react";

export function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps<Edge>) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? "var(--chart-1)" : "#94a3b8",
          strokeWidth: selected ? 2.5 : 2,
          filter: selected ? "drop-shadow(0 0 4px var(--chart-1))" : undefined,
        }}
      />
      <path
        d={edgePath}
        fill="none"
        stroke={selected ? "var(--chart-1)" : "#64748b"}
        strokeWidth={selected ? 2.5 : 2}
        strokeDasharray="6 4"
        className="animated-edge-dash"
      />
    </>
  );
}
