// components/dashboard/feedback/SortFilter.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "newest",         label: "Newest First"   },
  { value: "oldest",         label: "Oldest First"   },
  { value: "highest_rating", label: "Highest Rating" },
  { value: "lowest_rating",  label: "Lowest Rating"  },
];

export default function SortFilter({
  value,
  onChange,
}: {
  value:    string;
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-40 h-8 text-xs">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value} className="text-xs">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}