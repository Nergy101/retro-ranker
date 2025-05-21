import { ProfileImage } from "../auth/profile-image.tsx";

interface DeviceReviewCardProps {
  review: {
    user: { id: string; nickname: string };
    content: string;
    performance_rating: number;
    monitor_rating: number;
    audio_rating: number;
    controls_rating: number;
    misc_rating: number;
    connectivity_rating: number;
    overall_rating: number;
    created?: string;
  };
}

const RATING_FIELDS = [
  { name: "performance_rating", label: "Performance" },
  { name: "monitor_rating", label: "Monitor" },
  { name: "audio_rating", label: "Audio" },
  { name: "controls_rating", label: "Controls" },
  { name: "misc_rating", label: "Misc" },
  { name: "connectivity_rating", label: "Connectivity" },
  { name: "overall_rating", label: "Overall" },
];

export function DeviceReviewCard({ review }: DeviceReviewCardProps) {
  return (
    <div
      style={{
        border: "1px solid var(--pico-primary)",
        borderRadius: "0.5rem",
        padding: "1rem",
        margin: "1rem 0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <ProfileImage name={review.user.nickname} size={32} />
        <span style={{ fontWeight: "bold" }}>{review.user.nickname}</span>
        {review.created && (
          <span style={{ fontSize: "0.9em", marginLeft: "0.5em" }}>
            {new Date(review.created).toLocaleString()}
          </span>
        )}
      </div>
      <div
        style={{
          borderRadius: "0.25rem",
          padding: "0.5rem",
          color: "var(--pico-color)",
        }}
      >
        {review.content}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
        {RATING_FIELDS.map((field) => (
          <div
            key={field.name}
            style={{ display: "flex", alignItems: "center", gap: "1em" }}
          >
            <label style={{ minWidth: "120px" }}>{field.label}:</label>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={review[field.name as keyof typeof review] as number}
              readOnly
              disabled
              style={{ flex: 1 }}
            />
            <span style={{ width: "2em", textAlign: "center" }}>
              {review[field.name as keyof typeof review]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeviceReviewCard; 