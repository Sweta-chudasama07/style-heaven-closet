import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Shell, Wordmark } from "@/components/heavely/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHeavely } from "@/lib/heavely/store";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Sign in — HEAVELY" },
      { name: "description", content: "Sign in to your HEAVELY closet and pick up your styling where you left off." },
      { property: "og:title", content: "Sign in — HEAVELY" },
      { property: "og:description", content: "Your closet is waiting for you." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { startDemo } = useHeavely();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back ♡");
    void navigate({ to: "/dashboard" });
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in didn't work. Try email instead ♡");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/dashboard" });
  }

  return (
    <Shell>
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="glass rounded-[2rem] p-8">
          <Wordmark className="block text-center text-3xl" />
          <h1 className="mt-4 text-center font-display text-2xl">Welcome back</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Your closet has been waiting patiently.
          </p>

          <form onSubmit={signIn} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Opening your closet..." : "Sign in"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="secondary" className="w-full" onClick={() => void google()}>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/auth/signup" className="text-foreground underline underline-offset-4">
              Create your closet
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Just browsing?{" "}
            <button
              className="underline underline-offset-4"
              onClick={() => {
                startDemo();
                void navigate({ to: "/dashboard" });
              }}
            >
              Try the demo closet
            </button>
          </p>
        </div>
      </div>
    </Shell>
  );
}
