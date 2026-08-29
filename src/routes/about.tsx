import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/heavely/Shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About HEAVELY — Your Personal Style Studio" },
      { name: "description", content: "HEAVELY helps you rediscover the clothes you already own with dreamy outfit ideas, beauty pairings and a Polaroid photobooth." },
      { property: "og:title", content: "About HEAVELY" },
      { property: "og:description", content: "Wear your own kind of heaven." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const STEPS = [
  { title: "Add your pieces", body: "Photograph or simply name what's in your wardrobe — clothes, jewellery, bags, shoes." },
  { title: "Tell us the moment", body: "Occasion, vibe, weather, and how you want to feel walking in." },
  { title: "Wear it", body: "Get complete looks with makeup and hair notes, remix them, and save the ones you love." },
];

function About() {
  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-4xl">About HEAVELY</h1>
        <p className="script mt-2 text-2xl text-muted-foreground">Wear your own kind of heaven.</p>
        <p className="mt-6 text-muted-foreground">
          HEAVELY is a small, soft styling studio for the wardrobe you already have. Nothing here asks you to buy
          anything — it simply looks at your pieces and finds combinations you haven't tried yet.
        </p>

        <section id="how" className="mt-12 scroll-mt-24">
          <h2 className="font-display text-3xl">How it works</h2>
          <ol className="mt-4 space-y-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="glass rounded-3xl p-6">
                <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Step {i + 1}</span>
                <h3 className="font-display text-xl">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
          <Button asChild className="mt-6">
            <Link to="/closet">Start with my closet</Link>
          </Button>
        </section>

        <section id="help" className="mt-12 scroll-mt-24">
          <h2 className="font-display text-3xl">Help</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Photos not appearing? Make sure you're signed in — closet images are stored privately per account. Camera
            not working in the photobooth? Allow camera access for this site in your browser settings.
          </p>
        </section>

        <section id="contact" className="mt-12 scroll-mt-24">
          <h2 className="font-display text-3xl">Contact</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ideas, wishes, or a bug to report? Write to{" "}
            <a href="mailto:hello@heavely.app" className="underline underline-offset-4">
              hello@heavely.app
            </a>
            .
          </p>
        </section>
      </div>
    </Shell>
  );
}
