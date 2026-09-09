import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/mosaic/EmptyState";
import { MosaicCard } from "@/components/mosaic/MosaicCard";
import { tileTypeCopy, timeAgo } from "@/lib/format";
import { useMosaicStore } from "@/lib/mosaic-store";

export const Route = createFileRoute("/my-space")({
  head: () => ({
    meta: [
      { title: "My Space — MOSAIC" },
      { name: "description", content: "Your saved mosaics, saved contributions, the mosaics you created, drafts and recent activity." },
      { property: "og:title", content: "My Space — MOSAIC" },
      { property: "og:description", content: "Everything you've kept, made or started." },
    ],
  }),
  component: MySpace,
});

function MySpace() {
  const store = useMosaicStore();
  const saved = store.mosaics.filter((m) => store.savedMosaics.includes(m.id));
  const created = store.mosaics.filter((m) => m.createdBy === store.me.id);
  const joined = store.mosaics.filter((m) => store.joined.includes(m.id));
  const savedTiles = store.tiles.filter((t) => store.savedTiles.includes(t.id));

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="rule-label">Yours only</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">My Space</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Nothing here is public. It all lives in this browser.
      </p>

      <div className="mt-10 space-y-12">
        <Block title={`Saved mosaics · ${saved.length}`}>
          {saved.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{saved.map((m) => <MosaicCard key={m.id} mosaic={m} compact />)}</div>
          ) : (
            <EmptyState title="Nothing saved" description="Tap the bookmark on any mosaic to keep it here." action={<Link to="/discover" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background">Discover mosaics</Link>} />
          )}
        </Block>

        <Block title={`Created by you · ${created.length}`}>
          {created.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{created.map((m) => <MosaicCard key={m.id} mosaic={m} compact />)}</div>
          ) : (
            <EmptyState title="No mosaics yet" description="Start one with a question you actually want answered." action={<Link to="/create" className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-signal-foreground">Create a mosaic</Link>} />
          )}
        </Block>

        <Block title={`Joined · ${joined.length}`}>
          {joined.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{joined.map((m) => <MosaicCard key={m.id} mosaic={m} compact />)}</div>
          ) : (
            <EmptyState title="Not in any mosaic" description="Joining one puts its prompt within reach." />
          )}
        </Block>

        <Block title={`Saved contributions · ${savedTiles.length}`}>
          {savedTiles.length ? (
            <ul className="space-y-3">
              {savedTiles.map((t) => (
                <li key={t.id} className="tile-surface rounded-2xl p-4">
                  <span className="rule-label" style={{ color: tileTypeCopy[t.type]?.color }}>{tileTypeCopy[t.type]?.label}</span>
                  <p className="mt-2 text-sm">{t.text}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {store.getUser(t.authorId).name} ·{" "}
                    <Link to="/mosaic/$mosaicId" params={{ mosaicId: t.mosaicId }} className="font-medium text-foreground underline underline-offset-2">Open mosaic</Link>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No saved tiles" description="Open any tile and save it to come back to it." />
          )}
        </Block>

        <Block title={`Drafts · ${store.drafts.length}`}>
          {store.drafts.length ? (
            <ul className="space-y-3">
              {store.drafts.map((d) => (
                <li key={d.id} className="tile-surface flex items-start gap-3 rounded-2xl p-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{d.text}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Saved {timeAgo(d.savedAt)} ·{" "}
                      <Link to="/mosaic/$mosaicId" params={{ mosaicId: d.mosaicId }} className="font-medium text-foreground underline underline-offset-2">Finish it</Link>
                    </p>
                  </div>
                  <button type="button" onClick={() => store.removeDraft(d.id)} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No drafts" description="Half-formed thoughts you save will wait here." />
          )}
        </Block>

        <Block title="Recent interactions">
          {store.recent.length ? (
            <ul className="space-y-2">
              {store.recent.map((r) => (
                <li key={r.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal" />
                  <span className="min-w-0 flex-1">{r.text}</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(r.time)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Nothing yet" description="Your resonates, tiles and saves will show up here." />
          )}
        </Block>
      </div>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="rule-label">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
