import { describe, it, expect } from "vitest";
import { api, ApiError } from "./api-client";
import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";

describe("api-client", () => {
  describe("api.get", () => {
    it("sends GET to /api + path and returns parsed JSON", async () => {
      server.use(
        http.get("/api/test-endpoint", () => {
          return HttpResponse.json({ id: 1, name: "Pikachu" });
        }),
      );

      const result = await api.get<{ id: number; name: string }>("/test-endpoint");
      expect(result).toEqual({ id: 1, name: "Pikachu" });
    });
  });

  describe("api.post", () => {
    it("sends POST with JSON body and custom headers", async () => {
      let capturedUserId: string | null = null;
      let capturedBody: unknown = null;

      server.use(
        http.post("/api/sightings", async ({ request }) => {
          capturedUserId = request.headers.get("X-User-ID");
          capturedBody = await request.json();
          return HttpResponse.json({ id: "abc" }, { status: 201 });
        }),
      );

      const result = await api.post("/sightings", { pokemon_id: 25 }, { "X-User-ID": "ranger-1" });

      expect(capturedUserId).toBe("ranger-1");
      expect(capturedBody).toEqual({ pokemon_id: 25 });
      expect(result).toEqual({ id: "abc" });
    });
  });

  describe("api.put", () => {
    it("sends PUT with JSON body", async () => {
      let capturedBody: unknown = null;

      server.use(
        http.put("/api/workflows/wf-1", async ({ request }) => {
          capturedBody = await request.json();
          return HttpResponse.json({ id: "wf-1", name: "Updated" });
        }),
      );

      const result = await api.put("/workflows/wf-1", { name: "Updated" });

      expect(capturedBody).toEqual({ name: "Updated" });
      expect(result).toEqual({ id: "wf-1", name: "Updated" });
    });
  });

  describe("api.delete", () => {
    it("sends DELETE and handles 204 No Content", async () => {
      server.use(
        http.delete("/api/sightings/abc", () => {
          return new HttpResponse(null, { status: 204 });
        }),
      );

      const result = await api.delete("/sightings/abc");
      expect(result).toBeUndefined();
    });
  });

  describe("error handling", () => {
    it("throws ApiError with status and detail on non-OK response", async () => {
      server.use(
        http.get("/api/sightings/missing", () => {
          return HttpResponse.json({ detail: "Not found" }, { status: 404 });
        }),
      );

      try {
        await api.get("/sightings/missing");
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).status).toBe(404);
        expect((err as ApiError).detail).toBe("Not found");
      }
    });

    it("falls back to 'Unknown error' when detail is missing", async () => {
      server.use(
        http.get("/api/bad", () => {
          return HttpResponse.json({}, { status: 400 });
        }),
      );

      try {
        await api.get("/bad");
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).status).toBe(400);
        expect((err as ApiError).detail).toBe("Unknown error");
      }
    });
  });
});
