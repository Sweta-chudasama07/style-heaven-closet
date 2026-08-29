import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Shell } from "@/components/heavely/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemTile } from "@/components/heavely/ItemTile";
import { ItemDialog } from "@/components/heavely/ItemDialog";
import { EmptyState } from "@/components/heavely/EmptyState";
import { useHeavely } from "@/lib/heavely/store";
import { CLOSET_GROUPS, type ClosetGroup, type Item } from "@/lib/heavely/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/closet")({
  head: () => ({
    meta: [
      { title: "My Closet — HEAVELY" },
      { name: "description", content: "Browse your digital closet: clothes, jewellery, accessories and shoes, all in one dreamy place." },
      { property: "og:title", content: "My Closet — HEAVELY" },
      { property: "og:description", content: "Every piece you own, beautifully organised." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Closet,
});

const GROUPS: { key: ClosetGroup | "all"; label: string }[] = [
  { key: "all", label: "Everything" },
  { key: "clothes", label: "Clothes" },
  { key: "jewellery", label: "Jewellery" },
  { key: "accessories", label: "Accessories" },
  { key: "shoes", label: "Shoes" },
];

function Closet() {
  const { items, toggleItemFavorite } = useHeavely();
  const [group, setGroup] = useState<ClosetGroup | "all">("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);

  const filtered = useMemo(() => {
    const cats = group === "all" ? null : CLOSET_GROUPS[group];
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (cats && !cats.includes(i.category)) return false;
      if (!q) return true;
      return [i.name, i.color, i.style, i.subcategory].filter(Boolean).join(" ").toLowerCase().includes(q);
    });
  }, [items, group, query]);

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl">My Closet</h1>
            <p className="script text-xl text-muted-foreground">Everything you already own.</p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="size-4" aria-hidden /> Add a piece
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {GROUPS.map((g) => (
            <button
              key={g.key}
              onClick={() => setGroup(g.key)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition-colors",
                group === g.key ? "bg-blush text-foreground" : "bg-card text-muted-foreground hover:bg-blush/60",
              )}
            >
              {g.label}
            </button>
          ))}
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your closet"
            aria-label="Search your closet"
            className="ml-auto max-w-xs"
          />
        </div>

        <div className="mt-8">
          {filtered.length === 0 ? (
            <EmptyState
              title="Nothing here yet"
              hint="Add a piece and it will appear in this shelf."
              action={
                <Button
                  onClick={() => {
                    setEditing(null);
                    setOpen(true);
                  }}
                >
                  Add a piece
                </Button>
              }
            />
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {filtered.map((item) => (
                <li key={item.id}>
                  <ItemTile
                    item={item}
                    onFavorite={() => void toggleItemFavorite(item.id)}
                    onClick={() => {
                      setEditing(item);
                      setOpen(true);
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ItemDialog open={open} onOpenChange={setOpen} item={editing} />
    </Shell>
  );
}
