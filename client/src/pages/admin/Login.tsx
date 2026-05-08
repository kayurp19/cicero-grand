import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Logo } from "@/components/Logo";
import { Lock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, jump to dashboard.
  useEffect(() => {
    fetch("/api/admin/me", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) setLocation("/admin/dashboard");
      })
      .catch(() => {});
  }, [setLocation]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await apiRequest("POST", "/api/admin/login", { password });
      setLocation("/admin/dashboard");
    } catch (err) {
      setError("Wrong password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background grain flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 h-[72px] flex items-center">
          <Logo />
        </div>
      </header>

      <main className="flex-1 grid place-items-center px-5 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-grid place-items-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-5">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-display text-4xl tracking-[-0.02em]">
              Owner <em className="italic font-light">access</em>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Sign in to edit website content and images.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" data-testid="admin-login-form">
            <div>
              <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                data-testid="input-admin-password"
                className="w-full h-12 rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {error && (
              <div
                className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3"
                data-testid="admin-login-error"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              data-testid="button-admin-login"
              className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-10 text-center text-xs text-muted-foreground">
            Forgot the password? Update <code className="px-1 py-0.5 rounded bg-muted">ADMIN_PASSWORD</code> in
            your Railway environment variables.
          </p>
        </div>
      </main>
    </div>
  );
}
