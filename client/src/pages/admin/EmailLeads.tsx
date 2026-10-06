import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, RefreshCw, Search, Tag } from "lucide-react";
import { Logo } from "@/components/Logo";
import { apiRequest } from "@/lib/queryClient";
import type { EmailLead } from "@shared/schema";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York",
});
const buttonClass = "inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 min-h-11 text-sm hover:bg-muted disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";

export default function AdminEmailLeads() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const leads = useQuery<EmailLead[], Error>({
    queryKey: ["/api/admin/email-leads"],
    queryFn: async () => (await apiRequest("GET", "/api/admin/email-leads")).json(),
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
  useEffect(() => {
    if (leads.error?.message.startsWith("401:")) setLocation("/admin");
  }, [leads.error, setLocation]);

  const rows = leads.isError ? [] : (leads.data ?? []);
  const term = search.trim().toLowerCase();
  const visible = rows.filter((row) =>
    [row.firstName, row.email, row.sourcePage, row.promoCode]
      .some((value) => value?.toLowerCase().includes(term)),
  );

  async function downloadCsv() {
    setExporting(true);
    setExportError("");
    try {
      const response = await apiRequest("GET", "/api/admin/email-leads.csv");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = `cicero-grand-promo-signups-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("401:")) {
        setLocation("/admin");
      } else {
        setExportError("Download failed. Please try again.");
      }
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background grain">
      <header className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 h-[72px] flex items-center justify-between">
          <Logo variant="dark" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Owner dashboard</span>
        </div>
      </header>
      <main className="max-w-[1400px] mx-auto px-5 lg:px-10 py-10 lg:py-14">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 min-h-11 text-sm text-muted-foreground hover:text-foreground" data-testid="link-dashboard">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-6 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-primary" />
              <h1 className="font-display text-xl" data-testid="text-promo-title">$15 Promo Signups</h1>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl">
              People who requested the website offer. Signups are not confirmed bookings or discount redemptions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button className={buttonClass} onClick={() => leads.refetch()} disabled={leads.isFetching} data-testid="button-refresh">
              <RefreshCw className={`w-4 h-4 ${leads.isFetching ? "animate-spin" : ""}`} />
              {leads.isFetching ? "Refreshing…" : "Refresh"}
            </button>
            <button className={`${buttonClass} bg-primary text-primary-foreground hover:bg-primary/90`} onClick={downloadCsv} disabled={exporting || leads.isPending || leads.isError} data-testid="button-export">
              <Download className="w-4 h-4" /> {exporting ? "Downloading…" : "Download CSV"}
            </button>
          </div>
        </div>
        <section className="rounded-2xl border border-border bg-card overflow-hidden" aria-label="Promo signup list">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div className="w-full sm:max-w-md">
              <label htmlFor="promo-search" className="block text-sm font-medium mb-2">Search signups</label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                <input id="promo-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)}
                  placeholder="Name, email, source page, or promo code"
                  className="w-full min-h-11 pl-10 pr-3 rounded-lg border border-input bg-background text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  data-testid="input-promo-search" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground" role="status" data-testid="text-result-count">
              {leads.isPending ? "Loading signups…" : leads.isError ? "Signups unavailable" : `${visible.length} of ${rows.length} loaded signups`}
            </p>
          </div>
          {leads.isPending ? (
            <p className="p-10 text-center text-sm text-muted-foreground" role="status">Loading your promo signups…</p>
          ) : leads.isError ? (
            <div className="p-10 text-center" role="alert" data-testid="status-error">
              <p>We couldn't load signups. Please refresh to try again.</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="p-10 text-center" data-testid="status-empty">
              <h2 className="font-medium">{rows.length ? "No matching signups" : "No promo signups yet"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{rows.length ? "Try a different name or email." : "New submissions from the $15 offer will appear here. Use Refresh after submitting."}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[800px]" data-testid="table-signups">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>{["Signed up (Eastern)", "Name", "Email", "Source page", "Promo code"].map((heading) =>
                    <th key={heading} scope="col" className="px-5 py-4 font-medium">{heading}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visible.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/30" data-testid={`row-signup-${row.id}`}>
                      <td className="px-5 py-4 whitespace-nowrap">{dateFormat.format(new Date(row.createdAt))}</td>
                      <td className="px-5 py-4">{row.firstName || "Not provided"}</td>
                      <td className="px-5 py-4 break-all">{row.email}</td>
                      <td className="px-5 py-4 max-w-xs break-all">{row.sourcePage || "Not recorded"}</td>
                      <td className="px-5 py-4"><span className="inline-block rounded-md bg-primary/10 text-primary px-2 py-1 font-medium">{row.promoCode}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        {exportError && <p className="mt-4 text-sm text-destructive" role="alert">{exportError}</p>}
        <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
          Newest first. This list and search cover the latest 500 signups. CSV downloads include up to 10,000 latest signups, regardless of your search.
          {leads.dataUpdatedAt > 0 && !leads.isError && ` Last refreshed ${dateFormat.format(new Date(leads.dataUpdatedAt))} Eastern.`}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">On a smaller screen, swipe the table sideways to see every column. Keep exported guest contact details private.</p>
      </main>
    </div>
  );
}
