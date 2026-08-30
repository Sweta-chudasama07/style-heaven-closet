import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
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

export function BuddyDock() {
  const { items, looks } = useHeavely();
  const [gender, setGender] = useState<BuddyGender>("girl");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { gender?: BuddyGender; open?: boolean };
        if (saved.gender) setGender(saved.gender);
        if (typeof saved.open === "boolean") setOpen(saved.open);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ gender, open }));
    } catch {
      /* ignore */
    }
  }, [gender, open]);

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

  return (
    <div className="pointer-events-none fixed bottom-24 left-3 z-40 lg:bottom-6">
      <div
        className={cn(
          "pointer-events-auto glass rounded-3xl p-2 transition-all",
          open ? "w-[128px]" : "w-[76px]",
        )}
      >
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
            {open ? "Buddy" : ""}
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Hide style buddy details" : "Show style buddy details"}
            className="rounded-full p-1 text-muted-foreground hover:bg-blush/60"
          >
            {open ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
          </button>
        </div>

        <div className={cn("mx-auto float-slow", open ? "h-[130px] w-[92px]" : "h-[74px] w-[54px]")}>
          <StyleBuddy gender={gender} outfit={outfit} />
        </div>

        {open ? (
          <>
            <p className="mt-1 line-clamp-2 px-1 text-center text-[10px] leading-tight text-muted-foreground">
              {caption}
            </p>
            <div className="mt-2 flex rounded-full bg-muted p-0.5 text-[10px]">
              {(["girl", "boy"] as BuddyGender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  aria-pressed={gender === g}
                  className={cn(
                    "flex-1 rounded-full px-2 py-1 capitalize transition-colors",
                    gender === g ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
