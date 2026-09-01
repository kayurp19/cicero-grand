import { useEffect, useState } from "react";
import { X, Copy, Check, Mail } from "lucide-react";

const STORAGE_KEY = "cg_popup_state_v1";

type PopupState = "hidden" | "shown" | "dismissed" | "success";

// In-memory flag — resets on full page reload. Enough to prevent the popup
// re-firing across route changes within the same SPA session. Persistent
// storage APIs are blocked in the deploy preview iframe.
let memoryFlag: string | null = null;
function getSessionFlag(_key: string): string | null {
  return memoryFlag;
}
function setSessionFlag(_key: string, value: string) {
  memoryFlag = value;
}

export function EmailCapturePopup() {
  const [state, setState] = useState<PopupState>("hidden");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Boot: check server-backed device state, then arm triggers if allowed.
  useEffect(() => {
    const prior = getSessionFlag(STORAGE_KEY);
    if (prior === "dismissed" || prior === "success") return;

    let cancelled = false;
    let firedRef = false;
    let timer: number | undefined;
    const listeners: Array<() => void> = [];

    const fire = (reason: string) => {
      if (firedRef || cancelled) return;
      firedRef = true;
      setState("shown");
      try {
        (window as any).dataLayer?.push({ event: "email_popup_open", reason });
      } catch {
        /* ignore */
      }
    };

    const armTriggers = () => {
      // 1. Time trigger — 30 seconds
      timer = window.setTimeout(() => fire("time"), 30000);

      // 2. Scroll trigger — 60% depth
      const onScroll = () => {
        const doc = document.documentElement;
        const scrolled = (window.scrollY + window.innerHeight) / doc.scrollHeight;
        if (scrolled >= 0.6) fire("scroll");
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      listeners.push(() => window.removeEventListener("scroll", onScroll));

      // 3. Exit-intent — mouse leaves top of viewport
      const onMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) fire("exit_intent");
      };
      document.addEventListener("mouseleave", onMouseLeave);
      listeners.push(() => document.removeEventListener("mouseleave", onMouseLeave));
    };

    // Check device state first. If server says claimed/dismissed, don't arm.
    (async () => {
      try {
        const res = await fetch("/api/email-lead/status", { credentials: "same-origin" });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (data.state === "claimed" || data.state === "dismissed") {
            // Silenced on this device.
            setSessionFlag(STORAGE_KEY, data.state);
            return;
          }
        }
      } catch {
        // Network fail — arm anyway.
      }
      if (!cancelled) armTriggers();
    })();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      listeners.forEach((off) => off());
    };
  }, []);

  // Lock body scroll while open.
  useEffect(() => {
    if (state === "shown" || state === "success") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [state]);

  const close = () => {
    if (state === "success") {
      setSessionFlag(STORAGE_KEY, "success");
      // Server already set 'claimed' cookie on submit — nothing more to do.
    } else {
      setSessionFlag(STORAGE_KEY, "dismissed");
      // Tell server to remember dismissal on this device (30 days).
      try {
        fetch("/api/email-lead/dismiss", {
          method: "POST",
          credentials: "same-origin",
          keepalive: true,
        });
      } catch {
        /* ignore */
      }
    }
    setState("hidden");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/email-lead", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          sourcePage: window.location.pathname,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.message || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setPromoCode(data.promoCode);
      setAlreadyClaimed(!!data.alreadyClaimed);
      setState("success");
      // Track conversion.
      try {
        (window as any).dataLayer?.push({
          event: "email_popup_submit",
          already_claimed: !!data.alreadyClaimed,
        });
      } catch {
        /* ignore */
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = async () => {
    if (!promoCode) return;
    try {
      await navigator.clipboard.writeText(promoCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (state !== "shown" && state !== "success") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      data-testid="email-capture-popup"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          aria-label="Close"
          data-testid="button-popup-close"
        >
          <X className="h-5 w-5" />
        </button>

        {state === "shown" && (
          <>
            {/* Header band */}
            <div
              className="px-8 pb-6 pt-10 text-center"
              style={{
                background:
                  "linear-gradient(135deg, #f5f0e6 0%, #ebe1cd 100%)",
                borderBottom: "1px solid #d4cdb8",
              }}
            >
              <div
                className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em]"
                style={{ color: "#a36b3f" }}
              >
                The Cicero Grand
              </div>
              <h2
                id="popup-title"
                className="mb-2 font-serif text-3xl leading-tight text-neutral-900"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Save <span style={{ color: "#a36b3f" }}>$15</span> on your stay
              </h2>
              <p className="text-sm text-neutral-700">
                Join our list and get $15 off your next direct booking.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-4 px-8 py-6">
              <div>
                <label
                  htmlFor="popup-first-name"
                  className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-600"
                >
                  First name <span className="font-normal normal-case text-neutral-400">(optional)</span>
                </label>
                <input
                  id="popup-first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#a36b3f] focus:ring-2 focus:ring-[#a36b3f]/20"
                  placeholder="Jane"
                  data-testid="input-popup-first-name"
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label
                  htmlFor="popup-email"
                  className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-600"
                >
                  Email address
                </label>
                <input
                  id="popup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#a36b3f] focus:ring-2 focus:ring-[#a36b3f]/20"
                  placeholder="you@example.com"
                  data-testid="input-popup-email"
                  autoComplete="email"
                />
              </div>

              {errorMsg && (
                <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition disabled:opacity-60"
                style={{ backgroundColor: "#a36b3f" }}
                data-testid="button-popup-submit"
              >
                {submitting ? "Sending..." : "Get my $15 off code"}
              </button>

              <p className="text-center text-[11px] leading-relaxed text-neutral-500">
                Direct bookings only. One use per guest. Valid 60 days. Not valid on Expedia, Booking.com, or other OTAs.
              </p>
            </form>
          </>
        )}

        {state === "success" && promoCode && (
          <div className="px-8 py-10 text-center">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: "#f5f0e6" }}
            >
              <Mail className="h-7 w-7" style={{ color: "#a36b3f" }} />
            </div>
            <h3
              className="mb-2 font-serif text-2xl text-neutral-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {alreadyClaimed ? "You're already on the list" : "You're in."}
            </h3>
            <p className="mb-6 text-sm text-neutral-700">
              {alreadyClaimed
                ? "Here's your code again — check your inbox for the original email."
                : "Your $15 off code is below and on its way to your inbox."}
            </p>

            <div
              className="mx-auto mb-4 rounded-lg border-2 border-dashed px-4 py-5"
              style={{ borderColor: "#a36b3f", backgroundColor: "#f5f0e6" }}
            >
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
                Your code
              </div>
              <div
                className="mb-3 font-mono text-3xl font-bold tracking-[0.15em]"
                style={{ color: "#a36b3f" }}
                data-testid="text-popup-promo-code"
              >
                {promoCode}
              </div>
              <button
                onClick={copyCode}
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-[#a36b3f] hover:text-[#a36b3f]"
                data-testid="button-popup-copy-code"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy code
                  </>
                )}
              </button>
            </div>

            <div className="mb-6 space-y-1 text-left text-xs leading-relaxed text-neutral-600">
              <p>
                <strong className="text-neutral-800">How to use it:</strong>
              </p>
              <p>• Enter <span className="font-mono font-semibold">{promoCode}</span> at checkout on cicerogrand.com</p>
              <p>• Or mention it at check-in</p>
              <p>• Valid 60 days · Direct bookings only · One use per guest</p>
            </div>

            <a
              href="/"
              onClick={close}
              className="inline-block w-full rounded-md px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition"
              style={{ backgroundColor: "#a36b3f" }}
              data-testid="button-popup-book-now"
            >
              Book direct now
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
