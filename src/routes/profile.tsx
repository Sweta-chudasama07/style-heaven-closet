import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Shell } from "@/components/heavely/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHeavely } from "@/lib/heavely/store";
import { COLORS, OCCASIONS, STYLES } from "@/lib/heavely/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Style Profile — HEAVELY" },
      { name: "description", content: "Tune the colours, styles and occasions HEAVELY leans on when it builds your looks." },
      { property: "og:title", content: "My Style Profile — HEAVELY" },
      { property: "og:description", content: "Your colours, your styles, your rules." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

function Multi({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? value.filter((v) => v !== o) : [...value, o])}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm capitalize transition-colors",
                on ? "bg-blush text-foreground" : "bg-card text-muted-foreground hover:bg-blush/60",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Profile() {
  const { name, setName, prefs, savePrefs, items, looks, streak } = useHeavely();
  const [displayName, setDisplayName] = useState(name);
  const [local, setLocal] = useState(prefs);

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-4xl">My Style</h1>
        <p className="script text-xl text-muted-foreground">The way you like to feel.</p>

        <section className="glass mt-6 grid grid-cols-3 gap-4 rounded-3xl p-6 text-center">
          <div>
            <p className="font-display text-3xl">{items.length}</p>
            <p className="text-xs text-muted-foreground">Pieces</p>
          </div>
          <div>
            <p className="font-display text-3xl">{looks.length}</p>
            <p className="text-xs text-muted-foreground">Looks</p>
          </div>
          <div>
            <p className="font-display text-3xl">{streak}</p>
            <p className="text-xs text-muted-foreground">Day streak</p>
          </div>
        </section>

        <section className="glass mt-6 rounded-[2rem] p-6">
          <Label htmlFor="name">Display name</Label>
          <div className="mt-2 flex gap-2">
            <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <Button onClick={() => void setName(displayName).then(() => toast.success("Saved ♡"))}>Save</Button>
          </div>

          <Multi
            label="Favourite colours"
            options={COLORS}
            value={local.favoriteColors}
            onChange={(v) => setLocal({ ...local, favoriteColors: v })}
          />
          <Multi
            label="Favourite styles"
            options={STYLES}
            value={local.favoriteStyles}
            onChange={(v) => setLocal({ ...local, favoriteStyles: v })}
          />
          <Multi
            label="Occasions you dress for"
            options={OCCASIONS}
            value={local.preferredOccasions}
            onChange={(v) => setLocal({ ...local, preferredOccasions: v })}
          />

          <Button className="mt-6" onClick={() => void savePrefs(local).then(() => toast.success("Style profile saved ✦"))}>
            Save my style profile
          </Button>
        </section>
      </div>
    </Shell>
  );
}
