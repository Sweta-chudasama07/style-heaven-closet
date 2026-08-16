import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHeavely } from "@/lib/heavely/store";
import { compressImage, suggestFromName, validateImage } from "@/lib/heavely/image";
import {
  CATEGORIES,
  CATEGORY_LABEL,
  COLORS,
  OCCASIONS,
  SEASONS,
  STYLES,
  SUBCATEGORIES,
  type Category,
  type Item,
} from "@/lib/heavely/types";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item?: Item | null;
  defaultCategory?: Category;
};

const empty = {
  name: "",
  category: "top" as Category,
  subcategory: "",
  color: "pink",
  style: "Soft",
  season: "All",
  occasion: [] as string[],
};

export function ItemDialog({ open, onOpenChange, item, defaultCategory }: Props) {
  const { addItem, updateItem, removeItem } = useHeavely();
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [suggested, setSuggested] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setFile(null);
    setSuggested(null);
    if (item) {
      setForm({
        name: item.name,
        category: item.category,
        subcategory: item.subcategory ?? "",
        color: item.color ?? "pink",
        style: item.style ?? "Soft",
        season: item.season ?? "All",
        occasion: item.occasion,
      });
      setPreview(item.imageUrl ?? null);
    } else {
      setForm({ ...empty, category: defaultCategory ?? "top" });
      setPreview(null);
    }
  }, [open, item, defaultCategory]);

  async function handleFile(f: File | undefined | null) {
    if (!f) return;
    const err = validateImage(f);
    if (err) {
      toast.error(err);
      return;
    }
    setFile(f);
    try {
      const blob = await compressImage(f, 500);
      setPreview(URL.createObjectURL(blob));
    } catch {
      setPreview(URL.createObjectURL(f));
    }
    const guess = suggestFromName(f.name);
    if (guess.category || guess.color) {
      setForm((p) => ({
        ...p,
        category: (guess.category as Category) ?? p.category,
        color: guess.color ?? p.color,
        name: p.name || f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      }));
      setSuggested(
        `We guessed ${guess.category ? CATEGORY_LABEL[guess.category as Category] : "a category"}${guess.color ? ` in ${guess.color}` : ""} — change anything that isn't right.`,
      );
    }
  }

  async function submit() {
    if (!form.name.trim()) {
      toast.error("Give this little piece a name first.");
      return;
    }
    setBusy(true);
    try {
      if (item) {
        await updateItem(item.id, {
          name: form.name.trim(),
          category: form.category,
          subcategory: form.subcategory || null,
          color: form.color,
          style: form.style,
          season: form.season,
          occasion: form.occasion,
        });
        toast.success("Updated ♡");
      } else {
        await addItem({
          name: form.name.trim(),
          category: form.category,
          subcategory: form.subcategory || null,
          color: form.color,
          style: form.style,
          season: form.season,
          occasion: form.occasion,
          file,
        });
        toast.success("Added to your closet ✦");
      }
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went a little off-script. Try again ♡");
    } finally {
      setBusy(false);
    }
  }

  const subs = SUBCATEGORIES[form.category];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {item ? "Edit piece" : "Add a piece"}
          </DialogTitle>
          <DialogDescription>
            Photos stay private to your closet. Only you can see them.
          </DialogDescription>
        </DialogHeader>

        {!item ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              void handleFile(e.dataTransfer.files?.[0]);
            }}
            className={cn(
              "rounded-3xl border-2 border-dashed border-border p-4 text-center transition-colors",
              drag && "border-primary bg-blush/50",
            )}
          >
            {preview ? (
              <img src={preview} alt="Preview of the piece you're adding" className="mx-auto max-h-44 rounded-2xl object-contain" />
            ) : (
              <p className="text-sm text-muted-foreground">Drag a photo here, or choose one below</p>
            )}
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Label htmlFor="item-file" className="cursor-pointer rounded-full bg-secondary px-4 py-2 text-sm">
                Choose photo
              </Label>
              <Input
                id="item-file"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => void handleFile(e.target.files?.[0])}
              />
              <Label htmlFor="item-camera" className="cursor-pointer rounded-full bg-blush px-4 py-2 text-sm">
                Take photo
              </Label>
              <Input
                id="item-camera"
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(e) => void handleFile(e.target.files?.[0])}
              />
            </div>
            {suggested ? <p className="mt-2 text-xs text-muted-foreground">{suggested}</p> : null}
          </div>
        ) : null}

        <div className="space-y-4">
          <div>
            <Label htmlFor="item-name">Name</Label>
            <Input
              id="item-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Pink cardigan"
              className="mt-1"
            />
          </div>

          <Chips
            label="Category"
            options={CATEGORIES.map((c) => CATEGORY_LABEL[c])}
            value={CATEGORY_LABEL[form.category]}
            onChange={(v) => {
              const cat = CATEGORIES.find((c) => CATEGORY_LABEL[c] === v)!;
              setForm({ ...form, category: cat, subcategory: "" });
            }}
          />

          {subs ? (
            <Chips
              label="Type"
              options={subs}
              value={form.subcategory}
              onChange={(v) => setForm({ ...form, subcategory: v === form.subcategory ? "" : v })}
            />
          ) : null}

          <Chips label="Colour" options={COLORS} value={form.color} onChange={(v) => setForm({ ...form, color: v })} />
          <Chips label="Style" options={STYLES} value={form.style} onChange={(v) => setForm({ ...form, style: v })} />
          <Chips label="Season" options={SEASONS} value={form.season} onChange={(v) => setForm({ ...form, season: v })} />
          <Chips
            label="Occasions"
            options={OCCASIONS}
            multi
            values={form.occasion}
            onChange={(v) =>
              setForm({
                ...form,
                occasion: form.occasion.includes(v)
                  ? form.occasion.filter((o) => o !== v)
                  : [...form.occasion, v],
              })
            }
          />
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          {item ? (
            <Button
              variant="ghost"
              onClick={async () => {
                await removeItem(item.id);
                toast.success("Removed from your closet");
                onOpenChange(false);
              }}
            >
              Delete
            </Button>
          ) : (
            <span />
          )}
          <Button onClick={() => void submit()} disabled={busy}>
            {busy ? "Saving..." : item ? "Save changes" : "Add to closet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Chips({
  label,
  options,
  value,
  values,
  multi,
  onChange,
}: {
  label: string;
  options: string[];
  value?: string;
  values?: string[];
  multi?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = multi ? values?.includes(o) : value === o;
          return (
            <button
              key={o}
              type="button"
              aria-pressed={!!active}
              onClick={() => onChange(o)}
              className={cn(
                "rounded-full border border-border px-3 py-1 text-xs transition-colors",
                active ? "bg-primary text-primary-foreground" : "bg-card hover:bg-blush/60",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
