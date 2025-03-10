import { JSX } from "preact";

interface ProfileImageProps {
  name: string;
  size?: number;
  className?: string;
  backgroundType?: "solid" | "gradientLinear" | string;
}

export function ProfileImage({
  name,
  size = 40,
  className = "",
  backgroundType = "solid,gradientLinear",
}: ProfileImageProps): JSX.Element {
  const safeName = encodeURIComponent(name);

  // Construct the DiceBear API URL
  const imageUrl =
    `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${safeName}&backgroundType=${backgroundType}`;

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
      />
    </div>
  );
}
