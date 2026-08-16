import type { Beauty, Category, Item, Look, StylePrefs } from "./types";

/**
 * Deterministic, rule-based styling engine.
 * Everything happens over the user's OWN wardrobe — nothing is fetched or invented.
 * The scoring shape is intentionally simple so an AI ranker can replace `scoreItem`
 * or `scoreLook` later without touching the callers.
 */

export type StyleRequest = {
  occasion?: string;
  vibe?: string;
  weather?: string;
  feeling?: string;
  lockedIds?: string[];
  prefs?: StylePrefs;
  avoidSignatures?: string[];
};

const COLOR_FAMILY: Record<string, string> = {
  pink: "warm-soft",
  rose: "warm-soft",
  peach: "warm-soft",
  red: "warm-bold",
  cream: "neutral",
  white: "neutral",
  pearl: "neutral",
  beige: "neutral",
  grey: "neutral",
  black: "neutral",
  brown: "warm-deep",
  gold: "warm-deep",
  silver: "cool-soft",
  blue: "cool-soft",
  denim: "cool-soft",
  lavender: "cool-soft",
  green: "cool-deep",
  yellow: "warm-bold",
  multi: "neutral",
};

const WEATHER_SEASON: Record<string, string[]> = {
  Hot: ["Summer", "All", "Spring"],
  Warm: ["Summer", "Spring", "All"],
  Cool: ["Autumn", "Spring", "All"],
  Rainy: ["Rainy", "Autumn", "All"],
  Cold: ["Winter", "Autumn", "All"],
};

const VIBE_NEIGHBOURS: Record<string, string[]> = {
  Soft: ["Romantic", "Dreamy", "Minimal"],
  Cute: ["Playful", "Soft", "Y2K"],
  Elegant: ["Minimal", "Romantic", "Traditional"],
  Dreamy: ["Soft", "Romantic"],
  Minimal: ["Elegant", "Soft"],
  Y2K: ["Playful", "Edgy", "Cute"],
  Romantic: ["Soft", "Dreamy", "Elegant"],
  Traditional: ["Elegant", "Romantic"],
  Edgy: ["Y2K", "Minimal"],
  Playful: ["Cute", "Y2K"],
};

function colorHarmony(a?: string | null, b?: string | null) {
  if (!a || !b) return 8;
  if (a === b) return 16;
  const fa = COLOR_FAMILY[a] ?? "neutral";
  const fb = COLOR_FAMILY[b] ?? "neutral";
  if (fa === "neutral" || fb === "neutral") return 20;
  if (fa === fb) return 18;
  if (fa.split("-")[0] === fb.split("-")[0]) return 13;
  return 7;
}

export function scoreItem(item: Item, req: StyleRequest): number {
  let score = 0;
  if (req.occasion) {
    if (item.occasion.includes(req.occasion)) score += 30;
    else if (item.occasion.length === 0) score += 12;
  } else score += 12;

  if (req.vibe) {
    if (item.style === req.vibe) score += 25;
    else if ((VIBE_NEIGHBOURS[req.vibe] ?? []).includes(item.style ?? "")) score += 15;
    else score += 4;
  } else score += 10;

  if (req.weather) {
    const ok = WEATHER_SEASON[req.weather] ?? ["All"];
    score += ok.includes(item.season ?? "All") ? 10 : 2;
  } else score += 5;

  const prefs = req.prefs;
  if (prefs) {
    if (item.color && prefs.favoriteColors.includes(item.color)) score += 5;
    if (item.style && prefs.favoriteStyles.includes(item.style)) score += 5;
  }
  if (item.favorite) score += 4;
  return score;
}

const BASE_SLOTS: Category[] = ["top", "bottom", "shoes", "bag", "jewellery", "accessory"];
const DRESS_SLOTS: Category[] = ["dress", "shoes", "bag", "jewellery", "accessory"];
const ETHNIC_SLOTS: Category[] = ["ethnic", "shoes", "bag", "jewellery", "accessory"];

function pick(pool: Item[], index: number) {
  if (pool.length === 0) return undefined;
  return pool[index % pool.length];
}

const MAKEUP_BY_VIBE: Record<string, string> = {
  Soft: "Soft pink — sheer blush, glossy lip",
  Cute: "Peachy — cream blush and a tinted balm",
  Elegant: "Classic — defined lash, satin nude lip",
  Dreamy: "Natural glow — dewy skin, pearl shimmer",
  Minimal: "Natural — groomed brows, balm only",
  Y2K: "Glossy — frosted lid, high-shine lip",
  Romantic: "Berry — flushed cheeks, soft smudge liner",
  Traditional: "Warm neutral — kohl and a deep rose lip",
  Edgy: "Glam — smoked liner, matte lip",
  Playful: "Soft pink — glitter accent, fruity gloss",
};

