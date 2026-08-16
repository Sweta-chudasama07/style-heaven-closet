import { Link, useRouterState } from "@tanstack/react-router";
import {
  Camera,
  Home,
  Instagram,
  Menu,
  Shirt,
  Sparkles,
  BookHeart,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useHeavely } from "@/lib/heavely/store";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/dashboard", label: "Studio" },
  { to: "/closet", label: "Closet" },
  { to: "/style-me", label: "Style Me" },
  { to: "/remix", label: "Remix" },
  { to: "/beauty", label: "Beauty" },
  { to: "/photobooth", label: "Booth" },
  { to: "/looks", label: "My Looks" },
];

const BOTTOM = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/closet", label: "Closet", icon: Shirt },
  { to: "/style-me", label: "Style", icon: Sparkles },
  { to: "/photobooth", label: "Booth", icon: Camera },
  { to: "/looks", label: "Looks", icon: BookHeart },
];

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-2xl tracking-[0.32em] heaven-gradient-text", className)}>
      HEAVELY
    </span>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { session, demo, exitDemo } = useHeavely();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen flex-col">
      {demo ? (
        <div className="bg-accent/70 px-4 py-1.5 text-center text-xs tracking-wide text-accent-foreground">
          You're exploring HEAVELY in demo mode — this wardrobe is fictional and lives only in this browser.
        </div>
      ) : null}

      <header className="sticky top-0 z-40 glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" aria-label="HEAVELY home">
            <Wordmark />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-blush/60",
                  pathname.startsWith(n.to) && "bg-blush text-foreground",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {session ? (
              <Button asChild variant="ghost" size="sm">
                <Link to="/profile">My Style</Link>
              </Button>
            ) : demo ? (
              <Button size="sm" variant="ghost" onClick={exitDemo}>
                Leave demo
              </Button>
            ) : (
              <Button asChild size="sm" variant="ghost">
                <Link to="/auth/login">Sign in</Link>
              </Button>
            )}
            <Button asChild size="sm">
              <Link to="/closet">Enter My Closet</Link>
            </Button>
          </div>

          <button
            className="rounded-full p-2 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open ? (
          <nav aria-label="Mobile" className="border-t border-border/60 px-4 pb-4 lg:hidden">
            <ul className="grid grid-cols-2 gap-1 pt-3">
              {[...NAV, { to: "/profile", label: "My Style" }, { to: "/settings", label: "Settings" }, { to: "/about", label: "About" }].map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm hover:bg-blush/60"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            {!session && !demo ? (
              <Button asChild className="mt-3 w-full" onClick={() => setOpen(false)}>
                <Link to="/auth/login">Sign in</Link>
              </Button>
            ) : null}
          </nav>
        ) : null}
      </header>

      <main className="flex-1 pb-24 lg:pb-0">{children}</main>

      <Footer />

      <nav
        aria-label="Quick"
        className="fixed inset-x-0 bottom-0 z-40 glass rounded-t-3xl px-2 py-2 lg:hidden"
      >
        <ul className="flex items-stretch justify-between">
          {BOTTOM.map((b) => {
            const Icon = b.icon;
            const active = pathname.startsWith(b.to);
            return (
              <li key={b.to} className="flex-1">
                <Link
                  to={b.to}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 text-[11px] transition-colors",
                    active ? "bg-blush text-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {b.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-card/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Wordmark />
          <p className="script mt-2 text-xl text-muted-foreground">Wear your own kind of heaven.</p>
        </div>
        <div>
          <h2 className="text-sm font-medium tracking-widest uppercase">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/about" hash="how" className="hover:text-foreground">How It Works</Link></li>
            <li><Link to="/closet" className="hover:text-foreground">Closet</Link></li>
            <li><Link to="/photobooth" className="hover:text-foreground">Photobooth</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-medium tracking-widest uppercase">Care</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/settings" className="hover:text-foreground">Privacy</Link></li>
            <li><Link to="/settings" className="hover:text-foreground">Terms</Link></li>
            <li><Link to="/about" hash="contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/about" hash="help" className="hover:text-foreground">Help</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-medium tracking-widest uppercase">Follow</h2>
          <div className="mt-3 flex gap-3">
            <a href="https://instagram.com" aria-label="HEAVELY on Instagram" className="rounded-full bg-blush p-2">
              <Instagram className="size-4" aria-hidden />
            </a>
            <a href="https://pinterest.com" aria-label="HEAVELY on Pinterest" className="rounded-full bg-powder p-2">
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.3 1 .5 1.9 1.6 1.9 1.9 0 3.2-2.4 3.2-5.3 0-2.2-1.5-3.8-4.1-3.8-3 0-4.9 2.2-4.9 4.7 0 .9.3 1.5.7 2 .2.2.2.3.1.6l-.2.8c-.1.3-.3.4-.5.3-1.4-.6-2-2.1-2-3.9 0-2.9 2.4-6.3 7.2-6.3 3.9 0 6.4 2.8 6.4 5.8 0 4-2.2 6.9-5.4 6.9-1.1 0-2.1-.6-2.5-1.3l-.7 2.7c-.2.8-.7 1.8-1.1 2.4A10 10 0 1 0 12 2z"/></svg>
            </a>
            <a href="https://tiktok.com" aria-label="HEAVELY on TikTok" className="rounded-full bg-lavender p-2">
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor"><path d="M16.5 3c.4 2 1.6 3.4 3.5 3.7v2.6c-1.3.1-2.5-.3-3.6-1v6.1c0 3.4-2.6 5.6-5.6 5.6A5.6 5.6 0 0 1 5.2 14c0-3.4 3.1-6 6.6-5.4v2.8c-.4-.1-.8-.2-1.2-.2-1.6 0-2.8 1.3-2.8 2.8s1.2 2.8 2.8 2.8c1.6 0 2.9-1.2 2.9-2.9V3h3z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <p className="pb-6 text-center text-xs text-muted-foreground">© 2026 HEAVELY. All rights reserved.</p>
    </footer>
  );
}
