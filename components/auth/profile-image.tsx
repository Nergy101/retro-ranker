interface ProfileImageProps {
  name: string;
  size?: number;
  className?: string;
  backgroundType?: "solid" | "gradientLinear" | string;
}

export default function ProfileImage({
  name,
  size = 40,
  className = "",
  backgroundType = "solid,gradientLinear",
}: ProfileImageProps) {
  const safeName = encodeURIComponent(name);

  // Construct the DiceBear API URL
  const imageUrl =
    `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${safeName}&backgroundType=${backgroundType}`;

  return (
    <div
      class={`overflow-hidden rounded-full ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <img
        src={imageUrl}
        alt={`${name}'s profile`}
        width={size}
        height={size}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          border: "2px solid var(--pico-primary-border)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
}
