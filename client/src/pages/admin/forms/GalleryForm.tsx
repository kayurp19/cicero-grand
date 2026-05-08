import { useRef, useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Upload } from "lucide-react";
import { Section } from "./fields";

export function GalleryForm({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function update(i: number, v: string) {
    const next = value.slice();
    next[i] = v;
    onChange(next);
  }
  function remove(i: number) {
    if (!confirm("Remove this photo from the gallery?")) return;
    onChange(value.filter((_, j) => j !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = value.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        uploaded.push(data.url);
      }
      onChange([...value, ...uploaded]);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Section
      title="Photo gallery"
      description="Photos shown on the Gallery page. Drag the arrows to reorder. The first few photos appear most prominently."
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            data-testid="button-gallery-upload"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading…" : "Upload photos"}
          </button>
          <span className="text-xs text-muted-foreground">
            {value.length} photo{value.length === 1 ? "" : "s"}
          </span>
        </div>
        {error && <div className="text-sm text-destructive">{error}</div>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {value.map((src, i) => (
            <div
              key={i}
              className="group relative bg-muted rounded-xl overflow-hidden border border-border"
              data-testid={`gallery-photo-${i}`}
            >
              <div className="aspect-[4/3]">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="w-7 h-7 grid place-items-center rounded-md bg-white/90 text-black hover:bg-white disabled:opacity-30"
                  aria-label="Move left"
                >
                  <ChevronUp className="w-3.5 h-3.5 -rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  className="w-7 h-7 grid place-items-center rounded-md bg-white/90 text-black hover:bg-white disabled:opacity-30"
                  aria-label="Move right"
                >
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="ml-auto w-7 h-7 grid place-items-center rounded-md bg-destructive text-destructive-foreground hover:opacity-90"
                  aria-label="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] tabular-nums">
                {i + 1}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-[4/3] rounded-xl border-2 border-dashed border-border grid place-items-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <span className="flex flex-col items-center gap-1.5 text-xs">
              <Plus className="w-5 h-5" /> Add photos
            </span>
          </button>
        </div>

        <details className="mt-6 text-sm">
          <summary className="cursor-pointer text-muted-foreground">Edit photo URLs as text</summary>
          <div className="mt-3 space-y-2">
            {value.map((src, i) => (
              <input
                key={i}
                value={src}
                onChange={(e) => update(i, e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-mono"
              />
            ))}
          </div>
        </details>
      </div>
    </Section>
  );
}
