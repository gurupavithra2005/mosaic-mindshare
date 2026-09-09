import { createFileRoute } from "@tanstack/react-router";
import { MosaicCard } from "@/components/mosaic/MosaicCard";
import { SiteFooter } from "@/components/mosaic/SiteFooter";
import { categories } from "@/data/mock";
import { useMosaicStore } from "@/lib/mosaic-store";

export const Route = createFileRoute("/communities")({
  head: () => ({
    meta: [
      { title: "Communities — MOSAIC" },
      { name: "description", content: "Groups of people building something together, grouped by the themes they care about." },
      { property: "og:title", content: "Communities — MOSAIC" },
      { property: "og:description", content: "Find the group already thinking about what you're thinking about." },
    ],
  }),
  component: Communities,
});

function Communities() {
  const { mosaics, joined, toggleJoin } = useMosaicStore();

  return (
    <div className="paper-grid">
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <p className="rule-label">Where people gather</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Communities</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Every community is a cluster of mosaics around one theme. Join one and its tiles show up in
          My Space.
        </p>

        <div className="mt-10 space-y-14">
          {categories.map((cat) => {
            const group = mosaics.filter((m) => m.category === cat.id);
            if (group.length === 0) return null;
            const members = group.reduce((n, m) => n + m.participants, 0);
            const isJoined = group.every((m) => joined.includes(m.id));
            return (
              <div key={cat.id}>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-tight">{cat.label}</h2>
                    <p className="mt-1 max-w-xl text-sm text-muted-foreground">{cat.blurb}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {members.toLocaleString()} people · {group.length} mosaic{group.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => group.forEach((m) => (isJoined ? joined.includes(m.id) && toggleJoin(m.id) : !joined.includes(m.id) && toggleJoin(m.id)))}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      isJoined ? "border-border bg-secondary" : "border-foreground bg-foreground text-background"
                    }`}
                  >
                    {isJoined ? "Joined" : "Join community"}
                  </button>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {group.map((m) => (
                    <MosaicCard key={m.id} mosaic={m} compact />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-16">
        <SiteFooter />
      </div>
    </div>
  );
}
