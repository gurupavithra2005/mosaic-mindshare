import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { DiscoveryCard } from "@/components/mosaic/DiscoveryCard";
import { FocusSection } from "@/components/mosaic/FocusSection";
import { SiteFooter } from "@/components/mosaic/SiteFooter";
import { useMosaicStore } from "@/lib/mosaic-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MOSAIC — Social, without the endless scroll" },
      {
        name: "description",
        content:
          "MOSAIC is a shared surface where people build ideas together as connected tiles. No feed, no followers, no endless scroll.",
      },
      { property: "og:title", content: "MOSAIC — Social, without the endless scroll" },
      {
        property: "og:description",
        content: "Enter shared mosaics, add a tile, and build on other people's perspectives.",
      },
    ],
  }),
  component: Landing,
});

const words = ["PEOPLE", "IDEAS", "COMMUNITIES", "EXPERIENCES"];

function Landing() {
  const { mosaics } = useMosaicStore();
  const featured = mosaics.slice(0, 3);

  return (
    <div className="paper-grid">
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-signal" aria-hidden />
              A different kind of social
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Social, without the endless scroll.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              MOSAIC replaces the feed with shared surfaces. You enter a mosaic, add one tile, and
              watch it connect to what other people brought. Nothing to chase, nothing to refresh.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/discover"
                className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-signal-foreground transition-transform hover:scale-[1.02]"
              >
                Explore mosaics <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                Start your own
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-1">
              {words.map((w) => (
                <li key={w} className="rule-label">
                  {w}
                </li>
              ))}
            </ul>
          </div>

          <HeroComposition />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="rule-label">Featured right now</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Mosaics with room for your tile
            </h2>
          </div>
          <Link to="/discover" className="inline-flex items-center gap-1.5 text-sm font-semibold">
            See all <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((m) => (
            <DiscoveryCard key={m.id} mosaic={m} />
          ))}
        </div>
      </section>

      <FocusSection />
      <SiteFooter />
    </div>
  );
}

function HeroComposition() {
  const tiles = [
    { label: "Perspective", text: "“I moved cities three times before it felt like home.”", span: "col-span-2" },
    { label: "Idea", text: "“What if libraries loaned tools?”", span: "" },
    { label: "Question", text: "“Who does quiet design serve?”", span: "" },
    { label: "Story", text: "“Our block repaired 41 bikes in one Saturday.”", span: "col-span-2" },
  ];
  return (
    <div aria-hidden className="relative">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {tiles.map((t, i) => (
          <div
            key={t.label}
            className={`tile-surface rounded-2xl p-4 ${t.span} ${i % 2 ? "translate-y-3" : ""}`}
          >
            <p className="rule-label" style={{ color: "var(--signal)" }}>
              {t.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
