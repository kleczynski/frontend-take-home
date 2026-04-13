import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { WEATHER_OPTIONS, TIME_OF_DAY_OPTIONS, REGIONS } from "@/types/sighting";
import type { SightingsSearch } from "../index";

interface SightingsFiltersProps {
  filters: SightingsSearch;
  onFilterChange: (updates: Partial<SightingsSearch>) => void;
}

export function SightingsFilters({ filters, onFilterChange }: SightingsFiltersProps) {
  const activeFilterCount = [
    filters.pokemon_id,
    filters.region,
    filters.weather,
    filters.time_of_day,
    filters.date_from,
    filters.date_to,
  ].filter((v) => v !== undefined && v !== null).length;

  const hasFilters = activeFilterCount > 0;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs">Pokémon ID</Label>
        <Input
          type="number"
          placeholder="Pokémon ID"
          value={filters.pokemon_id ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            onFilterChange({ pokemon_id: val ? Number(val) : undefined });
          }}
          className="w-[130px]"
          min={1}
          max={493}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs">Region</Label>
        <Select
          value={filters.region ?? "__all__"}
          onValueChange={(v) => onFilterChange({ region: !v || v === "__all__" ? undefined : v })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Regions</SelectItem>
            {REGIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs">Weather</Label>
        <Select
          value={filters.weather ?? "__all__"}
          onValueChange={(v) =>
            onFilterChange({ weather: !v || v === "__all__" ? undefined : (v as typeof filters.weather) })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Weather" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Weather</SelectItem>
            {WEATHER_OPTIONS.map((w) => (
              <SelectItem key={w} value={w}>
                {w.charAt(0).toUpperCase() + w.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs">Time of Day</Label>
        <Select
          value={filters.time_of_day ?? "__all__"}
          onValueChange={(v) =>
            onFilterChange({ time_of_day: !v || v === "__all__" ? undefined : (v as typeof filters.time_of_day) })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Time of Day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Times</SelectItem>
            {TIME_OF_DAY_OPTIONS.map((t) => (
              <SelectItem key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs">From</Label>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal",
                  !filters.date_from && "text-muted-foreground",
                )}
              />
            }
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.date_from ? format(new Date(filters.date_from), "MMM d, yyyy") : "From date"}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.date_from ? new Date(filters.date_from) : undefined}
              onSelect={(date) =>
                onFilterChange({
                  date_from: date ? date.toISOString() : undefined,
                })
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs">To</Label>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal",
                  !filters.date_to && "text-muted-foreground",
                )}
              />
            }
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.date_to ? format(new Date(filters.date_to), "MMM d, yyyy") : "To date"}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.date_to ? new Date(filters.date_to) : undefined}
              onSelect={(date) =>
                onFilterChange({
                  date_to: date ? date.toISOString() : undefined,
                })
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onFilterChange({
              pokemon_id: undefined,
              region: undefined,
              weather: undefined,
              time_of_day: undefined,
              date_from: undefined,
              date_to: undefined,
            })
          }
        >
          <X className="mr-1 h-4 w-4" />
          Clear
          <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-[10px]">
            {activeFilterCount}
          </Badge>
        </Button>
      )}
    </div>
  );
}
