import { Heart, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItemThumb } from "./ItemTile";
import type { Item, Look } from "@/lib/heavely/types";

export function LookCard({
  look,
  items,
  onSave,
  onRemix,
  onFavorite,
  onDelete,
  footerNote,
}: {
  look: Look;
  items: Item[];
  onSave?: () => void;
  onRemix?: () => void;
  onFavorite?: () => void;
  onDelete?: () => void;
  footerNote?: string;
}) {
  return (
    <article className="glass overflow-hidden rounded-3xl">
      <header className="flex items-start justify-between gap-3 px-5 pt-5">
        <div>
          <h3 className="font-display text-xl">{look.name}</h3>
          <p className="text-xs tracking-wide text-muted-foreground">
            {[look.occasion, look.vibe, look.weather].filter(Boolean).join(" • ") || "Everyday"}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-blush px-3 py-1 text-xs font-medium">
          {look.score}% style match
        </span>
      </header>

      <ul className="grid grid-cols-3 gap-2 p-5 sm:grid-cols-6">
        {items.map((item) => (
          <li key={item.id} className="space-y-1">
            <div className="aspect-square overflow-hidden rounded-2xl">
              <ItemThumb item={item} />
            </div>
            <p className="truncate text-[11px] text-muted-foreground">{item.name}</p>
          </li>
        ))}
      </ul>

      <div className="mx-5 mb-5 grid gap-2 rounded-2xl bg-card/70 p-4 sm:grid-cols-2">
        <p className="text-sm">
          <span className="block text-[11px] uppercase tracking-widest text-muted-foreground">Makeup</span>
          {look.beauty.makeup}
        </p>
        <p className="text-sm">
          <span className="block text-[11px] uppercase tracking-widest text-muted-foreground">Hair</span>
          {look.beauty.hair}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border/60 px-5 py-4">
        {onSave ? (
          <Button size="sm" onClick={onSave}>
            <Heart className="size-4" aria-hidden /> Save
          </Button>
        ) : null}
        {onRemix ? (
          <Button size="sm" variant="secondary" onClick={onRemix}>
            <RefreshCw className="size-4" aria-hidden /> Remix
          </Button>
        ) : null}
        {onFavorite ? (
          <Button size="sm" variant="ghost" onClick={onFavorite} aria-pressed={look.favorite}>
            <Sparkles className="size-4" aria-hidden /> {look.favorite ? "Favourited" : "Favourite"}
          </Button>
        ) : null}
        {onDelete ? (
          <Button size="sm" variant="ghost" onClick={onDelete}>
            <Trash2 className="size-4" aria-hidden /> Delete
          </Button>
        ) : null}
        {footerNote ? <span className="ml-auto text-xs text-muted-foreground">{footerNote}</span> : null}
      </div>
    </article>
  );
}
