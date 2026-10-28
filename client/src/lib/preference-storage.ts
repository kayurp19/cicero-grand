export type PreferenceStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** Production adapter. Access can throw when browser storage is restricted. */
export function getPreferenceStorage(kind: "persistent" | "session"): PreferenceStore | null {
  try {
    return kind === "persistent" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}
