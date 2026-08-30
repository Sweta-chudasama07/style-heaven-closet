import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleBuddy, type BuddyGender, type BuddyOutfit } from "./StyleBuddy";
import { useHeavely } from "@/lib/heavely/store";
import { hexFor } from "@/components/heavely/three/scenes";
import { cn } from "@/lib/utils";

const KEY = "heavely.buddy";

const DEFAULT_OUTFIT: BuddyOutfit = {
  top: "#FFCFE4",
  bottom: "#DEECF5",
  shoes: "#E2889F",
  accent: "#F8AA80",
};

const CHEERS = [
  "You look lovely!",
  "Let's style something ✨",
  "Twirl with me!",
  "Cutest fit ever 💗",
  "Tap me again!",
];

type Sparkle = { id: number; sx: string; sy: string; left: string; top: string };

export function BuddyDock() {
  const { items, looks } = useHeavely();
  const [gender, setGender] = useState<BuddyGender>("girl");
  const [reaction, setReaction] = useState<"hop" | "spin" | null>(null);
  const [bubble, setBubble] = useState<string | null>(null);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [showToggle, setShowToggle] = useState(false);
  const taps = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { gender?: BuddyGender };
        if (saved.gender) setGender(saved.gender);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ gender }));
    } catch {
      /* ignore */
    }
  }, [gender]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const { outfit, caption } = useMemo(() => {
    const latest = looks[0];
    const worn = latest
      ? latest.itemIds.map((id) => items.find((i) => i.id === id)).filter((i) => !!i)
      : items.filter((i) => i.favorite).slice(0, 5);
    const pickColor = (cats: string[], fallback: string) => {
      const hit = worn.find((i) => cats.includes(i.category));
      return hit ? hexFor(hit.color ?? undefined) : fallback;
    };
    return {
      outfit: {
        top: pickColor(["top", "dress", "ethnic", "outerwear"], DEFAULT_OUTFIT.top),
        bottom: pickColor(["bottom"], DEFAULT_OUTFIT.bottom),
        shoes: pickColor(["shoes"], DEFAULT_OUTFIT.shoes),
        accent: pickColor(["jewellery", "accessory", "bag"], DEFAULT_OUTFIT.accent),
      } satisfies BuddyOutfit,
      caption: latest ? latest.name.split("—")[0]?.trim() || "Your latest look" : "Pick a look and I'll wear it!",
    };
  }, [items, looks]);

  const poke = useCallback(() => {
    taps.current += 1;
    const spin = taps.current % 3 === 0;
    setReaction(null);
    requestAnimationFrame(() => setReaction(spin ? "spin" : "hop"));
    setBubble(spin ? caption : (CHEERS[taps.current % CHEERS.length] ?? CHEERS[0]!));
    const burst = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      sx: `${(Math.random() - 0.5) * 60}px`,
      sy: `${-20 - Math.random() * 45}px`,
      left: `${20 + Math.random() * 60}%`,
      top: `${25 + Math.random() * 45}%`,
    }));
    setSparkles(burst);
    later(() => setReaction(null), 900);
    later(() => setSparkles([]), 1000);
    later(() => setBubble(null), 2200);
  }, [caption]);

  return (
    <div className="pointer-events-none fixed bottom-24 left-2 z-40 select-none lg:bottom-6 lg:left-4">
      <div className="relative">
        {bubble ? (
          <div className="pointer-events-none absolute -top-2 left-14 w-32 animate-fade-in rounded-2xl rounded-bl-sm bg-card/90 px-2.5 py-1.5 text-[10px] leading-tight text-foreground shadow-[var(--shadow-soft)] backdrop-blur">
            {bubble}
          </div>
        ) : null}

        <button
          type="button"
          onClick={poke}
          onPointerEnter={() => setShowToggle(true)}
          onPointerLeave={() => setShowToggle(false)}
          aria-label="Play with your style buddy"
          className="pointer-events-auto block h-[132px] w-[92px] cursor-pointer bg-transparent p-0 outline-none transition-transform duration-200 active:scale-95"
        >
          <div
            className={cn(
              "relative h-full w-full",
              !reaction && "float-slow",
              reaction === "hop" && "buddy-hop",
              reaction === "spin" && "buddy-spin",
            )}
          >
            <StyleBuddy gender={gender} outfit={outfit} />
            {sparkles.map((s) => (
              <span
                key={s.id}
                className="buddy-sparkle pointer-events-none absolute text-xs"
                style={{ left: s.left, top: s.top, ["--sx" as string]: s.sx, ["--sy" as string]: s.sy }}
              >
                ✨
              </span>
            ))}
          </div>
        </button>

        <div
          className={cn(
            "pointer-events-auto mt-1 flex justify-center gap-1 transition-opacity duration-200",
            showToggle || bubble ? "opacity-100" : "opacity-0",
          )}
        >
          {(["girl", "boy"] as BuddyGender[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setGender(g);
                poke();
              }}
              aria-pressed={gender === g}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] capitalize shadow-sm transition-colors",
                gender === g ? "bg-primary text-primary-foreground" : "bg-card/80 text-muted-foreground",
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
