import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, CheckCircle, Sparkles, Layers } from "lucide-react";

interface StatCardsProps {
  total: number;
  confirmed: number;
  shiny: number;
  uniqueSpecies: number;
}

export function StatCards({ total, confirmed, shiny, uniqueSpecies }: StatCardsProps) {
  const shinyRate = total > 0 ? ((shiny / total) * 100).toFixed(2) : "0.00";
  const confirmRate = total > 0 ? ((confirmed / total) * 100).toFixed(1) : "0.0";

  const stats = [
    {
      title: "Total Sightings",
      value: total.toLocaleString(),
      subtitle: null,
      icon: Eye,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Confirmed",
      value: confirmed.toLocaleString(),
      subtitle: `${confirmRate}% of total`,
      icon: CheckCircle,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Shiny",
      value: `${shiny.toLocaleString()} (${shinyRate}%)`,
      subtitle: null,
      icon: Sparkles,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Unique Species",
      value: uniqueSpecies.toLocaleString(),
      subtitle: null,
      icon: Layers,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
            <div className={`rounded-lg p-2 ${s.iconBg}`}>
              <s.icon className={`h-4 w-4 ${s.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{s.value}</div>
            {s.subtitle && <p className="text-xs text-muted-foreground mt-1">{s.subtitle}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
