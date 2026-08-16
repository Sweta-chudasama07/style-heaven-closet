export const CATEGORIES = [
  "top",
  "bottom",
  "dress",
  "ethnic",
  "outerwear",
  "shoes",
  "jewellery",
  "bag",
  "accessory",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABEL: Record<Category, string> = {
  top: "Tops",
  bottom: "Bottoms",
  dress: "Dresses",
  ethnic: "Ethnic wear",
  outerwear: "Outerwear",
  shoes: "Shoes",
  jewellery: "Jewellery",
  bag: "Bags",
  accessory: "Accessories",
};

export const SUBCATEGORIES: Partial<Record<Category, string[]>> = {
  jewellery: ["Earrings", "Necklace", "Bracelet", "Ring", "Anklet"],
  accessory: ["Sunglasses", "Hair accessory", "Belt", "Scarf", "Watch"],
  shoes: ["Sneakers", "Heels", "Flats", "Sandals", "Boots"],
  bag: ["Handbag", "Tote", "Clutch", "Sling"],
};

export const CLOSET_GROUPS = {
  clothes: ["top", "bottom", "dress", "ethnic", "outerwear"] as Category[],
  jewellery: ["jewellery"] as Category[],
  accessories: ["accessory", "bag"] as Category[],
  shoes: ["shoes"] as Category[],
};

export type ClosetGroup = keyof typeof CLOSET_GROUPS;

export const COLORS = [
  "pink",
  "rose",
  "red",
  "peach",
  "cream",
  "white",
  "beige",
  "brown",
  "black",
  "grey",
  "blue",
  "denim",
  "lavender",
  "green",
  "yellow",
  "gold",
  "silver",
  "pearl",
  "multi",
];

export const STYLES = [
  "Soft",
  "Cute",
  "Elegant",
  "Dreamy",
  "Minimal",
  "Y2K",
  "Romantic",
  "Traditional",
  "Edgy",
  "Playful",
];

export const SEASONS = ["All", "Summer", "Winter", "Spring", "Autumn", "Rainy"];

export const OCCASIONS = [
  "College",
  "Casual day",
  "Party",
  "Birthday",
  "Wedding",
  "Festival",
  "Dinner",
  "Café",
  "Photoshoot",
  "Vacation",
];

export const WEATHERS = ["Hot", "Warm", "Cool", "Rainy", "Cold"];

export const FEELINGS = [
  "Confident",
  "Comfortable",
  "Cute",
  "Elegant",
  "Effortless",
  "Bold",
];

export type Item = {
  id: string;
  name: string;
  category: Category;
  subcategory?: string | null;
  color?: string | null;
  style?: string | null;
  season?: string | null;
  occasion: string[];
  favorite: boolean;
  imagePath?: string | null;
  imageUrl?: string | null;
  createdAt: string;
};

export type Beauty = { makeup: string; hair: string };

export type Look = {
  id: string;
  name: string;
  occasion?: string | null;
  vibe?: string | null;
  weather?: string | null;
  itemIds: string[];
  beauty: Beauty;
  score: number;
  favorite: boolean;
  photoUrl?: string | null;
  createdAt: string;
};

export type PhotoSession = {
  id: string;
  theme: string;
  layout: string;
  caption: string;
  url: string;
  createdAt: string;
};

export type StylePrefs = {
  favoriteColors: string[];
  favoriteStyles: string[];
  preferredOccasions: string[];
  beauty: { makeup?: string; hair?: string };
};
