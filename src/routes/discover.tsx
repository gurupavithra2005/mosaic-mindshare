import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CategoryFilter } from "@/components/mosaic/CategoryFilter";
import { DiscoveryCard } from "@/components/mosaic/DiscoveryCard";
import { EmptyState } from "@/components/mosaic/EmptyState";
import { SiteFooter } from "@/components/mosaic/SiteFooter";
import type { CategoryId } from "@/data/types";
import { lensOf, lenses, type Lens } from "@/lib/covers";
import { useMosaicStore } from "@/lib/mosaic-store";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Explore new perspectives — MOSAIC" },
      {
        name: "description",
        content: "Browse mosaics across people, ideas, communities and experiences, and find one worth joining.",
      },
      { property: "og:title", content: "Explore new perspectives — MOSAIC" },
      { property: "og:description", content: "People · Ideas · Communities · Experiences" },
    ],
  }),
  component: Discover,
});

function Discover() {
  const { mosaics } = useMosaicStore();
  const [lens, setLens] = useState<Lens | "all">("all");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mosaics.filter((m) => {
      if (lens !== "all" && lensOf[m.category] !== lens) return false;
      if (category !== "all" && m.category !== category) return false;
      if (!q) return true;
      return `${m.title} ${m.description} ${m.prompt} ${m.theme}`.toLowerCase().includes(q);
    });
  }, [mosaics, lens, category, query]);

  return (
    <div className="paper-grid">
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <p className="rule-label">People · Ideas · Communities · Experiences</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
          Explore new perspectives
        </h1>

        <label className="mt-7 flex max-w-2xl items-center gap-3 rounded-full border border-border bg-surface px-5 py-3.5 focus-within:border-foreground/40">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="sr-only">Search mosaics</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you curious about?"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>

        <div role="group" aria-label="Filter by lens" className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {lenses.map((l) => {
            const active = lens === l.id;
            return (
              <button
                key={l.id}
                type="button"
                aria-pressed={active}
                onClick={() => setLens(l.id)}
                className={`shrink-0 rounded-2xl border px-4 py-2.5 text-left transition-colors ${
                  active ? "border-foreground bg-foreground text-background" : "border-border bg-surface hover:border-foreground/40"
                }`}
              >
                <span className="block text-sm font-semibold">{l.label}</span>
                <span className={`block text-xs ${active ? "text-background/70" : "text-muted-foreground"}`}>
                  {l.blurb}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <CategoryFilter value={category} onChange={setCategory} />
        </div>

        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          {results.length} mosaic{results.length === 1 ? "" : "s"}
        </p>

        {results.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="Nothing matches yet"
              description="Try a different lens, category, or a shorter search."
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((m, i) => (
              <DiscoveryCard key={m.id} mosaic={m} size={i === 0 ? "lg" : "md"} />
            ))}
          </div>
        )}
      </section>

      <div className="mt-16">
        <SiteFooter />
      </div>
    </div>
  );
}
