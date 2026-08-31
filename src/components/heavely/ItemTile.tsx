import { useState, type ReactNode } from "react";
import { Heart, Lock, LockOpen, Gem, ShoppingBag, Glasses, Footprints } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category, Item } from "@/lib/heavely/types";


const SWATCH: Record<string, string> = {
  pink: "linear-gradient(140deg,#f9d7e0,#efb3c4)",
  rose: "linear-gradient(140deg,#f3c3ce,#d78ea0)",
  red: "linear-gradient(140deg,#f0b3b3,#c96a6a)",
  peach: "linear-gradient(140deg,#fbdcc7,#f3bd9c)",
  cream: "linear-gradient(140deg,#faf1e4,#eeddc6)",
  white: "linear-gradient(140deg,#ffffff,#eeeaea)",
  beige: "linear-gradient(140deg,#f2e6d8,#ddc9b3)",
  brown: "linear-gradient(140deg,#d8bda3,#a3785a)",
  black: "linear-gradient(140deg,#5d5a5e,#2c2a2d)",
  grey: "linear-gradient(140deg,#e0dee0,#b3b0b3)",
  blue: "linear-gradient(140deg,#d6e6f6,#a9c6e6)",
  denim: "linear-gradient(140deg,#bcd0e6,#7d97ba)",
  lavender: "linear-gradient(140deg,#e6dcf4,#c6b3e2)",
  green: "linear-gradient(140deg,#d9e8d5,#a6c39d)",
  yellow: "linear-gradient(140deg,#faeec6,#ecd48d)",
  gold: "linear-gradient(140deg,#f5e3bd,#d6b675)",
  silver: "linear-gradient(140deg,#eef0f3,#c3c8d0)",
  pearl: "linear-gradient(140deg,#fdf8f6,#e6dcd8)",
  multi: "linear-gradient(140deg,#f9d7e0,#d6e6f6,#e6dcf4)",
};

function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  const common = "size-full";
  const paths: Record<Category, ReactNode> = {
    top: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={common}>
        <path d="M9 3h6c.5 0 1 .2 1.4.6l3 3c.8.8.2 2-1 2h-2v9c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2v-9H5.6c-1.2 0-1.8-1.2-1-2l3-3C8 3.2 8.5 3 9 3z" />
      </svg>
    ),
    bottom: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={common}>
        <path d="M7 3h10v4c0 .6-.4 1-1 1h-1v11c0 .6-.4 1-1 1h-2c-.6 0-1-.4-1-1v-5h-2v5c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V8H5c-.6 0-1-.4-1-1V3z" />
      </svg>
    ),
    dress: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={common}>
        <path d="M8 3c0 1.7 1.3 3 3 3s3-1.3 3-3h2l3 14c.3 1.3-.7 2.4-2 2.4H7c-1.3 0-2.3-1.1-2-2.4L8 3z" />
      </svg>
    ),
    ethnic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={common}>
        <path d="M8 3h8l1 5 2 11c.2 1.1-.7 2-1.8 2H6.8c-1.1 0-2-.9-1.8-2l2-11z" />
        <path d="M7 8h10" />
      </svg>
    ),
    outerwear: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={common}>
        <path d="M8 3h8c.5 0 1 .2 1.4.6l3 3c.8.8.2 2-1 2h-2v11c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2v-11H5.6c-1.2 0-1.8-1.2-1-2l3-3C8 3.2 8.5 3 9 3z" />
        <path d="M12 4v16" />
      </svg>
    ),
    shoes: <Footprints className={common} />,
    jewellery: <Gem className={common} />,
    bag: <ShoppingBag className={common} />,
    accessory: <Glasses className={common} />,
  };
  return <span className={cn("inline-flex items-center justify-center", className)}>{paths[category]}</span>;
}

export function ItemThumb({ item, className }: { item: Item; className?: string }) {
  if (item.imageUrl) {
    return (
      <img
        src={item.imageUrl}
        alt={item.name}
        loading="lazy"
        className={cn("h-full w-full rounded-2xl object-cover", className)}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${item.color ?? ""} ${item.name}`.trim()}
      className={cn("flex h-full w-full items-end rounded-2xl p-3", className)}
      style={{ background: SWATCH[item.color ?? "cream"] ?? SWATCH["cream"] }}
    >
      <span className="script text-lg text-ink/70">{item.name}</span>
    </div>
  );
}


export function ItemTile({
  item,
  onFavorite,
  onClick,
  locked,
  onLock,
  compact,
}: {
  item: Item;
  onFavorite?: () => void;
  onClick?: () => void;
  locked?: boolean;
  onLock?: () => void;
  compact?: boolean;
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left"
        aria-label={`Open ${item.name}`}
      >
        <div
          className={cn(
            "overflow-hidden rounded-3xl bg-card p-2 shadow-[var(--shadow-soft)] transition-transform duration-300 group-hover:-translate-y-1",
            locked && "ring-2 ring-primary",
          )}
        >
          <div className={cn("overflow-hidden rounded-2xl", compact ? "aspect-square" : "aspect-[3/4]")}>
            <ItemThumb item={item} />
          </div>
          <div className="px-1.5 py-2">
            <p className="truncate text-sm font-medium">{item.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {[item.subcategory ?? item.category, item.style].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
      </button>

      <div className="absolute right-3 top-3 flex flex-col gap-1.5">
        {onFavorite ? (
          <button
            type="button"
            onClick={onFavorite}
            aria-label={item.favorite ? `Unfavourite ${item.name}` : `Favourite ${item.name}`}
            aria-pressed={item.favorite}
            className="rounded-full bg-card/90 p-1.5 shadow-sm"
          >
            <Heart className={cn("size-4", item.favorite && "fill-primary text-primary")} />
          </button>
        ) : null}
        {onLock ? (
          <button
            type="button"
            onClick={onLock}
            aria-label={locked ? `Unlock ${item.name}` : `Lock ${item.name}`}
            aria-pressed={!!locked}
            className="rounded-full bg-card/90 p-1.5 shadow-sm"
          >
            {locked ? <Lock className="size-4 text-primary" /> : <LockOpen className="size-4" />}
          </button>
        ) : null}
      </div>
    </div>
  );
}
