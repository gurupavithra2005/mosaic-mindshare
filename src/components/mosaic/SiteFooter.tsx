import { Link } from "@tanstack/react-router";

const words = ["PEOPLE", "IDEAS", "COMMUNITIES", "EXPERIENCES"];

const links = [
  { to: "/discover", label: "Discover" },
  { to: "/communities", label: "Communities" },
  { to: "/create", label: "Create" },
  { to: "/my-space", label: "My Space" },
  { to: "/search", label: "Search" },
  { to: "/profile", label: "Profile" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-foreground px-6 py-14 text-background sm:px-12">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 80% at 15% 20%, color-mix(in oklab, var(--signal) 55%, transparent), transparent 70%), radial-gradient(50% 70% at 85% 80%, color-mix(in oklab, var(--link-line) 55%, transparent), transparent 70%)",
          }}
        />
        <div className="relative">
          <p className="rule-label" style={{ color: "color-mix(in oklab, var(--background) 70%, transparent)" }}>
            One place, many perspectives
          </p>
          <ul className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
            {words.map((w) => (
              <li key={w} className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
                {w}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-xl text-sm text-background/75 sm:text-base">
            MOSAIC is not a feed. It's a shared surface where every contribution becomes a tile in a
            picture nobody could have made alone.
          </p>

          <nav aria-label="Footer" className="mt-10 flex flex-wrap gap-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-full border border-background/25 px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-background hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <p className="mt-10 text-xs text-background/60">
            Frontend-only demo · all content is local sample data
          </p>
        </div>
      </div>
    </footer>
  );
}
