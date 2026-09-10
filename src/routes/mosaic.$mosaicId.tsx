import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, HelpCircle, Heart, Layers, MessageSquarePlus, Send, Sparkles, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/mosaic/EmptyState";
import { categories } from "@/data/mock";
import type { Tile, TileType } from "@/data/types";
import { coverImageFor } from "@/lib/covers";
import { modeCopy, tileTypeCopy, timeAgo } from "@/lib/format";
import { useMosaicStore } from "@/lib/mosaic-store";

export const Route = createFileRoute("/mosaic/$mosaicId")({
  head: () => ({
    meta: [
      { title: "Inside a mosaic — MOSAIC" },
      { name: "description", content: "A canvas of connected tiles. Resonate, add a perspective, build on it, ask or support." },
      { property: "og:title", content: "Inside a mosaic — MOSAIC" },
      { property: "og:description", content: "Contributions connect to each other instead of stacking into a feed." },
    ],
  }),
  component: MosaicSpace,
});

const tileTypes: TileType[] = ["idea", "question", "perspective", "story", "challenge", "resource"];

function MosaicSpace() {
  const { mosaicId } = Route.useParams();
  const store = useMosaicStore();
  const mosaic = store.getMosaic(mosaicId);
  const [openTile, setOpenTile] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [type, setType] = useState<TileType>("perspective");

  if (!mosaic) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          title="This mosaic isn't here"
          description="It may have been created in another browser session."
          action={<Link to="/discover" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background">Back to discover</Link>}
        />
      </section>
    );
  }

  const tiles = store.tilesOf(mosaic.id);
  const roots = tiles.filter((t) => !t.parentId);
  const joined = store.joined.includes(mosaic.id);
  const saved = store.savedMosaics.includes(mosaic.id);
  const active = openTile ? tiles.find((t) => t.id === openTile) : undefined;

  return (
    <div>
      <header className="relative overflow-hidden border-b border-border">
        <img src={coverImageFor(mosaic)} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <span aria-hidden className="absolute inset-0 opacity-30" style={{ background: mosaic.cover }} />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <Link to="/discover" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Discover
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rule-label">{categories.find((c) => c.id === mosaic.category)?.label}</span>
            <span className="rounded-full bg-signal px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-signal-foreground">
              {modeCopy[mosaic.mode]?.label}
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-5xl">{mosaic.title}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{mosaic.description}</p>
          <p className="mt-5 max-w-2xl rounded-2xl border border-dashed border-border bg-surface/80 px-4 py-3 text-base italic backdrop-blur">
            “{mosaic.prompt}”
          </p>
          <p className="mt-4 text-sm text-muted-foreground">{modeCopy[mosaic.mode]?.hint}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => { store.toggleJoin(mosaic.id); toast(joined ? "Left the mosaic" : "You're in — add a tile"); }}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${joined ? "border border-border bg-surface" : "bg-foreground text-background"}`}
            >
              <UserPlus className="h-4 w-4" aria-hidden /> {joined ? "Joined" : "Join mosaic"}
            </button>
            <button
              type="button"
              onClick={() => { store.toggleSaveMosaic(mosaic.id); toast(saved ? "Removed from My Space" : "Saved to My Space"); }}
              aria-pressed={saved}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold"
            >
              <Bookmark className={`h-4 w-4 ${saved ? "fill-signal text-signal" : ""}`} aria-hidden /> {saved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => { void navigator.clipboard?.writeText(window.location.href); toast("Invite link copied"); }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold"
            >
              <Send className="h-4 w-4" aria-hidden /> Invite
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim().length < 4) return;
            store.addTile({ mosaicId: mosaic.id, type, text: text.trim() });
            setText("");
            toast("Your tile joined the mosaic");
          }}
          className="tile-surface rounded-2xl p-4 sm:p-5"
        >
          <label htmlFor="new-tile" className="rule-label">Add your tile</label>
          <textarea
            id="new-tile"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Answer the prompt in your own words…"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground/50"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {tileTypes.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={type === t}
                onClick={() => setType(t)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${type === t ? "border-foreground bg-foreground text-background" : "border-border"}`}
              >
                {tileTypeCopy[t]?.label}
              </button>
            ))}
            <button type="submit" className="ml-auto rounded-full bg-signal px-5 py-2 text-sm font-semibold text-signal-foreground">
              Contribute
            </button>
            <button
              type="button"
              onClick={() => { if (text.trim()) { store.saveDraft(mosaic.id, text.trim()); setText(""); toast("Draft saved to My Space"); } }}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
            >
              Save draft
            </button>
          </div>
        </form>

        <div className="mt-8 flex items-center gap-3">
          <p className="rule-label">The canvas</p>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Layers className="h-3.5 w-3.5" aria-hidden /> {tiles.length} tiles
          </span>
        </div>

        <div className="mt-4 columns-1 gap-4 sm:columns-2 xl:columns-3 [&>*]:mb-4">
          {roots.map((tile) => (
            <TileCard key={tile.id} tile={tile} onOpen={() => setOpenTile(tile.id)} />
          ))}
        </div>
      </section>

      {active && <TileDetail tile={active} onClose={() => setOpenTile(null)} onOpen={setOpenTile} />}
    </div>
  );
}

