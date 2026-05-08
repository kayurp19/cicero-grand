/** Reusable form primitives for the admin editor. */
import { useRef, useState } from "react";
import { Plus, Trash2, GripVertical, Upload, ChevronUp, ChevronDown, Image as ImageIcon } from "lucide-react";

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border last:border-b-0 pb-10 mb-10 last:pb-0 last:mb-0">
      <div className="mb-6">
        <h2 className="font-display text-2xl tracking-[-0.01em]">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">{description}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
        {label}
      </span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground mt-1.5">{hint}</span>}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  testId,
}: {
  value: string | number | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  testId?: string;
}) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      data-testid={testId}
      className="w-full h-11 rounded-lg border border-input bg-background px-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 4,
  placeholder,
  testId,
}: {
  value: string | undefined;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  testId?: string;
}) {
  return (
    <textarea
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      data-testid={testId}
      className="w-full rounded-lg border border-input bg-background px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-y"
    />
  );
}

export function NumberInput({
  value,
  onChange,
  testId,
}: {
  value: number | string | undefined;
  onChange: (v: number | string) => void;
  testId?: string;
}) {
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => {
        const v = e.target.value;
        if (v === "" || v === "—") return onChange(v);
        const n = Number(v);
        onChange(Number.isNaN(n) ? v : n);
      }}
      data-testid={testId}
      className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
    />
  );
}

/** A list of strings with add/remove/reorder. Used for bullet lists. */
export function StringList({
  values,
  onChange,
  placeholder = "Add item",
  testId = "string-list",
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  testId?: string;
}) {
  function update(i: number, v: string) {
    const next = values.slice();
    next[i] = v;
    onChange(next);
  }
  function remove(i: number) {
    onChange(values.filter((_, j) => j !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= values.length) return;
    const next = values.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  return (
    <div className="space-y-2" data-testid={testId}>
      {values.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            value={v}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            data-testid={`${testId}-input-${i}`}
          />
          <button
            type="button"
            onClick={() => move(i, -1)}
            className="w-8 h-8 grid place-items-center rounded-md hover:bg-muted disabled:opacity-30"
            disabled={i === 0}
            aria-label="Move up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => move(i, 1)}
            className="w-8 h-8 grid place-items-center rounded-md hover:bg-muted disabled:opacity-30"
            disabled={i === values.length - 1}
            aria-label="Move down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => remove(i)}
            className="w-8 h-8 grid place-items-center rounded-md hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remove"
            data-testid={`${testId}-remove-${i}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        data-testid={`${testId}-add`}
      >
        <Plus className="w-4 h-4" /> Add item
      </button>
    </div>
  );
}

/** Image picker — uploads to /api/admin/upload and stores the resulting URL.
 *  Also accepts pasted URLs (e.g. existing /photos/... paths). */
export function ImagePicker({
  value,
  onChange,
  testId,
}: {
  value: string | undefined;
  onChange: (url: string) => void;
  testId?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      onChange(data.url);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2" data-testid={testId}>
      <div className="flex items-center gap-3">
        <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted border border-border shrink-0 grid place-items-center">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/photos/your-image.jpg"
            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-3 h-9 rounded-full border border-border text-xs hover:bg-muted disabled:opacity-50"
              data-testid={`${testId}-upload`}
            >
              <Upload className="w-3.5 h-3.5" />
              {uploading ? "Uploading…" : "Upload new image"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Clear
              </button>
            )}
          </div>
          {error && <div className="text-xs text-destructive">{error}</div>}
        </div>
      </div>
    </div>
  );
}

/** Repeater for an array of objects. Children renders the editor for one item. */
export function Repeater<T>({
  items,
  onChange,
  newItem,
  itemLabel,
  renderItem,
  collapsedSummary,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  newItem: () => T;
  itemLabel: (it: T, i: number) => string;
  renderItem: (item: T, update: (next: T) => void, remove: () => void) => React.ReactNode;
  collapsedSummary?: (it: T) => string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function update(i: number, next: T) {
    const arr = items.slice();
    arr[i] = next;
    onChange(arr);
  }
  function remove(i: number) {
    if (!confirm("Remove this item?")) return;
    onChange(items.filter((_, j) => j !== i));
    setOpenIndex(null);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const arr = items.slice();
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
    setOpenIndex(j);
  }

  return (
    <div className="space-y-3">
      {items.map((it, i) => {
        const open = openIndex === i;
        return (
          <div
            key={i}
            className="border border-border rounded-xl overflow-hidden bg-background"
            data-testid={`repeater-item-${i}`}
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/40">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex-1 text-left flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted"
              >
                <span className="text-xs text-muted-foreground tabular-nums">{i + 1}</span>
                <span className="font-medium text-sm">{itemLabel(it, i)}</span>
                {collapsedSummary && !open && (
                  <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                    {collapsedSummary(it)}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="w-8 h-8 grid place-items-center rounded-md hover:bg-muted disabled:opacity-30"
                aria-label="Move up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="w-8 h-8 grid place-items-center rounded-md hover:bg-muted disabled:opacity-30"
                aria-label="Move down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="w-8 h-8 grid place-items-center rounded-md hover:bg-destructive/10 hover:text-destructive"
                aria-label="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {open && (
              <div className="p-5 space-y-4 border-t border-border bg-card">
                {renderItem(it, (next) => update(i, next), () => remove(i))}
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => {
          onChange([...items, newItem()]);
          setOpenIndex(items.length);
        }}
        className="inline-flex items-center gap-2 px-4 h-10 rounded-full border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground"
        data-testid="repeater-add"
      >
        <Plus className="w-4 h-4" /> Add another
      </button>
    </div>
  );
}
