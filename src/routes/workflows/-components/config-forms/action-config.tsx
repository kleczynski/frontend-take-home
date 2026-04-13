import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ActionData, ActionType } from "@/types/workflow";
import { ACTION_TYPES } from "@/types/workflow";

interface ActionConfigProps {
  data: ActionData;
  onChange: (data: ActionData) => void;
}

export function ActionConfig({ data, onChange }: ActionConfigProps) {
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
        <Label>Action</Label>
        <Select
          value={data.action}
          onValueChange={(v) => onChange({ ...data, action: v as ActionType })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTION_TYPES.map((a) => (
              <SelectItem key={a.value} value={a.value}>
                {a.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {data.action === "assign_campaign" && (
        <div className="space-y-2">
          <Label>Campaign ID</Label>
          <Input
            value={data.campaign_id ?? ""}
            onChange={(e) => onChange({ ...data, campaign_id: e.target.value })}
            placeholder="Campaign UUID"
          />
        </div>
      )}
      {data.action === "add_note" && (
        <div className="space-y-2">
          <Label>Note Text</Label>
          <Textarea
            value={data.note ?? ""}
            onChange={(e) => onChange({ ...data, note: e.target.value })}
            placeholder="Note to add to the sighting..."
            rows={3}
          />
        </div>
      )}
    </div>
  );
}