const HAIR_BY_VIBE: Record<string, string> = {
  Soft: "Soft waves, half-up",
  Cute: "Ponytail with a ribbon",
  Elegant: "Low sleek bun",
  Dreamy: "Loose open hair with face-framing strands",
  Minimal: "Sleek open hair, centre part",
  Y2K: "High ponytail with clips",
  Romantic: "Soft waves with a braid detail",
  Traditional: "Braided with a middle part",
  Edgy: "Slicked-back low pony",
  Playful: "Two little buns",
};

export function beautyFor(vibe?: string, prefs?: StylePrefs): Beauty {
  const v = vibe && MAKEUP_BY_VIBE[vibe] ? vibe : "Soft";
  return {
    makeup: prefs?.beauty.makeup ?? MAKEUP_BY_VIBE[v]!,
    hair: prefs?.beauty.hair ?? HAIR_BY_VIBE[v]!,
  };
}

export function signature(itemIds: string[]) {
  return [...itemIds].sort().join("|");
}

export function generateLooks(items: Item[], req: StyleRequest, count = 3): Look[] {
  const locked = new Set(req.lockedIds ?? []);
  const lockedItems = items.filter((i) => locked.has(i.id));
  const scored = new Map<string, number>();
  items.forEach((i) => scored.set(i.id, scoreItem(i, req)));

  const byCategory = (cat: Category) =>
    items
      .filter((i) => i.category === cat && !locked.has(i.id))
      .sort((a, b) => (scored.get(b.id) ?? 0) - (scored.get(a.id) ?? 0));

  const lockedCats = new Set(lockedItems.map((i) => i.category));
  let slots: Category[] = BASE_SLOTS;
  if (lockedCats.has("dress")) slots = DRESS_SLOTS;
  else if (lockedCats.has("ethnic")) slots = ETHNIC_SLOTS;
  else if (!lockedCats.has("top") && !lockedCats.has("bottom")) {
    const dresses = byCategory("dress").length;
    const tops = byCategory("top").length;
    if (dresses > 0 && dresses >= tops) slots = DRESS_SLOTS;
  }

  const avoid = new Set(req.avoidSignatures ?? []);
  const looks: Look[] = [];

  for (let variant = 0; variant < count + 3 && looks.length < count; variant++) {
    const chosen: Item[] = [...lockedItems];
    for (const slot of slots) {
      if (chosen.some((c) => c.category === slot)) continue;
      const pool = byCategory(slot).filter((p) => !chosen.some((c) => c.id === p.id));
      if (pool.length === 0) continue;
      const shortlist = pool.slice(0, Math.max(3, Math.min(6, pool.length)));
      const candidate = pick(shortlist, variant + slots.indexOf(slot));
      if (candidate) chosen.push(candidate);
    }
    if (chosen.length < 2) break;
    const sig = signature(chosen.map((c) => c.id));
    if (avoid.has(sig) || looks.some((l) => signature(l.itemIds) === sig)) continue;

    const base = chosen.reduce((sum, i) => sum + (scored.get(i.id) ?? 0), 0) / chosen.length;
    let harmony = 0;
    let pairs = 0;
    for (let a = 0; a < chosen.length; a++) {
      for (let b = a + 1; b < chosen.length; b++) {
        harmony += colorHarmony(chosen[a]!.color, chosen[b]!.color);
        pairs++;
      }
    }
    const harmonyAvg = pairs ? harmony / pairs : 12;
    const hasAccessory = chosen.some((c) => c.category === "accessory" || c.category === "bag");
    const hasJewellery = chosen.some((c) => c.category === "jewellery");
    const completeness = (hasAccessory ? 5 : 0) + (hasJewellery ? 5 : 0);
    const raw = base + harmonyAvg + completeness;
    const score = Math.max(58, Math.min(99, Math.round(raw)));

    looks.push({
      id: `${Date.now()}-${variant}-${Math.random().toString(36).slice(2, 7)}`,
      name: `Look ${String(looks.length + 1).padStart(2, "0")} — ${req.vibe ?? "Soft"} ${req.occasion ?? "Everyday"}`,
      occasion: req.occasion ?? null,
      vibe: req.vibe ?? null,
      weather: req.weather ?? null,
      itemIds: chosen.map((c) => c.id),
      beauty: beautyFor(req.vibe, req.prefs),
      score,
      favorite: false,
      createdAt: new Date().toISOString(),
    });
  }

  return looks;
}

/** Very small natural-language parser: "something cute for college using my pink top" */
export function parseStyleRequest(
  text: string,
  items: Item[],
  vocab: { occasions: string[]; vibes: string[]; weathers: string[] },
) {
  const lower = text.toLowerCase();
  const occasion = vocab.occasions.find((o) => lower.includes(o.toLowerCase()));
  const vibe = vocab.vibes.find((v) => lower.includes(v.toLowerCase()));
  const weather = vocab.weathers.find((w) => lower.includes(w.toLowerCase()));
  const matched = items.filter((i) => {
    const words = i.name.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    return words.length > 0 && words.every((w) => lower.includes(w));
  });
  return { occasion, vibe, weather, lockedIds: matched.slice(0, 2).map((m) => m.id) };
}
