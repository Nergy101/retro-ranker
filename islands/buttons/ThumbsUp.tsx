import { PiThumbsUp, PiThumbsUpFill } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";

interface ThumbsUpProps {
  deviceId: string;
  initialLikes: number;
  isLiked: boolean;
  isLoggedIn: boolean;
}

export function ThumbsUp(
  { deviceId, initialLikes, isLiked, isLoggedIn }: ThumbsUpProps,
) {
  const likes = useSignal(initialLikes);
  const liked = useSignal(isLiked);
  const isAnimating = useSignal(false);

  const handleLike = async () => {
    if (!isLoggedIn) {
      return;
    }

    try {
      const response = await fetch(`/api/devices/${deviceId}/like`, {
        method: liked.value ? "DELETE" : "POST",
      });

      if (response.ok) {
        isAnimating.value = true;
        liked.value = !liked.value;
        likes.value = liked.value ? likes.value + 1 : likes.value - 1;
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
      data-tooltip={isLoggedIn ? undefined : "Log in to like devices"}
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
          .thumbs-up-animation {
            animation: bounce 0.5s ease;
          }
        `}
      </style>
      <button
        type="button"
        onClick={handleLike}
        disabled={!isLoggedIn}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          color: "var(--pico-primary)",
          padding: "0.25rem 0.5rem",
          border: "1px solid var(--pico-primary)",
          borderRadius: "0.25rem",
          background: "transparent",
          opacity: isLoggedIn ? 1 : 0.5,
        }}
      >
        {liked.value
          ? (
            <PiThumbsUpFill
              color="var(--pico-primary)"
              class={isAnimating.value ? "thumbs-up-animation" : ""}
            />
          )
          : (
            <PiThumbsUp
              class={isAnimating.value ? "thumbs-up-animation" : ""}
            />
          )}
        <span>{likes.value}</span>
      </button>
    </div>
  );
}
