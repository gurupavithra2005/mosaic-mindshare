import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { MosaicCard } from "@/components/mosaic/MosaicCard";
import { tileTypeCopy, timeAgo } from "@/lib/format";
import { useAuth } from "@/lib/auth-store";
import { useMosaicStore } from "@/lib/mosaic-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — MOSAIC" },
      { name: "description", content: "A profile built from shared interests and contributions instead of follower counts." },
      { property: "og:title", content: "Your profile — MOSAIC" },
      { property: "og:description", content: "Contribution identity, not a popularity score." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const store = useMosaicStore();
  const { account, signOut } = useAuth();
  const me = store.me;
  const myTiles = store.tiles.filter((t) => t.authorId === me.id);
  const joined = store.mosaics.filter((m) => store.joined.includes(m.id));
  const name = account?.name ?? me.name;
  const initials = account?.initials ?? me.initials;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="tile-surface rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-start gap-5">
          <span className="grid h-16 w-16 place-items-center rounded-full text-lg font-semibold" style={{ background: `color-mix(in oklab, ${me.accent} 28%, var(--surface))` }}>
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{name}</h1>
            <p className="text-sm text-muted-foreground">{account?.email ?? me.handle}</p>
            <p className="mt-3 max-w-xl">{me.statement}</p>
          </div>
          {account ? (
            <button type="button" onClick={() => { signOut(); toast("Signed out"); }} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
              Sign out
            </button>
          ) : (
            <Link to="/auth" className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">Sign in</Link>
          )}
        </div>

        <ul className="mt-6 flex flex-wrap gap-2">
          {me.interests.map((i) => (
            <li key={i} className="rounded-full border border-border bg-surface-2/60 px-3.5 py-1.5 text-sm">{i}</li>
          ))}
        </ul>

        <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-5 text-center">
          <Stat label="Mosaics joined" value={joined.length} />
          <Stat label="Tiles added" value={myTiles.length} />
          <Stat label="Perspectives" value={me.perspectives} />
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">No follower counts here — on purpose.</p>
      </div>

      <h2 className="mt-12 rule-label">Mosaics you're part of</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {joined.map((m) => <MosaicCard key={m.id} mosaic={m} compact />)}
      </div>

      <h2 className="mt-12 rule-label">Your contributions · {myTiles.length}</h2>
      <ul className="mt-4 space-y-3">
        {myTiles.map((t) => (
          <li key={t.id} className="tile-surface rounded-2xl p-4">
            <span className="rule-label" style={{ color: tileTypeCopy[t.type]?.color }}>{tileTypeCopy[t.type]?.label}</span>
            <p className="mt-2 text-sm">{t.text}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {timeAgo(t.createdAt)} ·{" "}
              <Link to="/mosaic/$mosaicId" params={{ mosaicId: t.mosaicId }} className="font-medium text-foreground underline underline-offset-2">Open mosaic</Link>
            </p>
          </li>
        ))}
        {myTiles.length === 0 && <li className="text-sm text-muted-foreground">Nothing yet — add a tile in any mosaic.</li>}
      </ul>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-semibold">{value}</dd>
    </div>
  );
}
