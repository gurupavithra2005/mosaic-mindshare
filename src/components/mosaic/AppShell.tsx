import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Compass, Grid2x2Plus, Bookmark, Search, User } from "lucide-react";
import type { ReactNode } from "react";
import { useMosaicStore } from "@/lib/mosaic-store";

const navItems = [
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/my-space", label: "My Space", icon: Bookmark },
  { to: "/create", label: "Create", icon: Grid2x2Plus },
  { to: "/search", label: "Search", icon: Search },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { notifications, me } = useMosaicStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-signal focus:px-3 focus:py-2 focus:text-signal-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label="MOSAIC home">
            <span aria-hidden className="grid h-7 w-7 grid-cols-2 gap-0.5">
              <span className="rounded-[3px] bg-signal" />
              <span className="rounded-[3px] bg-foreground/80" />
              <span className="rounded-[3px] bg-foreground/25" />
              <span className="rounded-[3px] bg-signal/50" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">MOSAIC</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <Link
              to="/notifications"
              aria-label={`Notifications, ${notifications.length} unread`}
              className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Bell className="h-5 w-5" aria-hidden />
              {notifications.length > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-signal" />
              )}
            </Link>
            <Link
              to="/profile"
              aria-label="Your profile"
              className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 transition-colors hover:bg-secondary"
            >
              <span
                aria-hidden
                className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-xs font-semibold"
              >
                {me.initials}
              </span>
              <span className="hidden text-sm font-medium sm:inline">{me.name.split(" ")[0]}</span>
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="pb-24 md:pb-0">
        {children}
      </main>

      <MobileNavigation pathname={pathname} />
    </div>
  );
}

function MobileNavigation({ pathname }: { pathname: string }) {
  const items = [
    { to: "/discover", label: "Discover", icon: Compass },
    { to: "/search", label: "Search", icon: Search },
    { to: "/create", label: "Create", icon: Grid2x2Plus },
    { to: "/my-space", label: "My Space", icon: Bookmark },
    { to: "/profile", label: "Profile", icon: User },
  ] as const;

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                  active ? "text-signal" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
