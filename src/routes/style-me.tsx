import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Shell } from "@/components/heavely/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LookCard } from "@/components/heavely/LookCard";
import { EmptyState, Loading } from "@/components/heavely/EmptyState";
import { useHeavely } from "@/lib/heavely/store";
import { generateLooks, parseStyleRequest, signature, type StyleRequest } from "@/lib/heavely/engine";
import { FEELINGS, OCCASIONS, STYLES, WEATHERS, type Look } from "@/lib/heavely/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-me")({
  head: () => ({
    meta: [
      { title: "Style Me — HEAVELY" },
      { name: "description", content: "Tell HEAVELY the occasion, vibe and weather and get three complete looks built from your own wardrobe." },
      { property: "og:title", content: "Style Me — HEAVELY" },
      { property: "og:description", content: "Three complete looks from the clothes you already own." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StyleMe,
});

function Chips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <fieldset className="mt-5">
      <legend className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(value === o ? undefined : o)}
            aria-pressed={value === o}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm transition-colors",
              value === o ? "bg-blush text-foreground" : "bg-card text-muted-foreground hover:bg-blush/60",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function StyleMe() {
  const { items, prefs, saveLook } = useHeavely();
  const [occasion, setOccasion] = useState<string>();
  const [vibe, setVibe] = useState<string>();
  const [weather, setWeather] = useState<string>();
  const [feeling, setFeeling] = useState<string>();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [looks, setLooks] = useState<Look[]>([]);

  function run(avoid: string[] = []) {
    if (items.length < 2) {
      toast.error("Add a couple of pieces to your closet first ♡");
      return;
    }
    setBusy(true);
    const parsed = text.trim()
      ? parseStyleRequest(text, items, { occasions: OCCASIONS, vibes: STYLES, weathers: WEATHERS })
      : { occasion: undefined, vibe: undefined, weather: undefined, lockedIds: [] as string[] };
    const req: StyleRequest = { prefs, avoidSignatures: avoid, lockedIds: parsed.lockedIds ?? [] };
    const o = occasion ?? parsed.occasion;
    const v = vibe ?? parsed.vibe;
    const w = weather ?? parsed.weather;
    if (o) req.occasion = o;
    if (v) req.vibe = v;
    if (w) req.weather = w;
    if (feeling) req.feeling = feeling;
    const next = generateLooks(items, req);
    window.setTimeout(() => {
      setLooks(next);
      setBusy(false);
    }, 500);
  }

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-4xl">Style Me</h1>
        <p className="script text-xl text-muted-foreground">Tell me where you're going ✦</p>

        <section className="glass mt-6 rounded-[2rem] p-6">
          <label htmlFor="ask" className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Or just say it
          </label>
          <Input
            id="ask"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="something cute for college"
            className="mt-2"
          />
          <Chips label="Occasion" options={OCCASIONS} value={occasion} onChange={setOccasion} />
          <Chips label="Vibe" options={STYLES} value={vibe} onChange={setVibe} />
          <Chips label="Weather" options={WEATHERS} value={weather} onChange={setWeather} />
          <Chips label="I want to feel" options={FEELINGS} value={feeling} onChange={setFeeling} />

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={() => run()} disabled={busy}>
              Style me
            </Button>
            {looks.length > 0 ? (
              <Button variant="secondary" onClick={() => run(looks.map((l) => signature(l.itemIds)))} disabled={busy}>
                Show me something else
              </Button>
            ) : null}
          </div>
        </section>

        <section className="mt-8 space-y-6">
          {busy ? <Loading /> : null}
          {!busy && looks.length === 0 ? (
            <EmptyState
              title="No looks yet"
              hint="Pick a mood above, or add more pieces to your closet."
              action={
                <Button asChild variant="secondary">
                  <Link to="/closet">Open my closet</Link>
                </Button>
              }
            />
          ) : null}
          {!busy
            ? looks.map((look) => (
                <LookCard
                  key={look.id}
                  look={look}
                  items={look.itemIds.map((id) => items.find((i) => i.id === id)).filter((i) => !!i)}
                  onSave={() => {
                    void saveLook(look).then(() => toast.success("Saved to your fashion diary ♡"));
                  }}
                  onRemix={() => run([signature(look.itemIds)])}
                />
              ))
            : null}
        </section>
      </div>
    </Shell>
  );
}
