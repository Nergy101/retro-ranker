import { ProfileImage } from "../auth/profile-image.tsx";

interface DeviceReviewCardProps {
  review: {
    expand: {
      user: { id: string; nickname: string };
    };
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
  // Calculate average score
  const ratingValues = RATING_FIELDS.map((field) =>
    review[field.name as keyof typeof review] as number
  );
  const average = ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{
          color: i < rating ? "var(--pico-primary)" : "var(--pico-muted-color)",
        }}
      >
        ★
      </span>
    ));
  };

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
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "0.5rem",
        }}
      >
        <ProfileImage
          user={review.expand?.user}
          size={40}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.25rem",
            }}
          >
            <strong style={{ color: "var(--pico-primary)" }}>
              {review.expand?.user?.nickname || "Anonymous"}
            </strong>
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--pico-muted-color)",
              }}
            >
              {review.created ? formatDate(review.created) : ""}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.9rem" }}>Overall:</span>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              {renderStars(review.overall_rating)}
              <span
                style={{ fontSize: "0.8rem", color: "var(--pico-muted-color)" }}
              >
                ({review.overall_rating}/5)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {review.content && (
        <div
          style={{
            lineHeight: "1.6",
            color: "var(--pico-color)",
            marginBottom: "0.5rem",
          }}
        >
          {review.content}
        </div>
      )}

      {/* Rating Breakdown */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "0.5rem",
          marginTop: "0.5rem",
        }}
      >
        {RATING_FIELDS.map((field) => {
          const rating = review[field.name as keyof typeof review] as number;
          return (
            <div
              key={field.name}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                {field.label}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                {renderStars(rating)}
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--pico-muted-color)",
                  }}
                >
                  {rating}/5
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
