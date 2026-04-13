export type Weather = "sunny" | "rainy" | "snowy" | "sandstorm" | "foggy" | "clear";
export type TimeOfDay = "morning" | "day" | "night";

export const WEATHER_OPTIONS: Weather[] = [
  "sunny",
  "rainy",
  "snowy",
  "sandstorm",
  "foggy",
  "clear",
];
export const TIME_OF_DAY_OPTIONS: TimeOfDay[] = ["morning", "day", "night"];
export const REGIONS = ["Kanto", "Johto", "Hoenn", "Sinnoh"] as const;

export interface Sighting {
  id: string;
  pokemon_id: number;
  ranger_id: string;
  region: string;
  route: string;
  date: string;
  weather: Weather;
  time_of_day: TimeOfDay;
  height: number;
  weight: number;
  is_shiny: boolean;
  notes: string | null;
  is_confirmed: boolean;
  pokemon_name?: string | null;
  ranger_name?: string | null;
}

export interface SightingListResponse {
  total: number;
  limit: number;
  offset: number;
  items: Sighting[];
}

export interface SightingCreate {
  pokemon_id: number;
  region: string;
  route: string;
  date: string;
  weather: Weather;
  time_of_day: TimeOfDay;
  height: number;
  weight: number;
  is_shiny?: boolean;
  notes?: string;
  latitude?: number;
  longitude?: number;
}
