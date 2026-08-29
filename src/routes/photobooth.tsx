import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Camera, Trash2 } from "lucide-react";
import { Shell } from "@/components/heavely/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/heavely/EmptyState";
import { useHeavely } from "@/lib/heavely/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/photobooth")({
  head: () => ({
    meta: [
      { title: "Photobooth — HEAVELY" },
      { name: "description", content: "Capture your outfit of the day as a dreamy Polaroid and keep it in your fashion diary." },
      { property: "og:title", content: "Photobooth — HEAVELY" },
      { property: "og:description", content: "Polaroid-style outfit captures." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Photobooth,
});

const THEMES = [
  { key: "blush", label: "Blush", tint: "rgba(249,215,224,0.35)" },
  { key: "powder", label: "Powder", tint: "rgba(214,230,246,0.35)" },
  { key: "lavender", label: "Lavender", tint: "rgba(230,220,244,0.35)" },
  { key: "cream", label: "Cream", tint: "rgba(250,241,228,0.35)" },
];

function Photobooth() {
  const { photos, savePhoto, removePhoto } = useHeavely();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [live, setLive] = useState(false);
  const [theme, setTheme] = useState(THEMES[0]!);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setLive(true);
    } catch {
      toast.error("We couldn't reach your camera. Check permissions ♡");
    }
  }

  async function capture() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme.tint;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    await savePhoto(dataUrl, { theme: theme.label, layout: "single", caption });
    setCaption("");
    toast.success("Captured ✦");
  }

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-4xl">HEAVELY Photobooth</h1>
        <p className="script text-xl text-muted-foreground">Outfit of the day, immortalised.</p>

        <section className="glass mt-6 rounded-[2rem] p-6">
          <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-3xl bg-blush/40">
            <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0" style={{ background: theme.tint }} />
            {!live ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button onClick={() => void start()}>
                  <Camera className="size-4" aria-hidden /> Start camera
                </Button>
              </div>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {THEMES.map((t) => (
              <button
                key={t.key}
                onClick={() => setTheme(t)}
                aria-pressed={theme.key === t.key}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm transition-colors",
                  theme.key === t.key ? "bg-blush text-foreground" : "bg-card text-muted-foreground hover:bg-blush/60",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mx-auto mt-4 flex max-w-sm gap-2">
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption this look"
              aria-label="Caption"
            />
            <Button onClick={() => void capture()} disabled={!live}>
              Capture
            </Button>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl">Your booth strip</h2>
          {photos.length === 0 ? (
            <div className="mt-4">
              <EmptyState title="No photos yet" hint="Start the camera and capture your first look." />
            </div>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((p) => (
                <li key={p.id} className="polaroid rounded-2xl bg-card p-3">
                  <img src={p.url} alt={p.caption || "Photobooth capture"} loading="lazy" className="aspect-[3/4] w-full rounded-xl object-cover" />
                  <p className="script mt-2 text-lg">{p.caption || p.theme}</p>
                  <Button size="sm" variant="ghost" onClick={() => void removePhoto(p.id)}>
                    <Trash2 className="size-4" aria-hidden /> Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Shell>
  );
}
