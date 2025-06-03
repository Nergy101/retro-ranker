import { PiHeart, PiHeartFill } from "@preact-icons/pi";
import { useState } from "preact/hooks";

interface FavoriteButtonProps {
  deviceId: string;
  isFavorited: boolean;
  isLoggedIn: boolean;
}

export default function FavoriteButton(props: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(props.isFavorited);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFavorite = async () => {
    if (!props.isLoggedIn) {
      return;
    }

    try {
      const response = await fetch(`/api/devices/${props.deviceId}/favorite`, {
        method: favorited ? "DELETE" : "POST",
      });

      if (response.ok) {
        setIsAnimating(true);
        setFavorited(!favorited);
        setTimeout(() => {
          setIsAnimating(false);
        }, 500);
      }
    } catch {
      // do nothing
    }
  };

  return (
    <div
      data-tooltip={props.isLoggedIn
        ? "Favorite"
        : "Log in to favorite devices"}
      style={{
        textDecoration: "none",
        border: "none",
        background: "none",
        cursor: props.isLoggedIn ? "pointer" : "not-allowed",
      }}
    >
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          .favorite-animation {
            animation: bounce 0.5s ease;
          }
        `}
      </style>
      <button
        type="button"
        onClick={handleFavorite}
        disabled={!props.isLoggedIn}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.25rem",
          color: "var(--pico-primary)",
          padding: "0.25rem",
          border: "1px solid var(--pico-primary)",
          borderRadius: "0.25rem",
          background: "transparent",
          opacity: props.isLoggedIn ? 1 : 0.5,
          width: "2rem",
          height: "2rem",
        }}
      >
        {favorited
          ? (
            <PiHeartFill
              color="var(--pico-primary)"
              class={isAnimating ? "favorite-animation" : ""}
            />
          )
          : (
            <PiHeart
              class={isAnimating ? "favorite-animation" : ""}
            />
          )}
      </button>
    </div>
  );
}
