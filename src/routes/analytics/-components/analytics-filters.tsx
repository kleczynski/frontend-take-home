import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { REGIONS } from "@/types/sighting";
import type { AnalyticsSearch } from "../index";

interface AnalyticsFiltersProps {
  filters: AnalyticsSearch;
  onFilterChange: (updates: Partial<AnalyticsSearch>) => void;
}

export function AnalyticsFilters({ filters, onFilterChange }: AnalyticsFiltersProps) {
  const hasFilters = filters.region || filters.date_from || filters.date_to;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs">Region</Label>
        <Select
          value={filters.region ?? "__all__"}
          onValueChange={(v) => onFilterChange({ region: !v || v === "__all__" ? undefined : v })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Regions" />
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
        <Label className="text-muted-foreground text-xs">From</Label>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className={cn(
                  "w-[150px] justify-start text-left font-normal",
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
                  "w-[150px] justify-start text-left font-normal",
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
              region: undefined,
              date_from: undefined,
              date_to: undefined,
            })
          }
        >
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
