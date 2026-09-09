import { createFileRoute, Link } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/mosaic/EmptyState";
import { MosaicCard } from "@/components/mosaic/MosaicCard";
import { categories } from "@/data/mock";
import { tileTypeCopy } from "@/lib/format";
import { useMosaicStore } from "@/lib/mosaic-store";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — MOSAIC" },
      { name: "description", content: "Search mosaics, topics, contributions and people across everything happening here." },
      { property: "og:title", content: "Search — MOSAIC" },
      { property: "og:description", content: "One search across mosaics, tiles, topics and people." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { mosaics, tiles, users, getUser } = useMosaicStore();
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return null;
    return {
      mosaics: mosaics.filter((m) => `${m.title} ${m.description} ${m.prompt} ${m.theme}`.toLowerCase().includes(term)),
      tiles: tiles.filter((t) => t.text.toLowerCase().includes(term)).slice(0, 12),
      people: users.filter((u) => `${u.name} ${u.handle} ${u.statement} ${u.interests.join(" ")}`.toLowerCase().includes(term)),
      topics: categories.filter((c) => `${c.label} ${c.blurb}`.toLowerCase().includes(term)),
    };
  }, [term, mosaics, tiles, users]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="rule-label">Everything, in one place</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Search</h1>

      <label className="mt-6 flex items-center gap-3 rounded-full border border-border bg-surface px-5 py-3.5 focus-within:border-foreground/40">
        <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <span className="sr-only">Search mosaics, tiles, topics and people</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What are you curious about?"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </label>

      {!results && (
        <p className="mt-8 text-sm text-muted-foreground">Try “repair”, “quiet”, “city”, or a person's name.</p>
      )}

      {results && (
        <div className="mt-10 space-y-12" aria-live="polite">
          <Group title={`Mosaics · ${results.mosaics.length}`}>
            {results.mosaics.length === 0 ? <Nothing /> : (
              <div className="grid gap-4 sm:grid-cols-2">
                {results.mosaics.map((m) => <MosaicCard key={m.id} mosaic={m} compact />)}
              </div>
            )}
          </Group>

          <Group title={`Contributions · ${results.tiles.length}`}>
            {results.tiles.length === 0 ? <Nothing /> : (
              <ul className="space-y-3">
                {results.tiles.map((t) => (
                  <li key={t.id} className="tile-surface rounded-2xl p-4">
                    <span className="rule-label" style={{ color: tileTypeCopy[t.type]?.color }}>{tileTypeCopy[t.type]?.label}</span>
                    <p className="mt-2 text-sm">{t.text}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {getUser(t.authorId).name} ·{" "}
                      <Link to="/mosaic/$mosaicId" params={{ mosaicId: t.mosaicId }} className="font-medium text-foreground underline underline-offset-2">
                        Open mosaic
                      </Link>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Group>

          <Group title={`People · ${results.people.length}`}>
            {results.people.length === 0 ? <Nothing /> : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {results.people.map((u) => (
                  <li key={u.id} className="tile-surface flex items-start gap-3 rounded-2xl p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-semibold" style={{ background: `color-mix(in oklab, ${u.accent} 25%, var(--surface))` }}>
                      {u.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.handle}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{u.statement}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Group>

          <Group title={`Topics · ${results.topics.length}`}>
            {results.topics.length === 0 ? <Nothing /> : (
              <ul className="flex flex-wrap gap-2">
                {results.topics.map((c) => (
                  <li key={c.id} className="rounded-full border border-border bg-surface px-4 py-2 text-sm">{c.label}</li>
                ))}
              </ul>
            )}
          </Group>
        </div>
      )}
    </section>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="rule-label">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Nothing() {
  return <EmptyState title="No matches" description="Nothing here for that word yet." />;
}
