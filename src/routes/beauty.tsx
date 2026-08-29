import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Shell } from "@/components/heavely/Shell";
import { Button } from "@/components/ui/button";
import { useHeavely } from "@/lib/heavely/store";
import { beautyFor } from "@/lib/heavely/engine";
import { STYLES } from "@/lib/heavely/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/beauty")({
  head: () => ({
    meta: [
      { title: "Beauty Board — HEAVELY" },
      { name: "description", content: "Soft makeup and hair pairings for every vibe, matched to the outfits you build in HEAVELY." },
      { property: "og:title", content: "Beauty Board — HEAVELY" },
      { property: "og:description", content: "Makeup and hair ideas for every mood." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Beauty,
});

function Beauty() {
  const { prefs, savePrefs } = useHeavely();
  const [vibe, setVibe] = useState(prefs.favoriteStyles[0] ?? "Soft");
  const suggestion = beautyFor(vibe);

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-4xl">Beauty Board</h1>
        <p className="script text-xl text-muted-foreground">A face and a hairstyle for every mood.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => setVibe(s)}
              aria-pressed={vibe === s}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition-colors",
                vibe === s ? "bg-blush text-foreground" : "bg-card text-muted-foreground hover:bg-blush/60",
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="glass rounded-3xl p-6">
            <h2 className="text-[11px] uppercase tracking-widest text-muted-foreground">Makeup</h2>
            <p className="mt-2 font-display text-2xl">{suggestion.makeup}</p>
          </article>
          <article className="glass rounded-3xl p-6">
            <h2 className="text-[11px] uppercase tracking-widest text-muted-foreground">Hair</h2>
            <p className="mt-2 font-display text-2xl">{suggestion.hair}</p>
          </article>
        </section>

        <Button
          className="mt-6"
          onClick={() => {
            void savePrefs({
              ...prefs,
              beauty: { makeup: suggestion.makeup, hair: suggestion.hair },
            }).then(() => toast.success("Saved as your signature beauty look ♡"));
          }}
        >
          Make this my signature
        </Button>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STYLES.map((s) => {
            const b = beautyFor(s);
            return (
              <article key={s} className="polaroid rounded-3xl bg-card p-5">
                <h3 className="font-display text-xl">{s}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.makeup}</p>
                <p className="mt-1 text-sm text-muted-foreground">{b.hair}</p>
              </article>
            );
          })}
        </section>
      </div>
    </Shell>
  );
}
