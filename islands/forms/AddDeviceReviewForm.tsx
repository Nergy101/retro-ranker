import { PiPaperPlaneRight } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";
import { ProfileImage } from "../../components/auth/profile-image.tsx";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { User } from "../../data/frontend/contracts/user.contract.ts";

const RATING_FIELDS = [
  { name: "performance_rating", label: "Performance" },
  { name: "monitor_rating", label: "Monitor" },
  { name: "audio_rating", label: "Audio" },
  { name: "controls_rating", label: "Controls" },
  { name: "misc_rating", label: "Misc" },
  { name: "connectivity_rating", label: "Connectivity" },
  { name: "overall_rating", label: "Overall" },
];

export default function AddDeviceReviewForm({
  device,
  user,
}: {
  device: Device;
  user: User;
}) {
  const review = useSignal("");
  const ratings = useSignal({
    performance_rating: 5,
    monitor_rating: 5,
    audio_rating: 5,
    controls_rating: 5,
    misc_rating: 5,
    connectivity_rating: 5,
    overall_rating: 5,
  });

  function handleSliderChange(e: Event, field: string) {
    const value = parseInt((e.target as HTMLInputElement).value, 10);
    ratings.value = { ...ratings.value, [field]: value };
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        margin: "1em",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
        method="POST"
        action="/api/devices/reviews"
      >
        <input type="hidden" name="device" value={device.id} />
        <input type="hidden" name="user" value={user.id} />
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ProfileImage name={user.nickname} size={32} />
          <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
            {user.nickname}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <textarea
            placeholder="Write your review here..."
            name="content"
            value={review.value}
            onInput={(
              e,
            ) => (review.value = (e.target as HTMLTextAreaElement).value)}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "0.25rem",
              border: "1px solid var(--pico-muted-border-color)",
              minHeight: "100px",
              resize: "vertical",
            }}
          />
        </div>
        <div style={{ margin: "0.5em 0" }}>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
          {RATING_FIELDS.map((field) => (
            <div
              key={field.name}
              style={{ display: "flex", alignItems: "center", gap: "1em" }}
            >
              <label style={{ minWidth: "120px" }} htmlFor={field.name}>
                {field.label}:
              </label>
              <input
                type="range"
                id={field.name}
                name={field.name}
                min="0"
                max="10"
                step="1"
                value={ratings.value[field.name as keyof typeof ratings.value]}
                onInput={(e) => handleSliderChange(e, field.name)}
                style={{ flex: 1 }}
              />
              <span style={{ width: "2em", textAlign: "center" }}>
                {ratings.value[field.name as keyof typeof ratings.value]}
              </span>
            </div>
          ))}
        </div>
        <button
          type="submit"
          role="button"
          class="primary"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            color: "var(--pico-color)",
            width: "fit-content",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              cursor: "pointer",
            }}
          >
            <PiPaperPlaneRight /> Add review
          </span>
        </button>
      </form>
    </div>
  );
}
