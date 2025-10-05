interface SkeletonLoaderProps {
  type?: "text" | "card" | "avatar" | "button";
  lines?: number;
  className?: string;
  width?: string;
  height?: string;
}

export function SkeletonLoader({
  type = "text",
  lines = 1,
  className = "",
  width,
  height,
}: SkeletonLoaderProps) {
  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  if (type === "text") {
    return (
      <div class={`skeleton-text ${className}`} style={style}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            class={`skeleton ${
              i === lines - 1 ? "skeleton-text:last-child" : ""
            }`}
            style={{ width: i === lines - 1 ? "60%" : "100%" }}
          />
        ))}
      </div>
    );
  }

  if (type === "card") {
    return (
      <div class={`skeleton-card ${className}`} style={style}>
        <div
          class="skeleton skeleton-text"
          style={{ width: "80%", marginBottom: "var(--space-2)" }}
        />
        <div
          class="skeleton skeleton-text"
          style={{ width: "60%", marginBottom: "var(--space-2)" }}
        />
        <div class="skeleton skeleton-text" style={{ width: "40%" }} />
      </div>
    );
  }

  if (type === "avatar") {
    return (
      <div class={`skeleton skeleton-avatar ${className}`} style={style} />
    );
  }

  if (type === "button") {
    return (
      <div class={`skeleton skeleton-button ${className}`} style={style} />
    );
  }

  return <div class={`skeleton ${className}`} style={style} />;
}
