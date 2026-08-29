import { Suspense, lazy, useEffect, useState, type ComponentType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Renders children only after hydration — WebGL must never run on the server. */
export function ClientOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready ? <>{children}</> : <>{fallback ?? null}</>;
}

export function SceneFallback({ className, label }: { className?: string; label?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-[2rem] bg-gradient-to-br from-blush/60 via-powder/50 to-lavender/60",
        className,
      )}
    >
      <p className="script text-xl text-muted-foreground">{label ?? "Polishing the glass…"}</p>
    </div>
  );
}

/** Wraps a lazily-imported 3D scene with hydration + suspense guards. */
export function lazyScene<P extends object>(loader: () => Promise<{ default: ComponentType<P> }>) {
  const Lazy = lazy(loader);
  return function Scene(props: P & { className?: string; fallbackLabel?: string }) {
    const { className, fallbackLabel, ...rest } = props as P & {
      className?: string;
      fallbackLabel?: string;
    };
    const holder = (
      <SceneFallback {...(className ? { className } : {})} {...(fallbackLabel ? { label: fallbackLabel } : {})} />
    );
    return (
      <ClientOnly fallback={holder}>
        <Suspense fallback={holder}>
          <Lazy {...({ ...rest, className } as unknown as P)} />
        </Suspense>
      </ClientOnly>
    );
  };
}
