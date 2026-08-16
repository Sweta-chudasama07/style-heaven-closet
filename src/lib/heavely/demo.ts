import type { Item } from "./types";

const now = new Date().toISOString();

let n = 0;
const mk = (i: Omit<Item, "id" | "favorite" | "createdAt"> & { favorite?: boolean }): Item => ({
  id: `demo-${++n}`,
  favorite: false,
  createdAt: now,
  ...i,
});

export const DEMO_ITEMS: Item[] = [
  mk({ name: "Pink cardigan", category: "top", color: "pink", style: "Soft", season: "Spring", occasion: ["College", "Café", "Casual day"], favorite: true }),
  mk({ name: "White cotton top", category: "top", color: "white", style: "Minimal", season: "Summer", occasion: ["College", "Casual day", "Café"] }),
  mk({ name: "Lace blouse", category: "top", color: "cream", style: "Romantic", season: "All", occasion: ["Dinner", "Birthday", "Photoshoot"] }),
  mk({ name: "Baby blue crop top", category: "top", color: "blue", style: "Y2K", season: "Summer", occasion: ["Party", "Birthday", "Vacation"] }),
  mk({ name: "White pleated skirt", category: "bottom", color: "white", style: "Soft", season: "Summer", occasion: ["College", "Café", "Photoshoot"] }),
  mk({ name: "Blue denim jeans", category: "bottom", color: "denim", style: "Minimal", season: "All", occasion: ["College", "Casual day", "Vacation"] }),
  mk({ name: "Black satin trousers", category: "bottom", color: "black", style: "Elegant", season: "All", occasion: ["Dinner", "Party"] }),
  mk({ name: "Floral midi dress", category: "dress", color: "pink", style: "Romantic", season: "Summer", occasion: ["Birthday", "Café", "Photoshoot", "Wedding"], favorite: true }),
  mk({ name: "Lavender slip dress", category: "dress", color: "lavender", style: "Dreamy", season: "Summer", occasion: ["Party", "Dinner", "Vacation"] }),
  mk({ name: "Rose anarkali", category: "ethnic", color: "rose", style: "Traditional", season: "All", occasion: ["Wedding", "Festival"] }),
  mk({ name: "Denim jacket", category: "outerwear", color: "denim", style: "Playful", season: "Autumn", occasion: ["College", "Casual day", "Vacation"] }),
  mk({ name: "Cream trench coat", category: "outerwear", color: "cream", style: "Elegant", season: "Winter", occasion: ["Dinner", "Casual day"] }),
  mk({ name: "White sneakers", category: "shoes", color: "white", style: "Minimal", season: "All", occasion: ["College", "Casual day", "Café", "Vacation"], favorite: true }),
  mk({ name: "Pearl heels", category: "shoes", color: "pearl", style: "Elegant", season: "All", occasion: ["Wedding", "Dinner", "Party"] }),
  mk({ name: "Pink ballet flats", category: "shoes", color: "pink", style: "Soft", season: "All", occasion: ["Café", "Birthday", "College"] }),
  mk({ name: "Pearl earrings", category: "jewellery", subcategory: "Earrings", color: "pearl", style: "Elegant", season: "All", occasion: ["Wedding", "Dinner", "Photoshoot"], favorite: true }),
  mk({ name: "Gold hoops", category: "jewellery", subcategory: "Earrings", color: "gold", style: "Y2K", season: "All", occasion: ["Party", "Birthday", "College"] }),
  mk({ name: "Silver chain necklace", category: "jewellery", subcategory: "Necklace", color: "silver", style: "Minimal", season: "All", occasion: ["Casual day", "Café", "Dinner"] }),
  mk({ name: "Charm bracelet", category: "jewellery", subcategory: "Bracelet", color: "gold", style: "Playful", season: "All", occasion: ["Birthday", "Festival"] }),
  mk({ name: "Pink handbag", category: "bag", subcategory: "Handbag", color: "pink", style: "Cute", season: "All", occasion: ["Birthday", "Café", "Party"] }),
  mk({ name: "Cream tote", category: "bag", subcategory: "Tote", color: "cream", style: "Minimal", season: "All", occasion: ["College", "Casual day"] }),
  mk({ name: "Pearl clutch", category: "bag", subcategory: "Clutch", color: "pearl", style: "Elegant", season: "All", occasion: ["Wedding", "Dinner"] }),
  mk({ name: "Pink hair ribbon", category: "accessory", subcategory: "Hair accessory", color: "pink", style: "Soft", season: "All", occasion: ["Café", "Birthday", "Photoshoot"], favorite: true }),
  mk({ name: "Tinted sunglasses", category: "accessory", subcategory: "Sunglasses", color: "brown", style: "Y2K", season: "Summer", occasion: ["Vacation", "Casual day"] }),
  mk({ name: "Silk scarf", category: "accessory", subcategory: "Scarf", color: "lavender", style: "Romantic", season: "Spring", occasion: ["Café", "Photoshoot", "Dinner"] }),
  mk({ name: "Slim gold watch", category: "accessory", subcategory: "Watch", color: "gold", style: "Elegant", season: "All", occasion: ["Dinner", "College"] }),
];
