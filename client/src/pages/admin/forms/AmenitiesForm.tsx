import { Section, Field, TextInput, TextArea, Repeater } from "./fields";

type Item = { name: string; description: string };
type Category = { title: string; items: Item[] };

export function AmenitiesForm({
  value,
  onChange,
}: {
  value: { categories: Category[] };
  onChange: (v: { categories: Category[] }) => void;
}) {
  const cats = value.categories || [];
  function setCats(next: Category[]) {
    onChange({ ...value, categories: next });
  }
  return (
    <Section
      title="Amenity categories"
      description="Group amenities by theme. Each category becomes a column on the Amenities page."
    >
      <Repeater<Category>
        items={cats}
        onChange={setCats}
        newItem={() => ({ title: "New category", items: [] })}
        itemLabel={(c) => c.title || "Untitled category"}
        collapsedSummary={(c) => `${c.items.length} item${c.items.length === 1 ? "" : "s"}`}
        renderItem={(cat, update) => (
          <>
            <Field label="Category title">
              <TextInput value={cat.title} onChange={(v) => update({ ...cat, title: v })} />
            </Field>

            <Field label="Items">
              <Repeater<Item>
                items={cat.items}
                onChange={(next) => update({ ...cat, items: next })}
                newItem={() => ({ name: "", description: "" })}
                itemLabel={(it) => it.name || "Untitled amenity"}
                collapsedSummary={(it) => it.description}
                renderItem={(item, set) => (
                  <>
                    <Field label="Name">
                      <TextInput value={item.name} onChange={(v) => set({ ...item, name: v })} />
                    </Field>
                    <Field label="Description">
                      <TextArea
                        value={item.description}
                        onChange={(v) => set({ ...item, description: v })}
                        rows={2}
                      />
                    </Field>
                  </>
                )}
              />
            </Field>
          </>
        )}
      />
    </Section>
  );
}
