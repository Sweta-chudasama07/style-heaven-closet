import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Shell } from "@/components/heavely/Shell";
import { Button } from "@/components/ui/button";
import { ItemTile } from "@/components/heavely/ItemTile";
import { LookCard } from "@/components/heavely/LookCard";
import { EmptyState } from "@/components/heavely/EmptyState";
import { useHeavely } from "@/lib/heavely/store";
import { generateLooks, signature } from "@/lib/heavely/engine";
import type { Look } from "@/lib/heavely/types";
import { Mannequin3D, hexFor } from "@/components/heavely/three/scenes";
import type { LayerSpec } from "@/components/heavely/three/MannequinScene";

const SLOT_MAP: Record<string, LayerSpec["slot"]> = {
  top: "top",
  dress: "top",
  ethnic: "top",
  outerwear: "top",
  bottom: "bottom",
  shoes: "shoes",
  jewellery: "jewellery",
  bag: "bag",
  accessory: "bag",
};

export const Route = createFileRoute("/remix")({
  head: () => ({
    meta: [
      { title: "Remix Studio — HEAVELY" },
      { name: "description", content: "Lock the pieces you love and let HEAVELY rebuild the rest of the outfit around them." },
      { property: "og:title", content: "Remix Studio — HEAVELY" },
      { property: "og:description", content: "Lock a piece, remix the rest." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Remix,
});

function Remix() {
  const { items, prefs, saveLook } = useHeavely();
  const [locked, setLocked] = useState<string[]>([]);
  const [look, setLook] = useState<Look | null>(null);

  const lockedSet = useMemo(() => new Set(locked), [locked]);

  function toggle(id: string) {
    setLocked((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function remix() {
    if (items.length < 2) {
      toast.error("Add a couple of pieces first ♡");
      return;
    }
    const [next] = generateLooks(
      items,
      { lockedIds: locked, prefs, avoidSignatures: look ? [signature(look.itemIds)] : [] },
      1,
    );
    if (!next) {
      toast.error("Couldn't build a look with those locks — try unlocking one.");
      return;
    }
    setLook(next);
  }

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-4xl">Remix Studio</h1>
        <p className="script text-xl text-muted-foreground">Lock what you love, shuffle the rest.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={remix}>Remix my outfit</Button>
          {locked.length > 0 ? (
            <Button variant="ghost" onClick={() => setLocked([])}>
              Clear {locked.length} lock{locked.length === 1 ? "" : "s"}
            </Button>
          ) : null}
        </div>

        <section className="mt-8">
          <Mannequin3D
            className="h-[420px] w-full overflow-hidden rounded-[2rem] sm:h-[520px]"
            fallbackLabel="Shaping the glass figure…"
            layers={layers}
            onToggle={toggle}
          />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Drag to turn the figure — tap a piece to lock it, then remix around it.
          </p>
        </section>


        {look ? (
          <div className="mt-8">
            <LookCard
              look={look}
              items={look.itemIds.map((id) => items.find((i) => i.id === id)).filter((i) => !!i)}
              onSave={() => void saveLook(look).then(() => toast.success("Saved to your fashion diary ♡"))}
              onRemix={remix}
            />
          </div>
        ) : null}

        <section className="mt-10">
          <h2 className="font-display text-2xl">Your pieces</h2>
          {items.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="Nothing to remix yet"
                hint="Add pieces to your closet and come back."
                action={
                  <Button asChild>
                    <Link to="/closet">Open my closet</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {items.map((item) => (
                <li key={item.id}>
                  <ItemTile
                    item={item}
                    compact
                    locked={lockedSet.has(item.id)}
                    onLock={() => toggle(item.id)}
                    onClick={() => toggle(item.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Shell>
  );
}
