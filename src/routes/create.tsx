import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { categories } from "@/data/mock";
import type { CategoryId, ParticipationMode } from "@/data/types";
import { modeCopy } from "@/lib/format";
import { useMosaicStore } from "@/lib/mosaic-store";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create a mosaic — MOSAIC" },
      { name: "description", content: "Set a prompt, choose how people participate, and open a new shared surface." },
      { property: "og:title", content: "Create a mosaic — MOSAIC" },
      { property: "og:description", content: "Open a shared surface and invite the first tiles." },
    ],
  }),
  component: CreatePage,
});

const covers = [
  "linear-gradient(135deg, var(--signal), var(--story))",
  "linear-gradient(135deg, var(--perspective), var(--link-line))",
  "linear-gradient(135deg, var(--idea), var(--challenge))",
  "linear-gradient(135deg, var(--question), var(--resource))",
];

const modes: ParticipationMode[] = ["open", "guided", "collaborative", "reflective", "challenge"];

function CreatePage() {
  const { addMosaic } = useMosaicStore();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [theme, setTheme] = useState("");
  const [category, setCategory] = useState<CategoryId>("ideas");
  const [mode, setMode] = useState<ParticipationMode>("open");
  const [cover, setCover] = useState(covers[0]!);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 4) return setError("Give your mosaic a title of at least 4 characters.");
    if (prompt.trim().length < 8) return setError("A prompt is what people answer — make it a real question.");
    setError("");
    const mosaic = addMosaic({
      title: title.trim(),
      description: description.trim() || "A new shared surface, waiting for its first tiles.",
      prompt: prompt.trim(),
      theme: theme.trim() || categories.find((c) => c.id === category)!.label,
      category,
      mode,
      cover,
    });
    toast("Mosaic created — add the first tile");
    void navigate({ to: "/mosaic/$mosaicId", params: { mosaicId: mosaic.id } });
  }

  const field = "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-foreground/50";

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="rule-label">Open a surface</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Create a mosaic</h1>
      <p className="mt-3 text-muted-foreground">
        A mosaic is a question plus a way of answering it. Everything stays in your browser.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="title" className="rule-label">Title</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={`mt-2 ${field}`} placeholder="The quiet hours of a city" />
        </div>

        <div>
          <label htmlFor="desc" className="rule-label">Description</label>
          <textarea id="desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={`mt-2 ${field}`} placeholder="What is this mosaic for?" />
        </div>

        <div>
          <label htmlFor="prompt" className="rule-label">Central prompt</label>
          <input id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} className={`mt-2 ${field}`} placeholder="What does your city sound like at 5am?" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="cat" className="rule-label">Category</label>
            <select id="cat" value={category} onChange={(e) => setCategory(e.target.value as CategoryId)} className={`mt-2 ${field}`}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="theme" className="rule-label">Community style</label>
            <input id="theme" value={theme} onChange={(e) => setTheme(e.target.value)} className={`mt-2 ${field}`} placeholder="Slow, thoughtful, few words" />
          </div>
        </div>

        <fieldset>
          <legend className="rule-label">Participation type</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {modes.map((m) => (
              <label
                key={m}
                className={`cursor-pointer rounded-2xl border p-4 transition-colors ${
                  mode === m ? "border-foreground bg-secondary" : "border-border bg-surface hover:border-foreground/40"
                }`}
              >
                <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} className="sr-only" />
                <span className="block text-sm font-semibold uppercase tracking-[0.12em]">{modeCopy[m]!.label}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{modeCopy[m]!.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="rule-label">Cover</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {covers.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Choose cover ${covers.indexOf(c) + 1}`}
                aria-pressed={cover === c}
                onClick={() => setCover(c)}
                className={`h-14 w-24 rounded-xl border-2 ${cover === c ? "border-foreground" : "border-transparent"}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </fieldset>

        {error && <p role="alert" className="text-sm font-medium text-signal">{error}</p>}

        <button type="submit" className="rounded-full bg-signal px-6 py-3 text-sm font-semibold text-signal-foreground">
          Create mosaic
        </button>
      </form>
    </section>
  );
}
