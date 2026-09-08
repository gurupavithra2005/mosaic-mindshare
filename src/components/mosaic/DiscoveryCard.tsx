import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bookmark, Layers, Users } from "lucide-react";
import { toast } from "sonner";
import { categories } from "@/data/mock";
import type { Mosaic } from "@/data/types";
import { modeCopy } from "@/lib/format";
import { coverImageFor } from "@/lib/covers";
import { useMosaicStore } from "@/lib/mosaic-store";

const activityCopy = { quiet: "Quiet", steady: "Steady", buzzing: "Buzzing" } as const;

export function DiscoveryCard({ mosaic, size = "md" }: { mosaic: Mosaic; size?: "md" | "lg" }) {
  const { savedMosaics, toggleSaveMosaic, users, tilesOf } = useMosaicStore();
  const saved = savedMosaics.includes(mosaic.id);
  const category = categories.find((c) => c.id === mosaic.category);
  const contributors = Array.from(new Set(tilesOf(mosaic.id).map((t) => t.authorId)))
    .slice(0, 4)
    .map((id) => users.find((u) => u.id === id))
    .filter(Boolean);

  return (
    <article className="tile-surface group relative flex h-full flex-col overflow-hidden rounded-3xl">
      <div className={`relative w-full overflow-hidden ${size === "lg" ? "h-56 sm:h-72" : "h-40"}`}>
        <img
          src={coverImageFor(mosaic)}
          alt={`Cover artwork for ${mosaic.title}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span aria-hidden className="absolute inset-0 opacity-45" style={{ background: mosaic.cover }} />
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24"
          style={{ background: "linear-gradient(to top, color-mix(in oklab, var(--foreground) 60%, transparent), transparent)" }}
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] backdrop-blur">
            {category?.label}
          </span>
          <span className="rounded-full bg-signal px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-signal-foreground">
            {modeCopy[mosaic.mode]?.label}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            toggleSaveMosaic(mosaic.id);
            toast(saved ? "Removed from My Space" : "Saved to My Space");
          }}
          aria-pressed={saved}
          aria-label={saved ? `Unsave ${mosaic.title}` : `Save ${mosaic.title}`}
          className="absolute right-4 top-4 z-10 rounded-full bg-background/90 p-2 shadow-sm backdrop-blur transition-transform hover:scale-110"
        >
          <Bookmark className={`h-4 w-4 ${saved ? "fill-signal text-signal" : ""}`} aria-hidden />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className={`font-semibold leading-snug ${size === "lg" ? "text-2xl" : "text-lg"}`}>
          <Link
            to="/mosaic/$mosaicId"
            params={{ mosaicId: mosaic.id }}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {mosaic.title}
          </Link>
        </h3>

        <p className="line-clamp-2 text-sm text-muted-foreground">{mosaic.description}</p>

        <p className="rounded-xl border border-dashed border-border bg-surface-2/60 px-3 py-2 text-sm italic text-foreground/80">
          “{mosaic.prompt}”
        </p>

        <div className="mt-auto flex items-center gap-3 pt-2">
          <ul className="flex -space-x-2" aria-label="Recent contributors">
            {contributors.map((u) => (
              <li
                key={u!.id}
                title={u!.name}
                className="grid h-8 w-8 place-items-center rounded-full border-2 border-surface text-[11px] font-semibold"
                style={{ background: `color-mix(in oklab, ${u!.accent} 22%, var(--surface))` }}
              >
                {u!.initials}
              </li>
            ))}
            <li className="grid h-8 w-8 place-items-center rounded-full border-2 border-surface bg-secondary text-[10px] font-semibold">
              +{Math.max(0, mosaic.participants - contributors.length)}
            </li>
          </ul>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" aria-hidden />
            {mosaic.participants.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Layers className="h-3.5 w-3.5" aria-hidden />
            {mosaic.contributions}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
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
            {activityCopy[mosaic.activity]} activity
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
            Enter mosaic
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}
