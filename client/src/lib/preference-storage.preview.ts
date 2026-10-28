/** The private iframe uses memory only and never accesses browser persistence. */
const stores = { persistent: new Map<string, string>(), session: new Map<string, string>() };
export function getPreferenceStorage(kind: "persistent" | "session") {
  return {
    getItem: (key: string) => stores[kind].get(key) ?? null,
    setItem: (key: string, value: string) => { stores[kind].set(key, value); },
    removeItem: (key: string) => { stores[kind].delete(key); },
  };
}
