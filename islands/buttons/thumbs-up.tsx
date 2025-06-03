import { PiThumbsUp, PiThumbsUpFill } from "@preact-icons/pi";
import { useState } from "preact/hooks";

interface ThumbsUpProps {
  deviceId: string;
  initialLikes: number;
  isLiked: boolean;
  isLoggedIn: boolean;
}

export default function ThumbsUp(props: ThumbsUpProps) {
  const { deviceId, initialLikes, isLiked, isLoggedIn } = props;
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(isLiked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    if (!isLoggedIn) {
      return;
    }

    try {
      const response = await fetch(`/api/devices/${deviceId}/like`, {
        method: liked ? "DELETE" : "POST",
      });

      if (response.ok) {
        setIsAnimating(true);
        setLiked(!liked);
        setLikes(liked ? likes + 1 : likes - 1);
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
      data-tooltip={isLoggedIn ? "Like" : "Log in to like devices"}
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
          justifyContent: "center",
          gap: "0.25rem",
          color: "var(--pico-primary)",
          padding: "0.25rem",
          border: "1px solid var(--pico-primary)",
          borderRadius: "0.25rem",
          background: "transparent",
          opacity: isLoggedIn ? 1 : 0.5,
          width: "3rem",
          height: "2rem",
        }}
      >
        {liked
          ? (
            <PiThumbsUpFill
              color="var(--pico-primary)"
              class={isAnimating ? "thumbs-up-animation" : ""}
            />
          )
          : (
            <PiThumbsUp
              class={isAnimating ? "thumbs-up-animation" : ""}
            />
          )}
        <span>{likes}</span>
      </button>
    </div>
  );
}
