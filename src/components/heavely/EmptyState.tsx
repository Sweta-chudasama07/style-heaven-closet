import type { ReactNode } from "react";

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="glass mx-auto max-w-md rounded-3xl px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-blush">
        <span className="twinkle text-2xl" aria-hidden>
          ✦
        </span>
      </div>
      <p className="font-display text-xl">{title}</p>
      {hint ? <p className="mt-2 text-sm text-muted-foreground">{hint}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Loading({ label = "Styling your look..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status">
      <div className="flex gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="twinkle text-2xl"
            style={{ animationDelay: `${i * 0.25}s` }}
          >
            ✦
          </span>
        ))}
      </div>
      <p className="script text-xl text-muted-foreground">{label}</p>
    </div>
  );
}
