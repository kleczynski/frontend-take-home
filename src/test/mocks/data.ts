import type { Sighting, SightingListResponse } from "@/types/sighting";
import type { Ranger } from "@/types/ranger";
import type { Workflow } from "@/types/workflow";
import type { AnalyticsSummary } from "@/types/analytics";

export const mockRangers: Ranger[] = [
  {
    id: "ranger-1",
    name: "Ash Ketchum",
    email: "ash@pokemon.org",
    specialization: "Electric",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "ranger-2",
    name: "Misty Waterflower",
    email: "misty@pokemon.org",
    specialization: "Water",
    created_at: "2024-01-02T00:00:00Z",
  },
];

export const mockSightings: Sighting[] = [
  {
    id: "sight-1",
    pokemon_id: 25,
    ranger_id: "ranger-1",
    region: "Kanto",
    route: "Route 1",
    date: "2024-06-15T10:30:00Z",
    weather: "sunny",
    time_of_day: "morning",
    height: 0.4,
    weight: 6.0,
    is_shiny: false,
    notes: null,
    is_confirmed: true,
    pokemon_name: "Pikachu",
    ranger_name: "Ash Ketchum",
  },
  {
    id: "sight-2",
    pokemon_id: 150,
    ranger_id: "ranger-2",
    region: "Kanto",
    route: "Cerulean Cave",
    date: "2024-07-20T22:00:00Z",
    weather: "clear",
    time_of_day: "night",
    height: 2.0,
    weight: 122.0,
    is_shiny: true,
    notes: "Extremely rare encounter",
    is_confirmed: false,
    pokemon_name: "Mewtwo",
    ranger_name: "Misty Waterflower",
  },
  {
    id: "sight-3",
    pokemon_id: 6,
    ranger_id: "ranger-1",
    region: "Johto",
    route: "Route 45",
    date: "2024-08-10T14:00:00Z",
    weather: "rainy",
    time_of_day: "day",
    height: 1.7,
    weight: 90.5,
    is_shiny: false,
    notes: null,
    is_confirmed: true,
    pokemon_name: "Charizard",
    ranger_name: "Ash Ketchum",
  },
];

export const mockSightingListResponse: SightingListResponse = {
  total: mockSightings.length,
  limit: 50,
  offset: 0,
  items: mockSightings,
};

export const mockWorkflows: Workflow[] = [
  {
    id: "wf-1",
    name: "Flag rare night sightings",
    description: "Auto-flag rare Pokémon spotted at night",
    is_active: true,
    nodes: [
      {
        id: "node-1",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: { label: "New sighting", event: "new_sighting" },
      },
      {
        id: "node-2",
        type: "filter",
        position: { x: 350, y: 100 },
        data: { label: "Night?", field: "time_of_day", op: "eq", value: "night" },
      },
    ],
    edges: [
      { id: "edge-1", source: "node-1", target: "node-2", sourceHandle: null, targetHandle: null },
    ],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "wf-2",
    name: "Shiny confirmation",
    description: null,
    is_active: false,
    nodes: [],
    edges: [],
    created_at: "2024-02-20T15:30:00Z",
    updated_at: "2024-02-20T15:30:00Z",
  },
];

export const mockAnalyticsSummary: AnalyticsSummary = {
  total: 1500,
  confirmed: 1200,
  shiny: 45,
  unique_species: 312,
  sightings_by_month: [
    { month: "2024-01", count: 120 },
    { month: "2024-02", count: 95 },
    { month: "2024-03", count: 140 },
  ],
  by_weather: [
    { weather: "sunny", count: 450 },
    { weather: "rainy", count: 320 },
    { weather: "clear", count: 280 },
  ],
  by_time_of_day: [
    { time_of_day: "morning", count: 500 },
    { time_of_day: "day", count: 600 },
    { time_of_day: "night", count: 400 },
  ],
  by_region: [
    { region: "Kanto", count: 800 },
    { region: "Johto", count: 700 },
  ],
  top_pokemon: [
    { pokemon_id: 25, name: "Pikachu", count: 85 },
    { pokemon_id: 133, name: "Eevee", count: 72 },
    { pokemon_id: 1, name: "Bulbasaur", count: 68 },
  ],
  by_rarity: [
    { tier: "common", count: 900 },
    { tier: "uncommon", count: 350 },
    { tier: "rare", count: 150 },
    { tier: "legendary", count: 80 },
    { tier: "mythical", count: 20 },
  ],
};
