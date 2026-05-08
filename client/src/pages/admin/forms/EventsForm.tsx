import { Section, Field, TextInput, TextArea, NumberInput, StringList, Repeater } from "./fields";

type Space = {
  name: string;
  size: string;
  classroom: number | string;
  theater: number | string;
  banquet: number | string;
  uShape: number | string;
  boardroom: number | string;
};

export function EventsForm({
  value,
  onChange,
}: {
  value: { intro: string; spaces: Space[]; features: string[] };
  onChange: (v: { intro: string; spaces: Space[]; features: string[] }) => void;
}) {
  return (
    <>
      <Section title="Intro">
        <Field label="Intro paragraph">
          <TextArea value={value.intro} onChange={(v) => onChange({ ...value, intro: v })} rows={3} />
        </Field>
      </Section>

      <Section title="Spaces" description="Meeting and event rooms with capacities.">
        <Repeater<Space>
          items={value.spaces || []}
          onChange={(next) => onChange({ ...value, spaces: next })}
          newItem={() => ({
            name: "New space",
            size: "",
            classroom: "—",
            theater: "—",
            banquet: "—",
            uShape: "—",
            boardroom: "—",
          })}
          itemLabel={(s) => s.name || "Untitled space"}
          collapsedSummary={(s) => s.size}
          renderItem={(space, update) => (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Name">
                  <TextInput value={space.name} onChange={(v) => update({ ...space, name: v })} />
                </Field>
                <Field label="Size" hint="e.g. '45ft × 64ft'">
                  <TextInput value={space.size} onChange={(v) => update({ ...space, size: v })} />
                </Field>
                <Field label="Classroom">
                  <NumberInput
                    value={space.classroom}
                    onChange={(v) => update({ ...space, classroom: v })}
                  />
                </Field>
                <Field label="Theater">
                  <NumberInput
                    value={space.theater}
                    onChange={(v) => update({ ...space, theater: v })}
                  />
                </Field>
                <Field label="Banquet">
                  <NumberInput
                    value={space.banquet}
                    onChange={(v) => update({ ...space, banquet: v })}
                  />
                </Field>
                <Field label="U-Shape">
                  <NumberInput
                    value={space.uShape}
                    onChange={(v) => update({ ...space, uShape: v })}
                  />
                </Field>
                <Field label="Boardroom">
                  <NumberInput
                    value={space.boardroom}
                    onChange={(v) => update({ ...space, boardroom: v })}
                  />
                </Field>
              </div>
            </>
          )}
        />
      </Section>

      <Section title="Features" description="Bullet points shown on the Events page.">
        <StringList
          values={value.features || []}
          onChange={(v) => onChange({ ...value, features: v })}
        />
      </Section>
    </>
  );
}
