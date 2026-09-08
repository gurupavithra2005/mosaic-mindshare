import {
  Sparkles,
  Compass,
  HeartHandshake,
  Network,
  Palette,
  MousePointerClick,
  Smartphone,
  Accessibility,
  Code2,
  type LucideIcon,
} from "lucide-react";

const principles: { icon: LucideIcon; title: string; blurb: string; tone: string }[] = [
  { icon: Sparkles, title: "Originality", blurb: "A fresh and distinctive concept", tone: "var(--idea)" },
  { icon: Compass, title: "User Experience", blurb: "Intuitive and engaging", tone: "var(--question)" },
  { icon: HeartHandshake, title: "Meaningful Interaction", blurb: "Real value for users", tone: "var(--story)" },
  { icon: Network, title: "Creative Social Concepts", blurb: "New ways to connect and participate", tone: "var(--perspective)" },
  { icon: Palette, title: "Visual Design", blurb: "Distinctive and polished UI", tone: "var(--challenge)" },
  { icon: MousePointerClick, title: "Functionality", blurb: "A working and interactive experience", tone: "var(--signal)" },
  { icon: Smartphone, title: "Responsiveness", blurb: "Works across all devices", tone: "var(--resource)" },
  { icon: Accessibility, title: "Accessibility", blurb: "Usable and inclusive for everyone", tone: "var(--perspective)" },
  { icon: Code2, title: "Frontend Implementation Quality", blurb: "Clean, well-structured, and maintainable", tone: "var(--idea)" },
];

export function FocusSection() {
  return (
    <section aria-labelledby="focus-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <p className="rule-label">Product principles</p>
        <h2 id="focus-heading" className="mt-3 text-3xl font-semibold sm:text-4xl">
          WHAT YOU SHOULD FOCUS ON
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          Nine commitments that shape every screen, interaction and tile in MOSAIC.
        </p>
      </div>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {principles.map(({ icon: Icon, title, blurb, tone }, i) => (
          <li key={title}>
            <article className="tile-surface group relative h-full overflow-hidden rounded-3xl p-6">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-15 blur-2xl transition-opacity duration-300 group-hover:opacity-35"
                style={{ background: tone }}
              />
              <div className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6"
                  style={{ background: `color-mix(in oklab, ${tone} 16%, transparent)`, color: tone }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="rule-label">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 text-base font-semibold leading-snug">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{blurb}</p>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
