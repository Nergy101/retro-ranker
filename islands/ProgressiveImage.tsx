import { useState } from "preact/hooks";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      class={`image-container ${className}`}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible",
      }}
    >
      {!isLoaded && (
        <img
          src={placeholder}
          alt=""
          class="image-blur"
          aria-hidden="true"
        />
      )}
      <img
        src={hasError ? placeholder : src}
        alt={alt}
        loading={loading}
        class={`${isLoaded ? "image-sharp" : "image-blur"} ${
          hasError ? "image-placeholder" : ""
        }`}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          transition: "filter var(--timing-slower) var(--ease-out)",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: "scale(1.2)",
        }}
      />
    </div>
  );
}
