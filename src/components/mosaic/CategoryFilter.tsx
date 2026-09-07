import { categories } from "@/data/mock";
import type { CategoryId } from "@/data/types";

export function CategoryFilter({
  value,
  onChange,
}: {
  value: CategoryId | "all";
  onChange: (next: CategoryId | "all") => void;
}) {
  const options: { id: CategoryId | "all"; label: string }[] = [
    { id: "all", label: "All" },
    ...categories.map((c) => ({ id: c.id as CategoryId | "all", label: c.label })),
  ];

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.id)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-surface text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
