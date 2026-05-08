import { Section, Field, TextInput, TextArea, Repeater } from "./fields";

type Item = { name: string; note?: string };
type Group = { title: string; items: Item[] };

export function AreaForm({
  value,
  onChange,
}: {
  value: { intro: string; groups: Group[] };
  onChange: (v: { intro: string; groups: Group[] }) => void;
}) {
  return (
    <>
      <Section title="Intro" description="Short paragraph shown at the top of the Area page.">
        <Field label="Intro paragraph">
          <TextArea
            value={value.intro}
            onChange={(v) => onChange({ ...value, intro: v })}
            rows={3}
          />
        </Field>
      </Section>

      <Section title="Groups of nearby places">
        <Repeater<Group>
          items={value.groups || []}
          onChange={(next) => onChange({ ...value, groups: next })}
          newItem={() => ({ title: "New group", items: [] })}
          itemLabel={(g) => g.title || "Untitled group"}
          collapsedSummary={(g) => `${g.items.length} place${g.items.length === 1 ? "" : "s"}`}
          renderItem={(group, update) => (
            <>
              <Field label="Group title">
                <TextInput value={group.title} onChange={(v) => update({ ...group, title: v })} />
              </Field>
              <Field label="Places">
                <Repeater<Item>
                  items={group.items}
                  onChange={(next) => update({ ...group, items: next })}
                  newItem={() => ({ name: "", note: "" })}
                  itemLabel={(it) => it.name || "Untitled"}
                  collapsedSummary={(it) => it.note || ""}
                  renderItem={(item, set) => (
                    <>
                      <Field label="Name">
                        <TextInput value={item.name} onChange={(v) => set({ ...item, name: v })} />
                      </Field>
                      <Field label="Note (optional)" hint="e.g. distance or description.">
                        <TextInput value={item.note} onChange={(v) => set({ ...item, note: v })} />
                      </Field>
                    </>
                  )}
                />
              </Field>
            </>
          )}
        />
      </Section>
    </>
  );
}
