import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Shell } from "@/components/heavely/Shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useHeavely } from "@/lib/heavely/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Privacy — HEAVELY" },
      { name: "description", content: "Manage your HEAVELY account, understand how your closet photos are stored, and sign out." },
      { property: "og:title", content: "Settings & Privacy — HEAVELY" },
      { property: "og:description", content: "Your closet, your data, your choices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Settings,
});

function Settings() {
  const navigate = useNavigate();
  const { session, demo, exitDemo } = useHeavely();

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-4xl">Settings</h1>
        <p className="script text-xl text-muted-foreground">Quiet, private, yours.</p>

        <section className="glass mt-6 rounded-3xl p-6">
          <h2 className="font-display text-2xl">Privacy</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your closet photos live in a private storage space that only your account can open. Nobody else — not
            other members, not the public web — can view them. Demo mode never leaves your browser.
          </p>
        </section>

        <section className="glass mt-4 rounded-3xl p-6">
          <h2 className="font-display text-2xl">Terms</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            HEAVELY is a personal styling studio. Suggestions are generated from the pieces you add yourself, and are
            offered as inspiration rather than advice. Please upload only photos you have the right to use.
          </p>
        </section>

        <section className="glass mt-4 rounded-3xl p-6">
          <h2 className="font-display text-2xl">Account</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {session ? (
              <Button
                variant="secondary"
                onClick={() => {
                  void supabase.auth.signOut().then(() => {
                    toast.success("Signed out — see you soon ♡");
                    void navigate({ to: "/" });
                  });
                }}
              >
                Sign out
              </Button>
            ) : demo ? (
              <Button
                variant="secondary"
                onClick={() => {
                  exitDemo();
                  void navigate({ to: "/" });
                }}
              >
                Leave demo mode
              </Button>
            ) : (
              <Button onClick={() => void navigate({ to: "/auth/login" })}>Sign in</Button>
            )}
          </div>
        </section>
      </div>
    </Shell>
  );
}
