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
];

const OVERALL_RATING_FIELD = { name: "overall_rating", label: "Overall" };

export function AddDeviceReviewForm({
  device,
  user,
}: {
  device: Device;
  user: User;
}) {
  const [review, setReview] = useState("");
  const [ratings, setRatings] = useState({
    performance_rating: 5.0,
    monitor_rating: 5.0,
    audio_rating: 5.0,
    controls_rating: 5.0,
    misc_rating: 5.0,
    connectivity_rating: 5.0,
    overall_rating: 5.0,
  });

  function calculateOverallRating(ratings: any) {
    const factorRatings = RATING_FIELDS.map((field) =>
      ratings[field.name as keyof typeof ratings]
    );
    const sum = factorRatings.reduce((acc, rating) => acc + rating, 0);
    const average = sum / factorRatings.length;
    // Round to nearest 0.5
    return Math.round(average * 2) / 2;
  }

  function handleSliderChange(e: Event, field: string) {
    const value = parseFloat((e.target as HTMLInputElement).value);
    const newRatings = { ...ratings, [field]: value };
    const overallRating = calculateOverallRating(newRatings);
    setRatings({ ...newRatings, overall_rating: overallRating });
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
                step="0.5"
                value={ratings[field.name as keyof typeof ratings]}
                onInput={(e) => handleSliderChange(e, field.name)}
                style={{ width: "100%" }}
              />
            </div>
          ))}
        </div>

        {/* Overall Rating (Read-only) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "var(--pico-muted-background)",
            borderRadius: "0.25rem",
            border: "1px solid var(--pico-border-color)",
          }}
        >
          <label
            htmlFor={OVERALL_RATING_FIELD.name}
            style={{ fontSize: "0.9rem", fontWeight: "bold" }}
          >
            {OVERALL_RATING_FIELD.label}:{" "}
            {ratings.overall_rating}/5 (Auto-calculated)
          </label>
          <input
            type="range"
            id={OVERALL_RATING_FIELD.name}
            name={OVERALL_RATING_FIELD.name}
            min="1"
            max="5"
            step="0.5"
            value={ratings.overall_rating}
            disabled
            style={{
              width: "100%",
              opacity: 0.7,
              cursor: "not-allowed",
            }}
          />
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <textarea
            placeholder="Write your review here..."
            name="content"
            value={review}
            onInput={(e) => setReview((e.target as HTMLTextAreaElement).value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid var(--pico-border-color)",
              borderRadius: "0.25rem",
              resize: "vertical",
              minHeight: "100px",
            }}
            required
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
                whiteSpace: "nowrap",
                width: "fit-content",
              }}
              disabled={!review.trim()}
            >
              <PiPaperPlaneRight size={16} />
              Submit Review
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
