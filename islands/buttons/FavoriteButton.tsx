import { PiHeart, PiHeartFill } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";

interface FavoriteButtonProps {
  deviceId: string;
  isFavorited: boolean;
  isLoggedIn: boolean;
}

export function FavoriteButton(
  { deviceId, isFavorited, isLoggedIn }: FavoriteButtonProps,
) {
  const favorited = useSignal(isFavorited);
  const isAnimating = useSignal(false);

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      return;
    }

    try {
      const response = await fetch(`/api/devices/${deviceId}/favorite`, {
        method: favorited.value ? "DELETE" : "POST",
      });

      if (response.ok) {
        isAnimating.value = true;
        favorited.value = !favorited.value;
        setTimeout(() => {
          isAnimating.value = false;
        }, 500);
      }
    } catch {
      // do nothing
    }
  };

  return (
    <div
      data-tooltip={isLoggedIn ? "Favorite" : "Log in to favorite devices"}
      style={{
        textDecoration: "none",
        border: "none",
        background: "none",
        cursor: isLoggedIn ? "pointer" : "not-allowed",
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
        disabled={!isLoggedIn}
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
          opacity: isLoggedIn ? 1 : 0.5,
          width: "2rem",
          height: "2rem",
        }}
      >
        {favorited.value
          ? (
            <PiHeartFill
              color="var(--pico-primary)"
              class={isAnimating.value ? "favorite-animation" : ""}
            />
          )
          : (
            <PiHeart
              class={isAnimating.value ? "favorite-animation" : ""}
            />
          )}
      </button>
    </div>
  );
}
