import { PiPaperPlaneRight } from "@preact-icons/pi";
import { useState } from "preact/hooks";
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

export function AddDeviceReviewForm({
  device,
  user,
}: {
  device: Device;
  user: User;
}) {
  const [review, setReview] = useState("");
  const [ratings, setRatings] = useState({
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
    setRatings({ ...ratings, [field]: value });
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
          <ProfileImage
            name={user.nickname}
            user={user}
            size={32}
          />
          <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
            {user.nickname}
          </span>
        </div>

        {/* Rating Fields */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {RATING_FIELDS.map((field) => (
            <div
              key={field.name}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <label
                htmlFor={field.name}
                style={{ fontSize: "0.9rem", fontWeight: "bold" }}
              >
                {field.label}: {ratings[field.name as keyof typeof ratings]}/5
              </label>
              <input
                type="range"
                id={field.name}
                name={field.name}
                min="1"
                max="5"
                value={ratings[field.name as keyof typeof ratings]}
                onInput={(e) => handleSliderChange(e, field.name)}
                style={{ width: "100%" }}
              />
            </div>
          ))}
        </div>

        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}
        >
          <textarea
            placeholder="Write your review here..."
            name="content"
            value={review}
            onInput={(e) => setReview((e.target as HTMLTextAreaElement).value)}
            style={{
              flex: 1,
              padding: "0.5rem",
              border: "1px solid var(--pico-border-color)",
              borderRadius: "0.25rem",
              resize: "vertical",
              minHeight: "100px",
            }}
            required
          />
          <button
            type="submit"
            style={{
              padding: "0.5rem",
              background: "var(--pico-primary)",
              color: "var(--pico-primary-inverse)",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              alignSelf: "flex-start",
            }}
            disabled={!review.trim()}
          >
            <PiPaperPlaneRight size={16} />
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
}
