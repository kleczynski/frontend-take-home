import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";
import { AnalyticsDashboard } from "./-components/analytics-dashboard";

const analyticsSearchSchema = z.object({
  region: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
});

export type AnalyticsSearch = z.infer<typeof analyticsSearchSchema>;

export const Route = createFileRoute("/analytics/")({
  validateSearch: analyticsSearchSchema,
  component: AnalyticsDashboard,
});
