import { Section, Field, TextInput, TextArea, NumberInput, StringList, Repeater, ImagePicker } from "./fields";

type Room = {
  id: string;
  name: string;
  shortName: string;
  sleeps: number;
  beds: string;
  image: string;
  imageGallery: string[];
  tagline: string;
  features: string[];
};

function newRoom(): Room {
  return {
    id: `room-${Date.now()}`,
    name: "New Suite",
    shortName: "New",
    sleeps: 2,
    beds: "1 King",
    image: "",
    imageGallery: [],
    tagline: "",
    features: [],
  };
}

export function RoomsForm({
  value,
  onChange,
}: {
  value: Room[];
  onChange: (v: Room[]) => void;
}) {
  return (
    <Section
      title="Suites"
      description="Each suite shows on the Suites page and on the homepage room showcase. The first photo is the main image."
    >
      <Repeater<Room>
        items={value}
        onChange={onChange}
        newItem={newRoom}
        itemLabel={(r) => r.name || "Untitled suite"}
        collapsedSummary={(r) => r.beds}
        renderItem={(room, update) => (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Suite name">
                <TextInput value={room.name} onChange={(v) => update({ ...room, name: v })} />
              </Field>
              <Field label="Short name" hint="Used in compact spaces.">
                <TextInput value={room.shortName} onChange={(v) => update({ ...room, shortName: v })} />
              </Field>
              <Field label="Sleeps">
                <NumberInput
                  value={room.sleeps}
                  onChange={(v) => update({ ...room, sleeps: typeof v === "number" ? v : parseInt(String(v)) || 0 })}
                />
              </Field>
              <Field label="Beds" hint="e.g. '1 King + Sofa Sleeper'">
                <TextInput value={room.beds} onChange={(v) => update({ ...room, beds: v })} />
              </Field>
            </div>

            <Field label="Tagline" hint="One-sentence pitch shown beneath the suite name.">
              <TextArea value={room.tagline} onChange={(v) => update({ ...room, tagline: v })} rows={2} />
            </Field>

            <Field label="Main image">
              <ImagePicker
                value={room.image}
                onChange={(v) => update({ ...room, image: v })}
                testId={`image-${room.id}-main`}
              />
            </Field>

            <Field label="Photo gallery" hint="Additional photos shown for this suite.">
              <div className="space-y-3">
                {(room.imageGallery || []).map((img, i) => (
                  <ImagePicker
                    key={i}
                    value={img}
                    onChange={(v) => {
                      const arr = (room.imageGallery || []).slice();
                      arr[i] = v;
                      update({ ...room, imageGallery: arr });
                    }}
                  />
                ))}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      update({ ...room, imageGallery: [...(room.imageGallery || []), ""] })
                    }
                    className="text-sm text-primary hover:underline"
                  >
                    + Add photo
                  </button>
                  {(room.imageGallery?.length ?? 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirm("Remove the last photo?")) return;
                        update({ ...room, imageGallery: room.imageGallery.slice(0, -1) });
                      }}
                      className="text-sm text-muted-foreground hover:text-destructive"
                    >
                      Remove last
                    </button>
                  )}
                </div>
              </div>
            </Field>

            <Field label="Features">
              <StringList
                values={room.features || []}
                onChange={(v) => update({ ...room, features: v })}
                testId={`features-${room.id}`}
              />
            </Field>

            <Field label="Internal ID" hint="Don't change unless you know what you're doing.">
              <TextInput value={room.id} onChange={(v) => update({ ...room, id: v })} />
            </Field>
          </>
        )}
      />
    </Section>
  );
}
