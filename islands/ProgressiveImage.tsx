interface ProgressiveImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  loading?: "lazy" | "eager";
}

export function ProgressiveImage({
  src,
  alt,
  placeholder = "/images/placeholder-100x100.svg",
  className = "",
  loading = "lazy",
}: ProgressiveImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = placeholder;
      }}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  );
}
