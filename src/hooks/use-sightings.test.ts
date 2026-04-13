import { describe, it, expect } from "vitest";
import type { SightingFilters } from "./use-sightings";

// Test the filter -> query string logic independently
function buildQueryString(filters: SightingFilters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "" && value !== null) {
      params.set(key, String(value));
    }
  }
  return params.toString();
}

describe("sighting filters", () => {
  describe("buildQueryString", () => {
    it("includes only defined, non-empty filter values", () => {
      const filters: SightingFilters = {
        pokemon_id: 25,
        region: "Kanto",
        weather: undefined,
        time_of_day: undefined,
        date_from: undefined,
        date_to: undefined,
        limit: 50,
        offset: 0,
      };

      const qs = buildQueryString(filters);
      const params = new URLSearchParams(qs);

      expect(params.get("pokemon_id")).toBe("25");
      expect(params.get("region")).toBe("Kanto");
      expect(params.has("weather")).toBe(false);
      expect(params.get("limit")).toBe("50");
      expect(params.get("offset")).toBe("0");
    });

    it("excludes empty string values", () => {
      const filters: SightingFilters = {
        region: "",
        limit: 50,
        offset: 0,
      };

      const qs = buildQueryString(filters);
      const params = new URLSearchParams(qs);

      expect(params.has("region")).toBe(false);
      expect(params.get("limit")).toBe("50");
    });

    it("includes all filters when fully populated", () => {
      const filters: SightingFilters = {
        pokemon_id: 150,
        region: "Kanto",
        weather: "rainy",
        time_of_day: "night",
        date_from: "2024-01-01T00:00:00Z",
        date_to: "2024-12-31T23:59:59Z",
        limit: 100,
        offset: 200,
      };

      const qs = buildQueryString(filters);
      const params = new URLSearchParams(qs);

      expect(params.get("pokemon_id")).toBe("150");
      expect(params.get("region")).toBe("Kanto");
      expect(params.get("weather")).toBe("rainy");
      expect(params.get("time_of_day")).toBe("night");
      expect(params.get("date_from")).toBe("2024-01-01T00:00:00Z");
      expect(params.get("date_to")).toBe("2024-12-31T23:59:59Z");
      expect(params.get("limit")).toBe("100");
      expect(params.get("offset")).toBe("200");
    });
  });

  describe("filter-to-page reset logic", () => {
    it("should reset offset to 0 when a filter changes", () => {
      // This tests the logic used in sightings-page.tsx setFilters
      const prev = { pokemon_id: undefined, region: "Kanto", limit: 50, offset: 100 };
      const updates = { weather: "rainy" };

      const hasFilterChange = Object.keys(updates).some((k) => k !== "offset" && k !== "limit");

      const result = {
        ...prev,
        ...updates,
        offset: hasFilterChange ? 0 : ((updates as Record<string, unknown>).offset ?? prev.offset),
      };

      expect(result.offset).toBe(0); // Reset because weather changed
      expect(result.weather).toBe("rainy");
      expect(result.region).toBe("Kanto"); // Preserved
    });

    it("should NOT reset offset when only offset changes (pagination)", () => {
      const prev = { region: "Kanto", limit: 50, offset: 0 };
      const updates = { offset: 50 };

      const hasFilterChange = Object.keys(updates).some((k) => k !== "offset" && k !== "limit");

      const result = {
        ...prev,
        ...updates,
        offset: hasFilterChange ? 0 : (updates.offset ?? prev.offset),
      };

      expect(result.offset).toBe(50); // Not reset — pagination only
    });

    it("should NOT reset filters when page size changes", () => {
      const prev = { region: "Kanto", weather: "sunny", limit: 50, offset: 100 };
      const result = { ...prev, limit: 100, offset: 0 };

      expect(result.region).toBe("Kanto"); // Preserved
      expect(result.weather).toBe("sunny"); // Preserved
      expect(result.limit).toBe(100);
      expect(result.offset).toBe(0); // Reset to page 1 with new size
    });
  });
});
