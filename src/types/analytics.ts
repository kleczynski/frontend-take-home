export interface AnalyticsSummary {
  total: number;
  confirmed: number;
  shiny: number;
  unique_species: number;
  sightings_by_month: { month: string; count: number }[];
  by_weather: { weather: string; count: number }[];
  by_time_of_day: { time_of_day: string; count: number }[];
  by_region: { region: string; count: number }[];
  top_pokemon: { pokemon_id: number; name: string; count: number }[];
  by_rarity: { tier: string; count: number }[];
}
