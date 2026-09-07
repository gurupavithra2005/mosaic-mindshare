import { Link } from "@tanstack/react-router";
import { Bookmark, Users, Layers, ArrowRight } from "lucide-react";
import { categories } from "@/data/mock";
import type { Mosaic } from "@/data/types";
import { modeCopy } from "@/lib/format";
import { useMosaicStore } from "@/lib/mosaic-store";
import { toast } from "sonner";

const activityCopy = {
  quiet: "Quiet",
  steady: "Steady",
  buzzing: "Buzzing",
} as const;

export function MosaicCard({ mosaic, compact = false }: { mosaic: Mosaic; compact?: boolean }) {
  const { savedMosaics, toggleSaveMosaic } = useMosaicStore();
  const saved = savedMosaics.includes(mosaic.id);
  const category = categories.find((c) => c.id === mosaic.category);

  return (
    <article className="tile-surface relative flex h-full flex-col overflow-hidden rounded-2xl">
      <div
        aria-hidden
        className={compact ? "h-16 w-full" : "h-24 w-full"}
        style={{ background: mosaic.cover }}
      />
      <button
        type="button"
        onClick={() => {
          toggleSaveMosaic(mosaic.id);
          toast(saved ? "Removed from My Space" : "Saved to My Space");
        }}
        aria-pressed={saved}
        aria-label={saved ? `Unsave ${mosaic.title}` : `Save ${mosaic.title}`}
        className="absolute right-3 top-3 rounded-full bg-background/85 p-2 text-foreground shadow-sm backdrop-blur transition-transform hover:scale-105"
      >
        <Bookmark className={`h-4 w-4 ${saved ? "fill-signal text-signal" : ""}`} aria-hidden />
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rule-label">{category?.label}</span>
          <span aria-hidden className="text-muted-foreground/40">
            /
          </span>
          <span className="rule-label" style={{ color: "var(--signal)" }}>
            {modeCopy[mosaic.mode]?.label}
          </span>
        </div>

        <h3 className="text-lg font-semibold leading-snug">
          <Link
            to="/mosaic/$mosaicId"
            params={{ mosaicId: mosaic.id }}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {mosaic.title}
          </Link>
        </h3>

        <p className="line-clamp-2 text-sm text-muted-foreground">{mosaic.description}</p>

        <p className="rounded-lg border border-dashed border-border bg-surface-2/60 px-3 py-2 text-sm italic text-foreground/80">
          “{mosaic.prompt}”
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" aria-hidden />
            {mosaic.participants.toLocaleString()} people
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" aria-hidden />
            {mosaic.contributions} tiles
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  mosaic.activity === "buzzing"
                    ? "var(--signal)"
                    : mosaic.activity === "steady"
                      ? "var(--perspective)"
                      : "var(--muted-foreground)",
              }}
            />
            {activityCopy[mosaic.activity]}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 font-medium text-foreground">
            Enter <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}
