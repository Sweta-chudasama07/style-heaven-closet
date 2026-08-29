import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Shell } from "@/components/heavely/Shell";
import { Button } from "@/components/ui/button";
import { LookCard } from "@/components/heavely/LookCard";
import { EmptyState } from "@/components/heavely/EmptyState";
import { useHeavely } from "@/lib/heavely/store";

export const Route = createFileRoute("/looks")({
  head: () => ({
    meta: [
      { title: "Fashion Diary — HEAVELY" },
      { name: "description", content: "Every look you've saved, kept like pages in a dreamy fashion diary." },
      { property: "og:title", content: "Fashion Diary — HEAVELY" },
      { property: "og:description", content: "Your saved looks, all in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Looks,
});

function Looks() {
  const { looks, items, updateLook, removeLook } = useHeavely();

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-4xl">Fashion Diary</h1>
        <p className="script text-xl text-muted-foreground">Pages of you.</p>

        <div className="mt-8 space-y-6">
          {looks.length === 0 ? (
            <EmptyState
              title="Your diary is empty"
              hint="Save a look from Style Me and it will land here."
              action={
                <Button asChild>
                  <Link to="/style-me">Style me</Link>
                </Button>
              }
            />
          ) : (
            looks.map((look) => (
              <LookCard
                key={look.id}
                look={look}
                items={look.itemIds.map((id) => items.find((i) => i.id === id)).filter((i) => !!i)}
                onFavorite={() => void updateLook(look.id, { favorite: !look.favorite })}
                onDelete={() => void removeLook(look.id).then(() => toast.success("Removed from your diary"))}
                footerNote={new Date(look.createdAt).toLocaleDateString()}
              />
            ))
          )}
        </div>
      </div>
    </Shell>
  );
}
