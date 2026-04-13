import type { ColumnDef } from "@tanstack/react-table";
import type { Sighting } from "@/types/sighting";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Check, X, Sparkles } from "lucide-react";
import { formatDate, capitalize } from "@/lib/utils";
import { WEATHER_COLORS, TIME_COLORS } from "@/lib/constants";

export function getSightingsColumns(
  onDelete: (id: string, pokemonName: string) => void,
): ColumnDef<Sighting, unknown>[] {
  return [
    {
      accessorKey: "pokemon_name",
      header: "Pokémon",
      cell: ({ row }) => {
        const name = row.original.pokemon_name ?? `#${row.original.pokemon_id}`;
        return (
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{name}</span>
            {row.original.is_shiny && <Sparkles className="h-3.5 w-3.5 text-amber-500" />}
          </div>
        );
      },
    },
    {
      accessorKey: "region",
      header: "Region",
    },
    {
      accessorKey: "route",
      header: "Route",
    },
    {
      accessorKey: "weather",
      header: "Weather",
      cell: ({ getValue }) => {
        const weather = getValue<string>();
        return (
          <Badge variant="outline" className={WEATHER_COLORS[weather]}>
            {capitalize(weather)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "time_of_day",
      header: "Time of Day",
      cell: ({ getValue }) => {
        const time = getValue<string>();
        return (
          <Badge variant="outline" className={TIME_COLORS[time]}>
            {capitalize(time)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ getValue }) => formatDate(getValue<string>()),
    },
    {
      accessorKey: "ranger_name",
      header: "Ranger",
      cell: ({ row }) => row.original.ranger_name ?? row.original.ranger_id.slice(0, 8),
    },
    {
      accessorKey: "is_confirmed",
      header: "Confirmed",
      cell: ({ getValue }) =>
        getValue<boolean>() ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <X className="h-4 w-4 text-muted-foreground" />
        ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const pokemonName = row.original.pokemon_name ?? "Unknown";
        return (
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Sighting</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the sighting of &ldquo;{pokemonName}&rdquo; from{" "}
                  {formatDate(row.original.date)}. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(row.original.id, pokemonName)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];
}
