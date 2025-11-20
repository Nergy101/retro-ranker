interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "muted";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  color = "primary",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const colorClasses = {
    primary: "border-primary",
    secondary: "border-secondary",
    muted: "border-muted",
  };

  return (
    <div
      class={`loading-spinner ${sizeClasses[size]} ${
        colorClasses[color]
      } ${className}`}
      aria-label="Loading"
      role="status"
    />
  );
}
