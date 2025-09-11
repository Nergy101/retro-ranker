import { PiQuestionFill, PiVibrate } from "@preact-icons/pi";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { User } from "../../data/frontend/contracts/user.contract.ts";
import { Cooling } from "../../data/frontend/models/cooling.model.ts";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import { FavoriteButton } from "../../islands/buttons/favorite-button.tsx";
import { ThumbsUp } from "../../islands/buttons/thumbs-up.tsx";
import { RatingInfo } from "../../islands/devices/rating-info.tsx";
import { DeviceHelpers } from "../../data/frontend/helpers/device.helpers.ts";

interface EmulationPerformanceProps {
  device: Device;
  tooltipUseShortSystemName?: boolean;
  useRatingDescription?: boolean;
  user: User | null;
  likes: number | null;
  isLiked: boolean | null;
  userFavorited: boolean | null;
  hideLikeButton?: boolean;
}

export function EmulationPerformance(
  {
    device,
    tooltipUseShortSystemName = false,
    useRatingDescription = true,
    user,
    likes,
    isLiked,
    userFavorited,
    hideLikeButton = false,
  }: EmulationPerformanceProps,
) {
  const ratings = device.systemRatings;

  const getCoolingRatingMark = (cooling: Cooling) => {
    const trueCount = [
      cooling.hasHeatsink,
      cooling.hasHeatPipe,
      cooling.hasFan,
      cooling.hasVentilationCutouts,
    ].filter(Boolean).length;
    if (trueCount === 0) return "F";
    if (trueCount === 1) return "C";
    if (trueCount === 2) return "B";
    if (trueCount >= 3) return "A";
    return "F";
  };

  const getRumbleRatingMark = (rumble: boolean | null) => {
    if (rumble === null) return "C";
    if (rumble) return "A";
    return "F";
  };

  const renderCoolingSection = () => {
    const ratingMark = getCoolingRatingMark(device.cooling);
    const ratingClass = `rating-info rating-${ratingMark}`;
    return (
      <div
        class={ratingClass}
        style={{
          padding: "0.25rem",
          borderRadius: "0.5em",
          textAlign: "center",
          fontSize: "0.75rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        data-tooltip={ratingMark === "A"
          ? "Excellent"
          : ratingMark === "B"
          ? "Good"
          : ratingMark === "C"
          ? "Moderate"
          : "None"}
      >
        <strong>Cooling</strong>
        <span style={{ display: "flex", gap: "0.25rem", fontSize: "1rem" }}>
          {DeviceHelpers.getCoolingIcons(device.cooling).map((
            { icon, tooltip },
            index,
          ) => (
            <span data-tooltip={tooltip} key={index} data-placement="right">
              {icon}
            </span>
          ))}
        </span>
      </div>
    );
  };

  const renderRumbleSection = () => {
    const ratingMark = getRumbleRatingMark(device.rumble);
    const ratingClass = `rating-info rating-${ratingMark}`;
    return (
      <div
        class={ratingClass}
        style={{
          padding: "0.25rem",
          borderRadius: "0.5em",
          textAlign: "center",
          fontSize: "0.75rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        data-tooltip={ratingMark === "A"
          ? "Present"
          : ratingMark === "C"
          ? "Unknown"
          : "Not present"}
      >
        <strong>Rumble</strong>
        <span style={{ display: "flex", gap: "0.25rem", fontSize: "1rem" }}>
          {device.rumble ? <PiVibrate /> : <PiQuestionFill />}
        </span>
      </div>
    );
  };

  return (
    <div
      class="emulation-performance"
      style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
    >
      <h3 style={{ textAlign: "center", padding: 0, margin: 0 }}>
        Emulation Performance
      </h3>
      <div class="rating-info-grid">
        {ratings.map((rating) => (
          <RatingInfo
            key={rating.system}
            rating={rating}
            tooltipUseShortSystemName={tooltipUseShortSystemName}
            useRatingDescription={useRatingDescription}
          />
        ))}
      </div>

      <h3 style={{ textAlign: "center", padding: 0, margin: 0 }}>Ergonomics</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "0.5rem",
          justifyContent: "center",
        }}
      >
        {renderCoolingSection()}
        {renderRumbleSection()}
      </div>
      {!hideLikeButton && (
        <>
          <h3 style={{ textAlign: "center", padding: 0, margin: 0 }}>
            Stats
          </h3>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}
          >
            <FavoriteButton
              deviceId={device.id}
              isFavorited={userFavorited ?? false}
              isLoggedIn={!!user}
            />
            <ThumbsUp
              deviceId={device.id}
              initialLikes={likes ?? 0}
              isLiked={isLiked ?? false}
              isLoggedIn={!!user}
            />
          </div>
        </>
      )}
    </div>
  );
}
