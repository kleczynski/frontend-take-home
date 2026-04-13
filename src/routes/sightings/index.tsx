import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";
import { SightingsPage } from "./-components/sightings-page";

const sightingsSearchSchema = z.object({
  pokemon_id: z.number().optional(),
  region: z.string().optional(),
  weather: z.enum(["sunny", "rainy", "snowy", "sandstorm", "foggy", "clear"]).optional(),
  time_of_day: z.enum(["morning", "day", "night"]).optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  limit: z.number().default(50),
  offset: z.number().default(0),
});

export type SightingsSearch = z.infer<typeof sightingsSearchSchema>;

export const Route = createFileRoute("/sightings/")({
  validateSearch: sightingsSearchSchema,
  component: SightingsPage,
});
