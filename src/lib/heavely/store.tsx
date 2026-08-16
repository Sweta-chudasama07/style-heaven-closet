import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_ITEMS } from "./demo";
import { blobToDataUrl, compressImage } from "./image";
import type { Category, Item, Look, PhotoSession, StylePrefs } from "./types";

type NewItem = Omit<Item, "id" | "createdAt" | "imageUrl" | "imagePath" | "favorite"> & {
  favorite?: boolean;
  file?: File | null;
};

type Ctx = {
  ready: boolean;
  session: Session | null;
  demo: boolean;
  name: string;
  items: Item[];
  looks: Look[];
  photos: PhotoSession[];
  prefs: StylePrefs;
  startDemo: () => void;
  exitDemo: () => void;
  addItem: (item: NewItem) => Promise<void>;
  updateItem: (id: string, patch: Partial<Item>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  toggleItemFavorite: (id: string) => Promise<void>;
  saveLook: (look: Look) => Promise<void>;
  updateLook: (id: string, patch: Partial<Look>) => Promise<void>;
  removeLook: (id: string) => Promise<void>;
  savePhoto: (dataUrl: string, meta: { theme: string; layout: string; caption: string }) => Promise<void>;
  removePhoto: (id: string) => Promise<void>;
  savePrefs: (p: StylePrefs) => Promise<void>;
  setName: (n: string) => Promise<void>;
  itemsById: Record<string, Item>;
  streak: number;
};

const emptyPrefs: StylePrefs = {
  favoriteColors: [],
  favoriteStyles: [],
  preferredOccasions: [],
  beauty: {},
};

const HeavelyContext = createContext<Ctx | null>(null);

const DEMO_KEY = "heavely-demo-v1";

type DemoState = { items: Item[]; looks: Look[]; photos: PhotoSession[]; prefs: StylePrefs; name: string };

function loadDemo(): DemoState {
  if (typeof window === "undefined") return { items: DEMO_ITEMS, looks: [], photos: [], prefs: emptyPrefs, name: "Guest" };
  try {
    const raw = window.localStorage.getItem(DEMO_KEY);
    if (raw) return { ...{ items: DEMO_ITEMS, looks: [], photos: [], prefs: emptyPrefs, name: "Guest" }, ...JSON.parse(raw) };
  } catch {
    /* ignore corrupt demo data */
  }
  return { items: DEMO_ITEMS, looks: [], photos: [], prefs: emptyPrefs, name: "Guest" };
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function HeavelyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [demo, setDemo] = useState(false);
  const [name, setNameState] = useState("Guest");
  const [items, setItems] = useState<Item[]>([]);
  const [looks, setLooks] = useState<Look[]>([]);
  const [photos, setPhotos] = useState<PhotoSession[]>([]);
  const [prefs, setPrefs] = useState<StylePrefs>(emptyPrefs);
  const demoRef = useRef(false);
  demoRef.current = demo;

  const persistDemo = useCallback((next: Partial<DemoState>) => {
    if (typeof window === "undefined") return;
    const current = loadDemo();
    window.localStorage.setItem(DEMO_KEY, JSON.stringify({ ...current, ...next }));
  }, []);

  const applyDemo = useCallback(() => {
    const d = loadDemo();
    setItems(d.items);
    setLooks(d.looks);
    setPhotos(d.photos);
    setPrefs(d.prefs);
    setNameState(d.name);
  }, []);

  const signUrls = useCallback(async (rows: { image_path: string | null }[]) => {
    const paths = rows.map((r) => r.image_path).filter((p): p is string => !!p);
    if (paths.length === 0) return {} as Record<string, string>;
    const { data } = await supabase.storage.from("wardrobe").createSignedUrls(paths, 3600);
    const map: Record<string, string> = {};
    data?.forEach((d) => {
      if (d.path && d.signedUrl) map[d.path] = d.signedUrl;
    });
    return map;
  }, []);

  const loadAccount = useCallback(async () => {
    const [itemsRes, outfitsRes, photosRes, prefsRes, profileRes] = await Promise.all([
      supabase.from("wardrobe_items").select("*").order("created_at", { ascending: false }),
      supabase.from("outfits").select("*").order("created_at", { ascending: false }),
      supabase.from("photo_sessions").select("*").order("created_at", { ascending: false }),
      supabase.from("style_preferences").select("*").maybeSingle(),
      supabase.from("profiles").select("*").maybeSingle(),
    ]);

    const itemRows = itemsRes.data ?? [];
    const photoRows = photosRes.data ?? [];
    const urls = await signUrls([...itemRows, ...photoRows.map((p) => ({ image_path: p.photo_path }))]);

    setItems(
      itemRows.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category as Category,
        subcategory: r.subcategory,
        color: r.color,
        style: r.style,
        season: r.season,
        occasion: r.occasion ?? [],
        favorite: r.favorite,
        imagePath: r.image_path,
        imageUrl: r.image_path ? (urls[r.image_path] ?? null) : null,
        createdAt: r.created_at,
      })),
    );
    setLooks(
      (outfitsRes.data ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        occasion: r.occasion,
        vibe: r.vibe,
        weather: r.weather,
        itemIds: r.item_ids ?? [],
        beauty: (r.beauty as { makeup: string; hair: string }) ?? { makeup: "", hair: "" },
        score: r.score ?? 0,
        favorite: r.favorite,
        photoUrl: r.photo_path ? (urls[r.photo_path] ?? null) : null,
        createdAt: r.created_at,
      })),
    );
    setPhotos(
      photoRows.map((r) => ({
        id: r.id,
        theme: r.theme ?? "",
        layout: r.layout ?? "",
        caption: r.caption ?? "",
        url: urls[r.photo_path] ?? "",
        createdAt: r.created_at,
      })),
    );
    if (prefsRes.data) {
      setPrefs({
        favoriteColors: prefsRes.data.favorite_colors ?? [],
        favoriteStyles: prefsRes.data.favorite_styles ?? [],
        preferredOccasions: prefsRes.data.preferred_occasions ?? [],
        beauty: (prefsRes.data.beauty_preferences as StylePrefs["beauty"]) ?? {},
      });
    }
    if (profileRes.data?.display_name) setNameState(profileRes.data.display_name);
  }, [signUrls]);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!active) return;
      setSession(s);
      if (s) {
        setDemo(false);
        if (typeof window !== "undefined") window.localStorage.removeItem("heavely-demo-on");
        void loadAccount().finally(() => setReady(true));
      } else {
        setItems([]);
        setLooks([]);
        setPhotos([]);
      }
    });

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session) {
        await loadAccount();
      } else if (typeof window !== "undefined" && window.localStorage.getItem("heavely-demo-on") === "1") {
        setDemo(true);
        applyDemo();
      }
      setReady(true);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadAccount, applyDemo]);

  const startDemo = useCallback(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("heavely-demo-on", "1");
    setDemo(true);
    applyDemo();
  }, [applyDemo]);

  const exitDemo = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("heavely-demo-on");
      window.localStorage.removeItem(DEMO_KEY);
    }
    setDemo(false);
    setItems([]);
    setLooks([]);
    setPhotos([]);
  }, []);

  const addItem = useCallback<Ctx["addItem"]>(
    async ({ file, ...rest }) => {
      if (demoRef.current || !session) {
        const dataUrl = file ? await blobToDataUrl(await compressImage(file, 600)) : null;
        const item: Item = { id: uid(), createdAt: new Date().toISOString(), favorite: false, imageUrl: dataUrl, ...rest };
        setItems((prev) => {
          const next = [item, ...prev];
          persistDemo({ items: next });
          return next;
        });
        return;
      }
      let path: string | null = null;
      if (file) {
        const blob = await compressImage(file);
        path = `${session.user.id}/${uid()}.webp`;
        const { error } = await supabase.storage.from("wardrobe").upload(path, blob, { contentType: "image/webp" });
        if (error) throw error;
      }
      const { data, error } = await supabase
        .from("wardrobe_items")
        .insert({
          user_id: session.user.id,
          name: rest.name,
          category: rest.category,
          subcategory: rest.subcategory ?? null,
          color: rest.color ?? null,
          style: rest.style ?? null,
          season: rest.season ?? null,
          occasion: rest.occasion,
          image_path: path,
        })
        .select()
        .single();
      if (error) throw error;
      let url: string | null = null;
      if (path) {
        const signed = await supabase.storage.from("wardrobe").createSignedUrl(path, 3600);
        url = signed.data?.signedUrl ?? null;
      }
      setItems((prev) => [
        {
          id: data.id,
          name: data.name,
          category: data.category as Category,
          subcategory: data.subcategory,
          color: data.color,
          style: data.style,
          season: data.season,
          occasion: data.occasion ?? [],
          favorite: data.favorite,
          imagePath: data.image_path,
          imageUrl: url,
          createdAt: data.created_at,
        },
        ...prev,
      ]);
    },
    [session, persistDemo],
  );

  const updateItem = useCallback<Ctx["updateItem"]>(
    async (id, patch) => {
      setItems((prev) => {
        const next = prev.map((i) => (i.id === id ? { ...i, ...patch } : i));
        if (demoRef.current || !session) persistDemo({ items: next });
        return next;
      });
      if (demoRef.current || !session) return;
      const { error } = await supabase
        .from("wardrobe_items")
        .update({
          ...(patch.name !== undefined ? { name: patch.name } : {}),
          ...(patch.category !== undefined ? { category: patch.category } : {}),
          ...(patch.subcategory !== undefined ? { subcategory: patch.subcategory } : {}),
          ...(patch.color !== undefined ? { color: patch.color } : {}),
          ...(patch.style !== undefined ? { style: patch.style } : {}),
          ...(patch.season !== undefined ? { season: patch.season } : {}),
          ...(patch.occasion !== undefined ? { occasion: patch.occasion } : {}),
          ...(patch.favorite !== undefined ? { favorite: patch.favorite } : {}),
        })
        .eq("id", id);
      if (error) throw error;
    },
    [session, persistDemo],
  );

  const removeItem = useCallback<Ctx["removeItem"]>(
    async (id) => {
      const target = items.find((i) => i.id === id);
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        if (demoRef.current || !session) persistDemo({ items: next });
        return next;
      });
      if (demoRef.current || !session) return;
      if (target?.imagePath) await supabase.storage.from("wardrobe").remove([target.imagePath]);
      const { error } = await supabase.from("wardrobe_items").delete().eq("id", id);
      if (error) throw error;
    },
    [items, session, persistDemo],
  );

  const toggleItemFavorite = useCallback<Ctx["toggleItemFavorite"]>(
    async (id) => {
      const target = items.find((i) => i.id === id);
      if (!target) return;
      await updateItem(id, { favorite: !target.favorite });
    },
    [items, updateItem],
  );

  const saveLook = useCallback<Ctx["saveLook"]>(
    async (look) => {
      if (demoRef.current || !session) {
        setLooks((prev) => {
          const next = [{ ...look, id: uid() }, ...prev];
          persistDemo({ looks: next });
          return next;
        });
        return;
      }
      const { data, error } = await supabase
        .from("outfits")
        .insert({
          user_id: session.user.id,
          name: look.name,
          occasion: look.occasion ?? null,
          vibe: look.vibe ?? null,
          weather: look.weather ?? null,
          item_ids: look.itemIds,
          beauty: look.beauty,
          score: look.score,
        })
        .select()
        .single();
      if (error) throw error;
      setLooks((prev) => [{ ...look, id: data.id, createdAt: data.created_at }, ...prev]);
    },
    [session, persistDemo],
  );

  const updateLook = useCallback<Ctx["updateLook"]>(
    async (id, patch) => {
      setLooks((prev) => {
        const next = prev.map((l) => (l.id === id ? { ...l, ...patch } : l));
        if (demoRef.current || !session) persistDemo({ looks: next });
        return next;
      });
      if (demoRef.current || !session) return;
      const { error } = await supabase
        .from("outfits")
        .update({
          ...(patch.name !== undefined ? { name: patch.name } : {}),
          ...(patch.favorite !== undefined ? { favorite: patch.favorite } : {}),
          ...(patch.itemIds !== undefined ? { item_ids: patch.itemIds } : {}),
          ...(patch.beauty !== undefined ? { beauty: patch.beauty } : {}),
        })
        .eq("id", id);
      if (error) throw error;
    },
    [session, persistDemo],
  );

  const removeLook = useCallback<Ctx["removeLook"]>(
    async (id) => {
      setLooks((prev) => {
        const next = prev.filter((l) => l.id !== id);
        if (demoRef.current || !session) persistDemo({ looks: next });
        return next;
      });
      if (demoRef.current || !session) return;
      const { error } = await supabase.from("outfits").delete().eq("id", id);
      if (error) throw error;
    },
    [session, persistDemo],
  );

  const savePhoto = useCallback<Ctx["savePhoto"]>(
    async (dataUrl, meta) => {
      if (demoRef.current || !session) {
        setPhotos((prev) => {
          const next = [{ id: uid(), url: dataUrl, createdAt: new Date().toISOString(), ...meta }, ...prev].slice(0, 8);
          persistDemo({ photos: next });
          return next;
        });
        return;
      }
      const blob = await (await fetch(dataUrl)).blob();
      const path = `${session.user.id}/booth-${uid()}.webp`;
      const up = await supabase.storage.from("wardrobe").upload(path, blob, { contentType: "image/webp" });
      if (up.error) throw up.error;
      const { data, error } = await supabase
        .from("photo_sessions")
        .insert({ user_id: session.user.id, photo_path: path, ...meta })
        .select()
        .single();
      if (error) throw error;
      const signed = await supabase.storage.from("wardrobe").createSignedUrl(path, 3600);
      setPhotos((prev) => [
        { id: data.id, url: signed.data?.signedUrl ?? dataUrl, createdAt: data.created_at, ...meta },
        ...prev,
      ]);
    },
    [session, persistDemo],
  );

  const removePhoto = useCallback<Ctx["removePhoto"]>(
    async (id) => {
      setPhotos((prev) => {
        const next = prev.filter((p) => p.id !== id);
        if (demoRef.current || !session) persistDemo({ photos: next });
        return next;
      });
      if (demoRef.current || !session) return;
      const { error } = await supabase.from("photo_sessions").delete().eq("id", id);
      if (error) throw error;
    },
    [session, persistDemo],
  );

  const savePrefs = useCallback<Ctx["savePrefs"]>(
    async (p) => {
      setPrefs(p);
      if (demoRef.current || !session) {
        persistDemo({ prefs: p });
        return;
      }
      const { error } = await supabase.from("style_preferences").upsert({
        user_id: session.user.id,
        favorite_colors: p.favoriteColors,
        favorite_styles: p.favoriteStyles,
        preferred_occasions: p.preferredOccasions,
        beauty_preferences: p.beauty,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    [session, persistDemo],
  );

  const setName = useCallback<Ctx["setName"]>(
    async (n) => {
      setNameState(n);
      if (demoRef.current || !session) {
        persistDemo({ name: n });
        return;
      }
      const { error } = await supabase.from("profiles").upsert({ id: session.user.id, display_name: n });
      if (error) throw error;
    },
    [session, persistDemo],
  );

  const itemsById = useMemo(() => Object.fromEntries(items.map((i) => [i.id, i])), [items]);
  const streak = useMemo(() => {
    const days = new Set(looks.map((l) => l.createdAt.slice(0, 10)));
    return Math.max(1, days.size);
  }, [looks]);

  const value: Ctx = {
    ready,
    session,
    demo,
    name,
    items,
    looks,
    photos,
    prefs,
    startDemo,
    exitDemo,
    addItem,
    updateItem,
    removeItem,
    toggleItemFavorite,
    saveLook,
    updateLook,
    removeLook,
    savePhoto,
    removePhoto,
    savePrefs,
    setName,
    itemsById,
    streak,
  };

  return <HeavelyContext.Provider value={value}>{children}</HeavelyContext.Provider>;
}

export function useHeavely() {
  const ctx = useContext(HeavelyContext);
  if (!ctx) throw new Error("useHeavely must be used inside HeavelyProvider");
  return ctx;
}
