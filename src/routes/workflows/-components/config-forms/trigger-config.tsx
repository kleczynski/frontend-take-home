import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TriggerData, TriggerEvent } from "@/types/workflow";
import { TRIGGER_EVENTS } from "@/types/workflow";

interface TriggerConfigProps {
  data: TriggerData;
  onChange: (data: TriggerData) => void;
}

export function TriggerConfig({ data, onChange }: TriggerConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          value={data.label}
          onChange={(e) => onChange({ ...data, label: e.target.value })}
          placeholder="Node label"
        />
      </div>
      <div className="space-y-2">
        <Label>Event Type</Label>
        <Select
          value={data.event}
          onValueChange={(v) => onChange({ ...data, event: v as TriggerEvent })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TRIGGER_EVENTS.map((e) => (
              <SelectItem key={e.value} value={e.value}>
                {e.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
