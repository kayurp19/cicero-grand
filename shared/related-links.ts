export interface RelatedLink {
  href: string;
  label: string;
}

/** Accept both historic content shapes; never render empty, external or self links. */
export function relatedLinks(input: unknown, currentPath: string): RelatedLink[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>([currentPath.replace(/\/+$/, "") || "/"]);
  return input.flatMap((item: unknown): RelatedLink[] => {
    if (!item || typeof item !== "object") return [];
    const raw = item as Record<string, unknown>;
    const href = raw.href ?? raw.path;
    const label = raw.label ?? raw.title;
    if (typeof href !== "string" || typeof label !== "string") return [];
    const path = href.trim().replace(/\/+$/, "") || "/";
    if (!/^\/(?:[a-z0-9-]+\/?)*$/.test(path) || !label.trim() || seen.has(path)) return [];
    seen.add(path);
    return [{ href: path, label: label.trim() }];
  });
}
