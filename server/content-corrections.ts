/** Compatibility correction for the legacy CMS highlight, without replacing
 * unrelated owner-edited content or changing the persisted database schema. */
export function correctLegacyOccupancy(key: string, content: unknown): unknown {
  if (key !== "site" || !content || typeof content !== "object") return content;
  const site = content as Record<string, unknown>;
  if (!Array.isArray(site.highlights)) return content;
  return {
    ...site,
    ...(site.name === "The Cicero Grand" ? { name: "Cicero Grand - Syracuse North" } : {}),
    highlights: site.highlights.map((highlight) =>
      highlight === "All-suite hotel — every room sleeps four"
        ? "All-suite hotel — room occupancy varies by suite"
        : highlight,
    ),
  };
}
