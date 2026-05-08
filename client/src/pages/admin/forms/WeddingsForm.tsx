import { Section, Field, TextInput, TextArea, NumberInput, StringList, Repeater } from "./fields";

type Testimonial = { quote: string; rating: number };

export function WeddingsForm({
  value,
  onChange,
}: {
  value: {
    intro: string;
    rating: string;
    ratingSource: string;
    ratingUrl: string;
    highlights: string[];
    testimonials: Testimonial[];
  };
  onChange: (v: any) => void;
}) {
  return (
    <>
      <Section title="Intro & rating">
        <Field label="Intro paragraph">
          <TextArea value={value.intro} onChange={(v) => onChange({ ...value, intro: v })} rows={3} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Rating" hint="e.g. '5.0 / 5.0'">
            <TextInput value={value.rating} onChange={(v) => onChange({ ...value, rating: v })} />
          </Field>
          <Field label="Rating source" hint="e.g. '31 reviews · WeddingWire'">
            <TextInput
              value={value.ratingSource}
              onChange={(v) => onChange({ ...value, ratingSource: v })}
            />
          </Field>
          <Field label="Rating URL">
            <TextInput value={value.ratingUrl} onChange={(v) => onChange({ ...value, ratingUrl: v })} />
          </Field>
        </div>
      </Section>

      <Section title="Highlights">
        <StringList
          values={value.highlights || []}
          onChange={(v) => onChange({ ...value, highlights: v })}
        />
      </Section>

      <Section title="Testimonials">
        <Repeater<Testimonial>
          items={value.testimonials || []}
          onChange={(next) => onChange({ ...value, testimonials: next })}
          newItem={() => ({ quote: "", rating: 5 })}
          itemLabel={(t, i) => `Testimonial ${i + 1}`}
          collapsedSummary={(t) => t.quote.slice(0, 60)}
          renderItem={(t, update) => (
            <>
              <Field label="Quote">
                <TextArea value={t.quote} onChange={(v) => update({ ...t, quote: v })} rows={4} />
              </Field>
              <Field label="Rating (1–5)">
                <NumberInput
                  value={t.rating}
                  onChange={(v) =>
                    update({ ...t, rating: typeof v === "number" ? v : parseInt(String(v)) || 5 })
                  }
                />
              </Field>
            </>
          )}
        />
      </Section>
    </>
  );
}
