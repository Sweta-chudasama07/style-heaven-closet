const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic"];
const MAX_BYTES = 12 * 1024 * 1024;

export function validateImage(file: File): string | null {
  if (!ALLOWED.includes(file.type)) return "That file type isn't supported — try a JPG, PNG or WEBP.";
  if (file.size > MAX_BYTES) return "That image is a little too big (max 12MB).";
  return null;
}

/** Downscale in the browser so we never ship huge originals to storage. */
export async function compressImage(file: File, max = 900): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not process image"))), "image/webp", 0.85),
  );
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(blob);
  });
}

/** Naive, offline "auto-categorisation" suggestion from the file name + colour guess. */
export function suggestFromName(name: string) {
  const n = name.toLowerCase();
  const map: [string, string][] = [
    ["dress", "dress"], ["gown", "dress"], ["saree", "ethnic"], ["kurta", "ethnic"],
    ["lehenga", "ethnic"], ["anarkali", "ethnic"], ["jacket", "outerwear"], ["coat", "outerwear"],
    ["cardigan", "top"], ["top", "top"], ["shirt", "top"], ["blouse", "top"], ["tee", "top"],
    ["skirt", "bottom"], ["jean", "bottom"], ["trouser", "bottom"], ["pant", "bottom"], ["short", "bottom"],
    ["shoe", "shoes"], ["heel", "shoes"], ["sneaker", "shoes"], ["flat", "shoes"], ["boot", "shoes"],
    ["earring", "jewellery"], ["necklace", "jewellery"], ["bracelet", "jewellery"], ["ring", "jewellery"],
    ["bag", "bag"], ["tote", "bag"], ["clutch", "bag"], ["purse", "bag"],
    ["ribbon", "accessory"], ["scarf", "accessory"], ["belt", "accessory"], ["watch", "accessory"], ["sunglass", "accessory"],
  ];
  const colors = ["pink", "rose", "red", "peach", "cream", "white", "beige", "brown", "black", "grey", "blue", "denim", "lavender", "green", "yellow", "gold", "silver", "pearl"];
  return {
    category: map.find(([k]) => n.includes(k))?.[1],
    color: colors.find((c) => n.includes(c)),
  };
}
