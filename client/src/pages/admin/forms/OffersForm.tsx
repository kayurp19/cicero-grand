import { Section, Field, TextInput, TextArea, Repeater } from "./fields";

type Offer = {
  id: string;
  badge: string;
  title: string;
  description: string;
  cta: string;
  ctaHref: string;
};

function newOffer(): Offer {
  return {
    id: `offer-${Date.now()}`,
    badge: "Special",
    title: "New offer",
    description: "",
    cta: "Book now",
    ctaHref: "",
  };
}

export function OffersForm({
  value,
  onChange,
}: {
  value: Offer[];
  onChange: (v: Offer[]) => void;
}) {
  return (
    <Section title="Offers" description="Special rates and packages shown on the Offers page and homepage preview.">
      <Repeater<Offer>
        items={value}
        onChange={onChange}
        newItem={newOffer}
        itemLabel={(o) => o.title || "Untitled offer"}
        collapsedSummary={(o) => o.badge}
        renderItem={(offer, update) => (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Badge" hint="Small label above the title (e.g. 'Project rate').">
                <TextInput value={offer.badge} onChange={(v) => update({ ...offer, badge: v })} />
              </Field>
              <Field label="Title">
                <TextInput value={offer.title} onChange={(v) => update({ ...offer, title: v })} />
              </Field>
            </div>

            <Field label="Description">
              <TextArea
                value={offer.description}
                onChange={(v) => update({ ...offer, description: v })}
                rows={4}
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Button text">
                <TextInput value={offer.cta} onChange={(v) => update({ ...offer, cta: v })} />
              </Field>
              <Field label="Button link" hint="Use tel:+1... for click-to-call, or a URL for booking.">
                <TextInput value={offer.ctaHref} onChange={(v) => update({ ...offer, ctaHref: v })} />
              </Field>
            </div>

            <Field label="Internal ID">
              <TextInput value={offer.id} onChange={(v) => update({ ...offer, id: v })} />
            </Field>
          </>
        )}
      />
    </Section>
  );
}
