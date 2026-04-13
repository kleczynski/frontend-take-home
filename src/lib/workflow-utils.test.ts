import { describe, it, expect } from "vitest";
import {
  convertToRFNodes,
  convertToRFEdges,
  convertFromRFNodes,
  convertFromRFEdges,
  defaultNodeData,
} from "./workflow-utils";
import type { WFNode, WFEdge } from "@/types/workflow";
import type { Node, Edge } from "@xyflow/react";

describe("workflow-utils", () => {
  describe("convertToRFNodes", () => {
    it("maps API nodes to React Flow node format", () => {
      const apiNodes: WFNode[] = [
        {
          id: "node-1",
          type: "trigger",
          position: { x: 100, y: 200 },
          data: { label: "Start", event: "new_sighting" },
        },
      ];

      const result = convertToRFNodes(apiNodes);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: "node-1",
        type: "trigger",
        position: { x: 100, y: 200 },
        data: { label: "Start", event: "new_sighting" },
      });
    });
  });

  describe("convertToRFEdges", () => {
    it("maps API edges and converts null handles to undefined", () => {
      const apiEdges: WFEdge[] = [
        {
          id: "edge-1",
          source: "node-1",
          target: "node-2",
          sourceHandle: "match",
          targetHandle: null,
        },
      ];

      const result = convertToRFEdges(apiEdges);

      expect(result[0].sourceHandle).toBe("match");
      expect(result[0].targetHandle).toBeUndefined();
    });
  });

  describe("convertFromRFNodes", () => {
    it("maps React Flow nodes back to API format", () => {
      const rfNodes: Node[] = [
        {
          id: "node-1",
          type: "filter",
          position: { x: 50, y: 75 },
          data: { label: "Check region", field: "region", op: "eq", value: "Kanto" },
        },
      ];

      const result = convertFromRFNodes(rfNodes);

      expect(result[0]).toEqual({
        id: "node-1",
        type: "filter",
        position: { x: 50, y: 75 },
        data: { label: "Check region", field: "region", op: "eq", value: "Kanto" },
      });
    });

    it("strips onDelete callback from node data before serialization", () => {
      const deleteFunc = () => {};
      const rfNodes: Node[] = [
        {
          id: "node-1",
          type: "action",
          position: { x: 0, y: 0 },
          data: { label: "Flag", action: "flag_anomaly", onDelete: deleteFunc },
        },
      ];

      const result = convertFromRFNodes(rfNodes);

      expect(result[0].data).toEqual({ label: "Flag", action: "flag_anomaly" });
      expect("onDelete" in result[0].data).toBe(false);
    });
  });

  describe("convertFromRFEdges", () => {
    it("converts undefined handles to null for API", () => {
      const rfEdges: Edge[] = [
        {
          id: "edge-1",
          source: "a",
          target: "b",
          sourceHandle: undefined,
          targetHandle: undefined,
        },
      ];

      const result = convertFromRFEdges(rfEdges);

      expect(result[0].sourceHandle).toBeNull();
      expect(result[0].targetHandle).toBeNull();
    });
  });

  describe("defaultNodeData", () => {
    it("provides defaults for all three node types", () => {
      expect(defaultNodeData.trigger).toHaveProperty("event");
      expect(defaultNodeData.filter).toHaveProperty("field");
      expect(defaultNodeData.filter).toHaveProperty("op");
      expect(defaultNodeData.action).toHaveProperty("action");
    });
  });

  describe("round-trip conversion", () => {
    it("preserves data through API -> RF -> API conversion", () => {
      const originalNodes: WFNode[] = [
        {
          id: "n1",
          type: "trigger",
          position: { x: 100, y: 100 },
          data: { label: "Start", event: "manual" },
        },
        {
          id: "n2",
          type: "filter",
          position: { x: 300, y: 100 },
          data: { label: "Night?", field: "time_of_day", op: "eq", value: "night" },
        },
      ];
      const originalEdges: WFEdge[] = [
        { id: "e1", source: "n1", target: "n2", sourceHandle: null, targetHandle: null },
      ];

      const rfNodes = convertToRFNodes(originalNodes);
      const rfEdges = convertToRFEdges(originalEdges);
      const backNodes = convertFromRFNodes(rfNodes);
      const backEdges = convertFromRFEdges(rfEdges);

      expect(backNodes).toEqual(originalNodes);
      expect(backEdges).toEqual(originalEdges);
    });
  });
});
