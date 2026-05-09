import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  ExternalLink,
  Inbox,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { apiRequest } from "@/lib/queryClient";

type Submission = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  topic: string | null;
  message: string;
  createdAt: number;
};

function formatDate(ts: number) {
  try {
    const d = new Date(ts);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return String(ts);
  }
}

export default function AdminSubmissions() {
  const [, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Submission | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.authenticated) setLocation("/admin");
        else setChecking(false);
      })
      .catch(() => setLocation("/admin"));
  }, [setLocation]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/submissions", { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!checking) load();
  }, [checking]);

  async function logout() {
    try {
      await apiRequest("POST", "/api/admin/logout");
    } catch {}
    setLocation("/admin");
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this submission? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setItems((prev) => prev.filter((x) => x.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (e: any) {
      alert(`Delete failed: ${e?.message || "unknown error"}`);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grain">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 h-[72px] flex items-center justify-between">
          <Logo variant="dark" />
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100"
              data-testid="link-view-site"
            >
              View site <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-full border border-border text-sm hover:bg-muted transition-colors"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-5 lg:px-10 py-12 lg:py-16">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          data-testid="link-back-dashboard"
        >
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              <span className="w-8 h-px bg-current" /> Contact form
            </span>
            <h1 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] tracking-[-0.02em] leading-[0.95]">
              Form submissions
            </h1>
            <p className="mt-4 text-sm lg:text-base text-muted-foreground">
              Every inquiry sent through the website Contact form. Also emailed
              to <code className="text-foreground">sales@cicerogrand.com</code>.
            </p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-full border border-border text-sm hover:bg-muted transition-colors disabled:opacity-50"
            data-testid="button-refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && items.length === 0 && !error && (
          <div className="bg-card border border-card-border rounded-2xl p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto mb-5">
              <Inbox className="w-6 h-6" />
            </div>
            <h2 className="font-display text-2xl mb-2">No submissions yet</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              When a guest fills out the Contact form on cicerogrand.com,
              it will show up here and email a copy to your inbox.
            </p>
          </div>
        )}

        {items.length > 0 && (
          <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium">Received</th>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Email</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell">Phone</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Topic</th>
                    <th className="px-5 py-3 font-medium">Message</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((s) => (
                    <tr
                      key={s.id}
                      className="border-t border-border hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setSelected(s)}
                      data-testid={`row-submission-${s.id}`}
                    >
                      <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                        {formatDate(s.createdAt)}
                      </td>
                      <td className="px-5 py-4 font-medium">{s.name}</td>
                      <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">
                        <a
                          href={`mailto:${s.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-foreground hover:underline"
                        >
                          {s.email}
                        </a>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                        {s.phone ? (
                          <a
                            href={`tel:${s.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-foreground hover:underline"
                          >
                            {s.phone}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        {s.topic ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs">
                            {s.topic}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground max-w-[320px]">
                        <span className="block truncate">{s.message}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(s.id);
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          data-testid={`button-delete-${s.id}`}
                          aria-label="Delete submission"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-background border border-border rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background/95 backdrop-blur-xl border-b border-border px-7 py-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Submission #{selected.id}
                </p>
                <h2 className="font-display text-2xl tracking-[-0.01em]">{selected.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(selected.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-9 h-9 rounded-full grid place-items-center hover:bg-muted transition-colors"
                aria-label="Close"
                data-testid="button-close-detail"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1.5">
                    Email
                  </p>
                  <a
                    href={`mailto:${selected.email}`}
                    className="inline-flex items-center gap-2 text-sm hover:underline"
                  >
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {selected.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1.5">
                    Phone
                  </p>
                  {selected.phone ? (
                    <a
                      href={`tel:${selected.phone}`}
                      className="inline-flex items-center gap-2 text-sm hover:underline"
                    >
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {selected.phone}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1.5">
                    Topic
                  </p>
                  {selected.topic ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
                      {selected.topic}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  Message
                </p>
                <div className="bg-muted/40 border border-border rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
                <a
                  href={`mailto:${selected.email}?subject=Re: Cicero Grand inquiry&body=Hi ${encodeURIComponent(
                    selected.name.split(" ")[0] || selected.name
                  )},%0D%0A%0D%0A`}
                  className="inline-flex items-center gap-2 px-5 h-10 rounded-full bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
                  data-testid="button-reply-email"
                >
                  <Mail className="w-4 h-4" /> Reply by email
                </a>
                {selected.phone && (
                  <a
                    href={`tel:${selected.phone}`}
                    className="inline-flex items-center gap-2 px-5 h-10 rounded-full border border-border text-sm hover:bg-muted transition-colors"
                    data-testid="button-call"
                  >
                    <Phone className="w-4 h-4" /> Call
                  </a>
                )}
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="inline-flex items-center gap-2 px-5 h-10 rounded-full border border-border text-sm text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-colors ml-auto"
                  data-testid="button-delete-detail"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
