import { ThumbsUp } from "@islands/buttons/thumbs-up.tsx";
import { FavoriteButton } from "@islands/buttons/favorite-button.tsx";

interface DeviceCardActionsProps {
  deviceId: string;
  isLoggedIn: boolean;
  likes: number;
  isLiked: boolean;
  isFavorited: boolean;
}

export function DeviceCardActions(
  { deviceId, isLoggedIn, likes, isLiked, isFavorited }: DeviceCardActionsProps,
) {

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
      {isLoggedIn && (
        <FavoriteButton
          deviceId={deviceId}
          isFavorited={isFavorited}
          isLoggedIn={isLoggedIn}
        />
      )}
      <ThumbsUp
        deviceId={deviceId}
        initialLikes={likes}
        isLiked={isLiked}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
