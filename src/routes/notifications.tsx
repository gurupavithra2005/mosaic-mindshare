import { createFileRoute, Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { EmptyState } from "@/components/mosaic/EmptyState";
import { useMosaicStore } from "@/lib/mosaic-store";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — MOSAIC" },
      { name: "description", content: "What happened around the tiles and mosaics you take part in." },
      { property: "og:title", content: "Notifications — MOSAIC" },
      { property: "og:description", content: "Quiet, purposeful updates — no engagement bait." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { notifications, dismissNotification, getMosaic } = useMosaicStore();

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="rule-label">Only what matters</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="All clear" description="Nothing needs you right now. That's the point." />
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {notifications.map((n) => {
            const mosaic = n.mosaicId ? getMosaic(n.mosaicId) : undefined;
            return (
              <li key={n.id} className="tile-surface flex items-start gap-3 rounded-2xl p-4">
                <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-signal" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{n.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {n.time}
                    {mosaic && (
                      <>
                        {" · "}
                        <Link to="/mosaic/$mosaicId" params={{ mosaicId: mosaic.id }} className="font-medium text-foreground underline underline-offset-2">
                          {mosaic.title}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => dismissNotification(n.id)}
                  aria-label="Dismiss notification"
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
