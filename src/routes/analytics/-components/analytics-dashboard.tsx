import { useNavigate } from "@tanstack/react-router";
import { Route } from "../index";
import { useAnalyticsSummary } from "@/hooks/use-analytics";
import { PageHeader } from "@/components/page-header";
import { StatCards } from "./stat-cards";
import { AnalyticsFilters } from "./analytics-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  CartesianGrid,
} from "recharts";
import { capitalize } from "@/lib/utils";
import type { AnalyticsSearch } from "../index";

const WEATHER_COLORS: Record<string, string> = {
  sunny: "#f59e0b",
  clear: "#3b82f6",
  foggy: "#94a3b8",
  rainy: "#6366f1",
  snowy: "#e2e8f0",
  sandstorm: "#d97706",
  cloudy: "#9ca3af",
  windy: "#06b6d4",
};

const TOD_COLORS: Record<string, string> = {
  morning: "#fb923c",
  day: "#facc15",
  night: "#6366f1",
  evening: "#f472b6",
};

const RARITY_COLORS: Record<string, string> = {
  common: "#22c55e",
  uncommon: "#3b82f6",
  rare: "#a855f7",
  legendary: "#f59e0b",
  mythical: "#ef4444",
};

const monthChartConfig: ChartConfig = {
  count: { label: "Sightings", color: "var(--chart-1)" },
};

const weatherChartConfig: ChartConfig = {
  count: { label: "Sightings", color: "var(--chart-2)" },
};

const todChartConfig: ChartConfig = {
  count: { label: "Sightings", color: "var(--chart-3)" },
};

const pokemonChartConfig: ChartConfig = {
  count: { label: "Sightings", color: "var(--chart-4)" },
};

const rarityChartConfig: ChartConfig = {
  count: { label: "Sightings", color: "var(--chart-5)" },
};

export function AnalyticsDashboard() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data, isLoading } = useAnalyticsSummary(search);

  function setFilters(updates: Partial<AnalyticsSearch>) {
    navigate({ search: (prev) => ({ ...prev, ...updates }) });
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" description="Insights across your sighting data" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[250px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const weatherData = data.by_weather.map((d) => ({
    ...d,
    weather: capitalize(d.weather),
    fill: WEATHER_COLORS[d.weather.toLowerCase()] ?? "var(--chart-2)",
  }));

  const todData = data.by_time_of_day.map((d) => ({
    ...d,
    time_of_day: capitalize(d.time_of_day),
  }));

  const rarityData = data.by_rarity.map((d) => ({
    ...d,
    tier: capitalize(d.tier),
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Insights across your sighting data" />
      <AnalyticsFilters filters={search} onFilterChange={setFilters} />

      <StatCards
        total={data.total}
        confirmed={data.confirmed}
        shiny={data.shiny}
        uniqueSpecies={data.unique_species}
      />

      {/* Sightings per Month */}
      <Card>
        <CardHeader>
          <CardTitle>Sightings per Month</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={monthChartConfig} className="h-[300px] w-full">
            <AreaChart data={data.sightings_by_month}>
              <defs>
                <linearGradient id="monthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} tickLine={false} />
              <YAxis fontSize={12} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="count"
                fill="url(#monthGradient)"
                stroke="var(--chart-1)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* By Weather */}
        <Card>
          <CardHeader>
            <CardTitle>Sightings by Weather</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={weatherChartConfig} className="h-[280px] w-full">
              <BarChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="weather" fontSize={12} tickLine={false} />
                <YAxis fontSize={12} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {weatherData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* By Time of Day */}
        <Card>
          <CardHeader>
            <CardTitle>Sightings by Time of Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={todChartConfig} className="h-[280px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={todData}
                  dataKey="count"
                  nameKey="time_of_day"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => {
                    const e = entry as typeof entry & { time_of_day: string };
                    return `${e.time_of_day} ${((e.percent ?? 0) * 100).toFixed(0)}%`;
                  }}
                >
                  {todData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={TOD_COLORS[entry.time_of_day.toLowerCase()] ?? "var(--chart-3)"}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top 10 Pokemon */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Most-Sighted Pokémon</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pokemonChartConfig} className="h-[320px] w-full">
              <BarChart data={data.top_pokemon} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} tickLine={false} />
                <YAxis type="category" dataKey="name" fontSize={12} tickLine={false} width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-4)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* By Rarity */}
        <Card>
          <CardHeader>
            <CardTitle>Sightings by Rarity Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={rarityChartConfig} className="h-[320px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={rarityData}
                  dataKey="count"
                  nameKey="tier"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  label={(entry) => {
                    const e = entry as typeof entry & { tier: string };
                    return `${e.tier} ${((e.percent ?? 0) * 100).toFixed(0)}%`;
                  }}
                >
                  {rarityData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={RARITY_COLORS[entry.tier.toLowerCase()] ?? "var(--chart-5)"}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
