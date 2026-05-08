import { Section, Field, TextInput, TextArea, StringList } from "./fields";

export function SiteForm({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  function update<K extends string>(key: K, v: any) {
    onChange({ ...value, [key]: v });
  }
  function updateAddress(k: string, v: string) {
    const next = { ...(value.address || {}), [k]: v };
    next.full = `${next.street || ""}, ${next.city || ""}, ${next.state || ""} ${next.zip || ""}`
      .replace(/^,\s*|,\s*$/g, "")
      .trim();
    update("address", next);
  }
  function updateSocial(k: string, v: string) {
    update("social", { ...(value.social || {}), [k]: v });
  }

  return (
    <>
      <Section title="Identity" description="The hotel name, tagline, and short description shown across the site.">
        <Field label="Hotel name">
          <TextInput value={value.name} onChange={(v) => update("name", v)} testId="input-site-name" />
        </Field>
        <Field label="Tagline" hint="A short, punchy line. Currently 'Rested. Set. Go.'">
          <TextInput value={value.tagline} onChange={(v) => update("tagline", v)} testId="input-tagline" />
        </Field>
        <Field label="Short description" hint="Used in the hero and meta description.">
          <TextArea
            value={value.shortDescription}
            onChange={(v) => update("shortDescription", v)}
            rows={3}
            testId="input-short-description"
          />
        </Field>
      </Section>

      <Section title="Booking" description="The link guests use to reserve a room. Mission-critical — test it after editing.">
        <Field label="Booking URL" hint="Cloudbeds reservation page.">
          <TextInput
            value={value.bookingUrl}
            onChange={(v) => update("bookingUrl", v)}
            placeholder="https://us2.cloudbeds.com/reservation/..."
            testId="input-booking-url"
          />
        </Field>
      </Section>

      <Section title="Address & contact">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Street">
            <TextInput value={value.address?.street} onChange={(v) => updateAddress("street", v)} />
          </Field>
          <Field label="City">
            <TextInput value={value.address?.city} onChange={(v) => updateAddress("city", v)} />
          </Field>
          <Field label="State">
            <TextInput value={value.address?.state} onChange={(v) => updateAddress("state", v)} />
          </Field>
          <Field label="ZIP">
            <TextInput value={value.address?.zip} onChange={(v) => updateAddress("zip", v)} />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
          <Field label="Front desk phone (display)">
            <TextInput value={value.phone} onChange={(v) => update("phone", v)} />
          </Field>
          <Field label="Front desk phone (raw)" hint="With +1 country code, no spaces. Used for click-to-call.">
            <TextInput value={value.phoneRaw} onChange={(v) => update("phoneRaw", v)} />
          </Field>
          <Field label="Sales phone (display)">
            <TextInput value={value.salesPhone} onChange={(v) => update("salesPhone", v)} />
          </Field>
          <Field label="Sales phone (raw)">
            <TextInput value={value.salesPhoneRaw} onChange={(v) => update("salesPhoneRaw", v)} />
          </Field>
          <Field label="Email">
            <TextInput value={value.email} onChange={(v) => update("email", v)} />
          </Field>
          <Field label="Check-in time">
            <TextInput value={value.checkIn} onChange={(v) => update("checkIn", v)} />
          </Field>
          <Field label="Check-out time">
            <TextInput value={value.checkOut} onChange={(v) => update("checkOut", v)} />
          </Field>
        </div>
      </Section>

      <Section title="Social" description="Leave blank to hide a social link.">
        <Field label="Facebook URL">
          <TextInput value={value.social?.facebook} onChange={(v) => updateSocial("facebook", v)} />
        </Field>
        <Field label="Instagram URL">
          <TextInput value={value.social?.instagram} onChange={(v) => updateSocial("instagram", v)} />
        </Field>
        <Field label="Tripadvisor URL">
          <TextInput value={value.social?.tripadvisor} onChange={(v) => updateSocial("tripadvisor", v)} />
        </Field>
      </Section>

      <Section title="Highlights" description="Short selling points shown on the homepage and footer.">
        <StringList
          values={value.highlights || []}
          onChange={(v) => update("highlights", v)}
          placeholder="e.g. Free hot breakfast every morning"
          testId="list-highlights"
        />
      </Section>
    </>
  );
}
