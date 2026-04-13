import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterData, FilterField, FilterOp } from "@/types/workflow";
import { FILTER_FIELDS, FILTER_OPS } from "@/types/workflow";

interface FilterConfigProps {
  data: FilterData;
  onChange: (data: FilterData) => void;
}

export function FilterConfig({ data, onChange }: FilterConfigProps) {
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
        <Label>Field</Label>
        <Select
          value={data.field}
          onValueChange={(v) => onChange({ ...data, field: v as FilterField })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTER_FIELDS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Operator</Label>
        <Select value={data.op} onValueChange={(v) => onChange({ ...data, op: v as FilterOp })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Value</Label>
        <Input
          value={data.value}
          onChange={(e) => onChange({ ...data, value: e.target.value })}
          placeholder="Value to compare against"
        />
      </div>
    </div>
  );
}
