/** Content loader — reads from API (live, admin-editable) and falls back
 *  to bundled JSON seed if the API is unavailable or has no override. This
 *  way the site always renders, even before the backend is wired up. */
import { useEffect, useState } from "react";

import siteSeed from "../content/site.json";
import roomsSeed from "../content/rooms.json";
import amenitiesSeed from "../content/amenities.json";
import areaSeed from "../content/area.json";
import offersSeed from "../content/offers.json";
import eventsSeed from "../content/events.json";
import weddingsSeed from "../content/weddings.json";
import gallerySeed from "../content/gallery.json";

export const seeds: Record<string, unknown> = {
  site: siteSeed,
  rooms: roomsSeed,
  amenities: amenitiesSeed,
  area: areaSeed,
  offers: offersSeed,
  events: eventsSeed,
  weddings: weddingsSeed,
  gallery: gallerySeed,
};

const cache = new Map<string, unknown>();

export async function fetchContent(key: string, bust = false): Promise<unknown> {
  if (!bust && cache.has(key)) return cache.get(key);
  try {
    const res = await fetch(`/api/content/${key}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      cache.set(key, data);
      return data;
    }
  } catch {
    /* network error — fall through to seed */
  }
  cache.set(key, seeds[key]);
  return seeds[key];
}

export function clearContentCache(key?: string) {
  if (key) cache.delete(key);
  else cache.clear();
}

export function useContent<T>(key: string): T {
  const [data, setData] = useState<T>(seeds[key] as T);
  useEffect(() => {
    let cancelled = false;
    fetchContent(key).then((d) => {
      if (!cancelled) setData(d as T);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);
  return data;
}

// Static export for header/footer that need site data immediately.
export const site = siteSeed;
