import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface-2/50 px-6 py-12 text-center">
      <div aria-hidden className="mx-auto mb-4 grid h-10 w-10 grid-cols-2 gap-1 opacity-60">
        <span className="rounded-[3px] bg-foreground/20" />
        <span className="rounded-[3px] bg-foreground/10" />
        <span className="rounded-[3px] bg-foreground/10" />
        <span className="rounded-[3px] border border-dashed border-foreground/30" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