function TileCard({ tile, onOpen }: { tile: Tile; onOpen: () => void }) {
  const { getUser, childrenOf } = useMosaicStore();
  const author = getUser(tile.authorId);
  const kids = childrenOf(tile.id);
  const meta = tileTypeCopy[tile.type];

  return (
    <article className="tile-surface break-inside-avoid rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: meta?.color }} />
        <span className="rule-label">{meta?.label}</span>
        <span className="ml-auto text-xs text-muted-foreground">{timeAgo(tile.createdAt)}</span>
      </div>
      <button type="button" onClick={onOpen} className="mt-3 block w-full text-left">
        <p className="text-sm leading-relaxed">{tile.text}</p>
      </button>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold" style={{ background: `color-mix(in oklab, ${author.accent} 25%, var(--surface))` }}>
          {author.initials}
        </span>
        <span className="truncate">{author.name}</span>
        <span className="ml-auto inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" aria-hidden />{tile.reactions.resonate}</span>
        {kids.length > 0 && <span className="inline-flex items-center gap-1"><Layers className="h-3.5 w-3.5" aria-hidden />{kids.length}</span>}
      </div>
    </article>
  );
}

function TileDetail({ tile, onClose, onOpen }: { tile: Tile; onClose: () => void; onOpen: (id: string) => void }) {
  const store = useMosaicStore();
  const author = store.getUser(tile.authorId);
  const responses = store.childrenOf(tile.id);
  const [reply, setReply] = useState("");
  const [replyType, setReplyType] = useState<"perspective" | "idea" | "question">("perspective");
  const resonated = store.resonated.includes(tile.id);
  const supported = store.supported.includes(tile.id);
  const savedTile = store.savedTiles.includes(tile.id);

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex justify-end bg-foreground/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Tile detail"
    >
      <button type="button" aria-label="Close tile" className="flex-1" onClick={onClose} />
      <div className="h-full w-full max-w-xl overflow-y-auto bg-background p-5 shadow-xl sm:p-7">
        <div className="flex items-center justify-between">
          <span className="rule-label" style={{ color: tileTypeCopy[tile.type]?.color }}>
            {tileTypeCopy[tile.type]?.label}
          </span>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-secondary">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <p className="mt-4 text-lg leading-relaxed">{tile.text}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          {author.name} · {timeAgo(tile.createdAt)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{author.statement}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <ActionButton active={resonated} onClick={() => store.toggleResonate(tile.id)} icon={<Heart className="h-4 w-4" aria-hidden />} label={`Resonate · ${tile.reactions.resonate}`} />
          <ActionButton active={supported} onClick={() => store.toggleSupport(tile.id)} icon={<Sparkles className="h-4 w-4" aria-hidden />} label={`Support · ${tile.reactions.support}`} />
          <ActionButton active={savedTile} onClick={() => { store.toggleSaveTile(tile.id); toast(savedTile ? "Removed from My Space" : "Saved to My Space"); }} icon={<Bookmark className="h-4 w-4" aria-hidden />} label={savedTile ? "Saved" : "Save"} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (reply.trim().length < 3) return;
            if (replyType === "question") store.askOn(tile.id, reply.trim());
            else
              store.addTile({
                mosaicId: tile.mosaicId,
                type: replyType,
                text: reply.trim(),
                parentId: tile.id,
                intent: replyType === "idea" ? "expand" : "connect",
              });
            setReply("");
            toast(replyType === "question" ? "Question asked" : replyType === "idea" ? "You built on it" : "Perspective added");
          }}
          className="mt-7 rounded-2xl border border-border bg-surface-2/60 p-4"
        >
          <label htmlFor="reply" className="rule-label">Respond</label>
          <textarea
            id="reply"
            rows={3}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Add a perspective, build on it, or ask something…"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground/50"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Choice active={replyType === "perspective"} onClick={() => setReplyType("perspective")} icon={<MessageSquarePlus className="h-4 w-4" aria-hidden />} label="Add perspective" />
            <Choice active={replyType === "idea"} onClick={() => setReplyType("idea")} icon={<Layers className="h-4 w-4" aria-hidden />} label="Build on it" />
            <Choice active={replyType === "question"} onClick={() => setReplyType("question")} icon={<HelpCircle className="h-4 w-4" aria-hidden />} label="Ask" />
            <button type="submit" className="ml-auto rounded-full bg-signal px-5 py-2 text-sm font-semibold text-signal-foreground">
              Send
            </button>
          </div>
        </form>

        <h2 className="mt-8 rule-label">Connected tiles · {responses.length}</h2>
        <ul className="mt-3 space-y-3">
          {responses.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => onOpen(r.id)} className="tile-surface block w-full rounded-2xl p-4 text-left">
                <span className="rule-label" style={{ color: tileTypeCopy[r.type]?.color }}>{tileTypeCopy[r.type]?.label}</span>
                <span className="mt-2 block text-sm leading-relaxed">{r.text}</span>
                <span className="mt-2 block text-xs text-muted-foreground">
                  {store.getUser(r.authorId).name} · {timeAgo(r.createdAt)}
                </span>
              </button>
            </li>
          ))}
          {responses.length === 0 && <li className="text-sm text-muted-foreground">No responses yet — yours would be the first.</li>}
        </ul>
      </div>
    </div>
  );
}

function ActionButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${active ? "border-signal bg-signal text-signal-foreground" : "border-border hover:bg-secondary"}`}
    >
      {icon} {label}
    </button>
  );
}

function Choice({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${active ? "border-foreground bg-foreground text-background" : "border-border"}`}
    >
      {icon} {label}
    </button>
  );
}
