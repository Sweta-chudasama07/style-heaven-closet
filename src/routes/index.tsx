import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Camera, Palette, Shirt, Sparkles, Wand2 } from "lucide-react";
import { Shell, Wordmark } from "@/components/heavely/Shell";
import { Button } from "@/components/ui/button";
import { useHeavely } from "@/lib/heavely/store";
import { DEMO_ITEMS } from "@/lib/heavely/demo";
import { ItemThumb } from "@/components/heavely/ItemTile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HEAVELY — Wear Your Own Kind of Heaven" },
      {
        name: "description",
        content:
          "HEAVELY is a dreamy digital wardrobe and personal styling studio. Digitize what you own, remix complete looks, and capture them in the HEAVELY booth.",
      },
      { property: "og:title", content: "HEAVELY — Wear Your Own Kind of Heaven" },
      {
        property: "og:description",
        content: "Your wardrobe already has more possibilities than you think.",
      },
    ],
  }),
  component: Home,
});

const FLOATERS = DEMO_ITEMS.filter((i) =>
  ["Pink cardigan", "Pearl earrings", "White pleated skirt", "Pink handbag", "Gold hoops", "Pink ballet flats"].includes(
    i.name,
  ),
);

function Home() {
  const { startDemo, session } = useHeavely();
  const navigate = useNavigate();

  function pick(id: string) {
    if (id === "closet") return void navigate({ to: "/closet" });
    if (id === "style") return void navigate({ to: "/style-me" });
    if (id === "remix") return void navigate({ to: "/remix" });
    if (id === "booth") return void navigate({ to: "/photobooth" });
    return void navigate({ to: "/looks" });
  }


  return (
    <Shell>
      <section className="relative overflow-hidden px-4 pt-14 pb-24 sm:pt-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[
            "left-[6%] top-[18%]",
            "right-[8%] top-[12%]",
            "left-[12%] bottom-[14%]",
            "right-[14%] bottom-[18%]",
            "left-[46%] top-[6%]",
          ].map((pos, i) => (
            <span key={pos} className={`twinkle absolute ${pos} text-xl text-primary/60`} style={{ animationDelay: `${i * 0.6}s` }}>
              ✦
            </span>
          ))}
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <p className="script text-2xl text-muted-foreground">a personal style studio</p>
          <Wordmark className="mt-2 block text-5xl sm:text-7xl" />
          <h1 className="mt-6 font-display text-3xl leading-tight sm:text-5xl">
            Wear your own kind of heaven.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Your wardrobe already has more possibilities than you think. HEAVELY turns what you own into
            complete, coordinated looks — outfit, jewellery, accessories, hair and makeup.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link to={session ? "/closet" : "/auth/signup"}>
                Enter My Closet <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                startDemo();
                void navigate({ to: "/dashboard" });
              }}
            >
              Try the demo closet
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            <Link to="/about" className="underline underline-offset-4">
              Explore HEAVELY
            </Link>{" "}
            — no account needed to look around.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <HeroScene3D
            className="h-[340px] w-full overflow-hidden rounded-[2rem] sm:h-[440px]"
            fallbackLabel="Blowing the glass…"
            onPick={pick}
          />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Drag to spin the studio — tap a glass piece to step inside.
          </p>
        </div>


        <ul className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {FLOATERS.map((item, i) => (
            <li
              key={item.id}
              className="float-slow"
              style={{ ["--tilt" as string]: `${(i % 2 ? 1 : -1) * 2.5}deg`, animationDelay: `${i * 0.4}s` }}
            >
              <div className="polaroid">
                <div className="aspect-[3/4] overflow-hidden rounded-sm">
                  <ItemThumb item={item} className="rounded-sm" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <p className="script text-center text-2xl text-primary">the philosophy</p>
        <h2 className="mt-2 text-center font-display text-3xl sm:text-4xl">
          Don't buy a new look. Discover a new look in what you already own.
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shirt, title: "Digitize your closet", text: "Upload clothes, jewellery, bags and shoes with colour, vibe and season." },
            { icon: Wand2, title: "Get styled", text: "A rule-based styling engine builds complete looks from your own pieces." },
            { icon: Palette, title: "Complete the look", text: "Matching jewellery, accessories, hairstyle and a makeup direction." },
            { icon: Camera, title: "Capture it", text: "Step into the HEAVELY booth and save it to your style diary." },
          ].map((f) => (
            <article key={f.title} className="glass rounded-3xl p-6">
              <f.icon className="size-5 text-primary" aria-hidden />
              <h3 className="mt-3 font-display text-xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="glass grid items-center gap-8 rounded-[2.5rem] p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">The remix studio</p>
            <h2 className="mt-3 font-display text-3xl">Lock one piece. Rewrite the rest.</h2>
            <p className="mt-3 text-muted-foreground">
              Love your pink top but nothing else? Lock it, hit remix, and HEAVELY reshuffles the bottom,
              shoes, bag, jewellery and accessories around it — over and over, until it feels like you.
            </p>
            <Button asChild className="mt-6">
              <Link to="/remix">
                <Sparkles className="size-4" aria-hidden /> Open the remix studio
              </Link>
            </Button>
          </div>
          <ul className="grid grid-cols-3 gap-3">
            {DEMO_ITEMS.slice(0, 6).map((item) => (
              <li key={item.id} className="aspect-square overflow-hidden rounded-2xl shadow-[var(--shadow-soft)]">
                <ItemThumb item={item} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Shell>
  );
}
