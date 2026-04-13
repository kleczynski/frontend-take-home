import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRangers } from "@/hooks/use-rangers";
import { useCreateSighting } from "@/hooks/use-sightings";
import { PokemonCombobox } from "@/components/pokemon-combobox";
import { WEATHER_OPTIONS, TIME_OF_DAY_OPTIONS, REGIONS } from "@/types/sighting";
import { toast } from "sonner";
import { capitalize } from "@/lib/utils";

interface LogSightingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogSightingDialog({ open, onOpenChange }: LogSightingDialogProps) {
  const { data: rangers } = useRangers();
  const createSighting = useCreateSighting();
  const [selectedPokemonName, setSelectedPokemonName] = useState("");

  const form = useForm({
    defaultValues: {
      ranger_id: "",
      pokemon_id: 0,
      region: "",
      route: "",
      date: new Date().toISOString().slice(0, 16),
      weather: "" as string,
      time_of_day: "" as string,
      height: 0,
      weight: 0,
      is_shiny: false,
      notes: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await createSighting.mutateAsync({
          data: {
            pokemon_id: value.pokemon_id,
            region: value.region,
            route: value.route,
            date: new Date(value.date).toISOString(),
            weather: value.weather as "sunny" | "rainy" | "snowy" | "sandstorm" | "foggy" | "clear",
            time_of_day: value.time_of_day as "morning" | "day" | "night",
            height: value.height,
            weight: value.weight,
            is_shiny: value.is_shiny,
            notes: value.notes || undefined,
          },
          rangerId: value.ranger_id,
        });
        toast.success("Sighting logged!", {
          description: selectedPokemonName
            ? `${selectedPokemonName} has been recorded`
            : "Your sighting has been recorded",
        });
        onOpenChange(false);
        form.reset();
        setSelectedPokemonName("");
      } catch (err) {
        toast.error("Failed to log sighting", {
          description: err instanceof Error ? err.message : "Unknown error",
        });
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log New Sighting</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="ranger_id">
            {(field) => (
              <div className="space-y-2">
                <Label>Ranger *</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ranger">
                      {rangers?.find((r) => r.id === field.state.value)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {rangers?.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <form.Field name="pokemon_id">
            {(field) => (
              <div className="space-y-2">
                <Label>Pokémon *</Label>
                <PokemonCombobox
                  value={field.state.value}
                  onChange={(id) => field.handleChange(id)}
                  onNameChange={setSelectedPokemonName}
                />
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="region">
              {(field) => (
                <div className="space-y-2">
                  <Label>Region *</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="route">
              {(field) => (
                <div className="space-y-2">
                  <Label>Route *</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Route 1"
                  />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="date">
            {(field) => (
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="datetime-local"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="weather">
              {(field) => (
                <div className="space-y-2">
                  <Label>Weather *</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select weather" />
                    </SelectTrigger>
                    <SelectContent>
                      {WEATHER_OPTIONS.map((w) => (
                        <SelectItem key={w} value={w}>
                          {capitalize(w)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="time_of_day">
              {(field) => (
                <div className="space-y-2">
                  <Label>Time of Day *</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OF_DAY_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {capitalize(t)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="height">
              {(field) => (
                <div className="space-y-2">
                  <Label>Height (m) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="weight">
              {(field) => (
                <div className="space-y-2">
                  <Label>Weight (kg) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="is_shiny">
            {(field) => (
              <div className="flex items-center gap-3">
                <Switch
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
                <Label>Shiny variant</Label>
              </div>
            )}
          </form.Field>

          <form.Field name="notes">
            {(field) => (
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Optional field notes..."
                  rows={3}
                />
              </div>
            )}
          </form.Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging..." : "Log Sighting"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
