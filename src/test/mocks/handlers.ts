import { http, HttpResponse } from "msw";
import { mockRangers, mockSightings, mockWorkflows, mockAnalyticsSummary } from "./data";
import type { Sighting } from "@/types/sighting";
import type { Workflow } from "@/types/workflow";

export const handlers = [
  // Rangers
  http.get("/api/rangers", () => {
    return HttpResponse.json(mockRangers);
  }),

  // Sightings - list
  http.get("/api/sightings", ({ request }) => {
    const url = new URL(request.url);
    let items = [...mockSightings];

    const pokemonId = url.searchParams.get("pokemon_id");
    if (pokemonId) {
      items = items.filter((s) => s.pokemon_id === Number(pokemonId));
    }

    const region = url.searchParams.get("region");
    if (region) {
      items = items.filter((s) => s.region === region);
    }

    const weather = url.searchParams.get("weather");
    if (weather) {
      items = items.filter((s) => s.weather === weather);
    }

    const limit = Number(url.searchParams.get("limit") || 50);
    const offset = Number(url.searchParams.get("offset") || 0);

    return HttpResponse.json({
      total: items.length,
      limit,
      offset,
      items: items.slice(offset, offset + limit),
    });
  }),

  // Sightings - create
  http.post("/api/sightings", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const userId = request.headers.get("X-User-ID");

    if (!userId) {
      return HttpResponse.json({ detail: "X-User-ID header is required" }, { status: 401 });
    }

    const newSighting: Sighting = {
      id: `sight-${Date.now()}`,
      pokemon_id: body.pokemon_id as number,
      ranger_id: userId,
      region: body.region as string,
      route: body.route as string,
      date: body.date as string,
      weather: body.weather as Sighting["weather"],
      time_of_day: body.time_of_day as Sighting["time_of_day"],
      height: body.height as number,
      weight: body.weight as number,
      is_shiny: (body.is_shiny as boolean) ?? false,
      notes: (body.notes as string) ?? null,
      is_confirmed: false,
      pokemon_name: "Pikachu",
      ranger_name: "Ash Ketchum",
    };

    return HttpResponse.json(newSighting, { status: 201 });
  }),

  // Sightings - delete
  http.delete("/api/sightings/:id", () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Workflows - list
  http.get("/api/workflows", () => {
    return HttpResponse.json(mockWorkflows);
  }),

  // Workflows - get
  http.get("/api/workflows/:id", ({ params }) => {
    const workflow = mockWorkflows.find((w) => w.id === params.id);
    if (!workflow) {
      return HttpResponse.json({ detail: "Workflow not found" }, { status: 404 });
    }
    return HttpResponse.json(workflow);
  }),

  // Workflows - create
  http.post("/api/workflows", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newWorkflow: Workflow = {
      id: `wf-${Date.now()}`,
      name: (body.name as string) || "Untitled Workflow",
      description: (body.description as string) ?? null,
      is_active: (body.is_active as boolean) ?? true,
      nodes: (body.nodes as Workflow["nodes"]) ?? [],
      edges: (body.edges as Workflow["edges"]) ?? [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(newWorkflow, { status: 201 });
  }),

  // Workflows - update
  http.put("/api/workflows/:id", async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const existing = mockWorkflows.find((w) => w.id === params.id);
    if (!existing) {
      return HttpResponse.json({ detail: "Workflow not found" }, { status: 404 });
    }
    const updated: Workflow = {
      ...existing,
      ...(body.name !== undefined && { name: body.name as string }),
      ...(body.nodes !== undefined && { nodes: body.nodes as Workflow["nodes"] }),
      ...(body.edges !== undefined && { edges: body.edges as Workflow["edges"] }),
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(updated);
  }),

  // Workflows - delete
  http.delete("/api/workflows/:id", () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Analytics
  http.get("/api/analytics/summary", () => {
    return HttpResponse.json(mockAnalyticsSummary);
  }),

  // Pokedex search
  http.get("/api/pokedex/search", ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("name")?.toLowerCase() || "";
    const results = [
      { id: 25, name: "Pikachu", type1: "electric", type2: null, generation: 1 },
      { id: 26, name: "Raichu", type1: "electric", type2: null, generation: 1 },
    ].filter((p) => p.name.toLowerCase().startsWith(name));
    return HttpResponse.json(results);
  }),
];
