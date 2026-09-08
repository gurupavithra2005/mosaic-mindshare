import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Compass, Grid2x2Plus, Home, Search, User, Users, Bookmark } from "lucide-react";
import type { ReactNode } from "react";
import { useMosaicStore } from "@/lib/mosaic-store";
import { useAuth } from "@/lib/auth-store";

const primaryNav = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/create", label: "Create", icon: Grid2x2Plus },
  { to: "/communities", label: "Communities", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
] as const;

const secondaryNav = [
  { to: "/search", label: "Search", icon: Search },
  { to: "/my-space", label: "My Space", icon: Bookmark },
  { to: "/notifications", label: "Notifications", icon: Bell },
] as const;

function isActive(pathname: string, to: string, exact?: boolean) {
  return exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`) || pathname === to;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { notifications, me } = useMosaicStore();
  const { account } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const displayName = account?.name ?? me.name;
  const initials = account?.initials ?? me.initials;

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-signal focus:px-3 focus:py-2 focus:text-signal-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur lg:hidden">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="MOSAIC home">
            <Logo />
            <span className="truncate font-display text-lg font-semibold tracking-tight">MOSAIC</span>
          </Link>
          <div className="flex shrink-0 items-center gap-1.5">
            <NotificationBell count={notifications.length} />
            <Link
              to="/profile"
              aria-label="Your profile"
              className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-xs font-semibold"
            >
              {initials}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[110rem]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border px-4 py-6 lg:flex xl:w-72">
          <Link to="/" className="flex items-center gap-2.5 px-2" aria-label="MOSAIC home">
            <Logo />
            <span className="font-display text-xl font-semibold tracking-tight">MOSAIC</span>
          </Link>

          <nav aria-label="Primary" className="mt-8">
            <ul className="space-y-1">
              {primaryNav.map(({ to, label, icon: Icon, ...rest }) => {
                const active = isActive(pathname, to, "exact" in rest ? rest.exact : false);
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      }`}
                    >
                      <Icon
                        className={`h-[18px] w-[18px] shrink-0 ${active ? "text-signal" : ""}`}
                        aria-hidden
                      />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <p className="rule-label mt-8 px-3">Yours</p>
            <ul className="mt-2 space-y-1">
              {secondaryNav.map(({ to, label, icon: Icon }) => {
                const active = isActive(pathname, to);
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                      <span className="min-w-0 truncate">{label}</span>
                      {to === "/notifications" && notifications.length > 0 && (
                        <span className="ml-auto rounded-full bg-signal px-2 py-0.5 text-[11px] font-semibold text-signal-foreground">
                          {notifications.length}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            to={account ? "/profile" : "/auth"}
            className="mt-auto flex items-center gap-3 rounded-2xl border border-border p-3 transition-colors hover:bg-secondary/60"
          >
            <span
              aria-hidden
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold"
            >
              {initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{displayName}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {account ? "Signed in" : "Sign in to save your work"}
              </span>
            </span>
          </Link>
        </aside>

        <main id="main" className="min-w-0 flex-1 pb-24 lg:pb-0">
          {children}
        </main>
      </div>

      <MobileNavigation pathname={pathname} />
    </div>
  );
}

function Logo() {
  return (
    <span aria-hidden className="grid h-7 w-7 shrink-0 grid-cols-2 gap-0.5">
      <span className="rounded-[3px] bg-signal" />
      <span className="rounded-[3px] bg-foreground/80" />
      <span className="rounded-[3px] bg-foreground/25" />
      <span className="rounded-[3px] bg-signal/50" />
    </span>
  );
}

function NotificationBell({ count }: { count: number }) {
  return (
    <Link
      to="/notifications"
      aria-label={`Notifications, ${count} unread`}
      className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      <Bell className="h-5 w-5" aria-hidden />
      {count > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-signal" />}
    </Link>
  );
}

function MobileNavigation({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {primaryNav.map(({ to, label, icon: Icon, ...rest }) => {
          const active = isActive(pathname, to, "exact" in rest ? rest.exact : false);
          return (
            <li key={to}>
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[11px] font-medium transition-colors ${
                  active ? "text-signal" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
