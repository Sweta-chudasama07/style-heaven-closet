import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Shirt, Camera, BookHeart } from "lucide-react";
import { Shell } from "@/components/heavely/Shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/heavely/EmptyState";
import { ItemTile } from "@/components/heavely/ItemTile";
import { useHeavely } from "@/lib/heavely/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Style Studio — HEAVELY" },
      { name: "description", content: "Your personal style room: today's mood, your closet highlights and a look ready to wear." },
      { property: "og:title", content: "Your Style Studio — HEAVELY" },
      { property: "og:description", content: "Today's mood, your closet highlights and a look ready to wear." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TILES = [
  { to: "/style-me", label: "Style Me", note: "Get three looks from what you own", icon: Sparkles },
  { to: "/closet", label: "My Closet", note: "Add and browse your pieces", icon: Shirt },
  { to: "/photobooth", label: "Photobooth", note: "Capture the outfit of the day", icon: Camera },
  { to: "/looks", label: "Fashion Diary", note: "Everything you've saved", icon: BookHeart },
] as const;

function Dashboard() {
  const { name, items, looks, photos, streak, toggleItemFavorite } = useHeavely();
  const navigate = useNavigate();
  const recent = items.slice(0, 6);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  function pick(id: string) {
    if (id === "closet") return void navigate({ to: "/closet" });
    if (id === "style") return void navigate({ to: "/style-me" });
    if (id === "booth") return void navigate({ to: "/photobooth" });
    return void navigate({ to: "/looks" });
  }


  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="glass rounded-[2rem] p-8">
          <p className="script text-2xl text-muted-foreground">{greeting},</p>
          <h1 className="font-display text-4xl">{name} ✦</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Your closet holds {items.length} {items.length === 1 ? "piece" : "pieces"}, {looks.length}{" "}
            saved {looks.length === 1 ? "look" : "looks"} and {photos.length} booth{" "}
            {photos.length === 1 ? "photo" : "photos"}. Styling streak: {streak} days.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/style-me">Style me today</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/closet">Add a piece</Link>
            </Button>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className="glass rounded-3xl p-5 transition-transform hover:-translate-y-1"
              >
                <Icon className="size-5 text-primary" aria-hidden />
                <h2 className="mt-3 font-display text-xl">{t.label}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t.note}</p>
              </Link>
            );
          })}
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl">Recently added</h2>
          <div className="mt-4">
            {recent.length === 0 ? (
              <EmptyState
                title="Your closet is still a blank page"
                hint="Add a few favourites and HEAVELY will start styling them."
                action={
                  <Button asChild>
                    <Link to="/closet">Open my closet</Link>
                  </Button>
                }
              />
            ) : (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {recent.map((item) => (
                  <li key={item.id}>
                    <ItemTile item={item} onFavorite={() => void toggleItemFavorite(item.id)} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </Shell>
  );
}
