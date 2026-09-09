import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — MOSAIC" },
      { name: "description", content: "Create a local MOSAIC profile. Accounts stay in this browser — there is no server." },
      { property: "og:title", content: "Sign in — MOSAIC" },
      { property: "og:description", content: "A browser-only profile for this demo." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const field = "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-foreground/50";

  return (
    <section className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <p className="rule-label">Browser-only account</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
        {mode === "up" ? "Create your profile" : "Welcome back"}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Nothing is sent anywhere. Your profile is stored in this browser so your tiles and saves stay
        with you.
      </p>

      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const res = mode === "up" ? signUp({ name, email, password }) : signIn({ email, password });
          if (res.error) return setError(res.error);
          setError("");
          toast(mode === "up" ? "Profile created" : "Signed in");
          void navigate({ to: "/profile" });
        }}
      >
        {mode === "up" && (
          <div>
            <label htmlFor="name" className="rule-label">Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={`mt-2 ${field}`} autoComplete="name" />
          </div>
        )}
        <div>
          <label htmlFor="email" className="rule-label">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-2 ${field}`} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="password" className="rule-label">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`mt-2 ${field}`} autoComplete={mode === "up" ? "new-password" : "current-password"} />
        </div>

        {error && <p role="alert" className="text-sm font-medium text-signal">{error}</p>}

        <button type="submit" className="w-full rounded-full bg-signal px-6 py-3 text-sm font-semibold text-signal-foreground">
          {mode === "up" ? "Create profile" : "Sign in"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => { setMode(mode === "up" ? "in" : "up"); setError(""); }}
        className="mt-6 text-sm font-medium underline underline-offset-4"
      >
        {mode === "up" ? "I already have a profile" : "Create a new profile instead"}
      </button>
    </section>
  );
}
