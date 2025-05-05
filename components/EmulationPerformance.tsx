import { PiQuestionFill, PiStarFill, PiVibrate } from "@preact-icons/pi";
import { Device } from "../data/frontend/contracts/device.model.ts";
import { User } from "../data/frontend/contracts/user.contract.ts";
import { Cooling } from "../data/frontend/models/cooling.model.ts";
import { DeviceService } from "../data/frontend/services/devices/device.service.ts";
import { ThumbsUp } from "../islands/buttons/ThumbsUp.tsx";
import RatingInfo from "../islands/RatingInfo.tsx";
import { FavoriteButton } from "../islands/buttons/FavoriteButton.tsx";

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

  const getCoolingColor = (cooling: Cooling) => {
    // count the number of true values
    const trueCount = [
      cooling.hasHeatsink,
      cooling.hasHeatPipe,
      cooling.hasFan,
      cooling.hasVentilationCutouts,
    ].filter(Boolean)
      .length;
    if (trueCount === 0) {
      return { color: "#FFE5E5", textColor: "#B71C1C", tooltip: "None" };
    }
    if (trueCount === 1) {
      return { color: "#FFF3E0", textColor: "#E65100", tooltip: "Moderate" };
    }
    if (trueCount === 2) {
      return { color: "#E3F2FD", textColor: "#1565C0", tooltip: "Good" };
    }
    if (trueCount >= 3) {
      return { color: "#E8F5E9", textColor: "#2E7D32", tooltip: "Excellent" };
    }
    return {
      color: "var(--pico-card-background-color)",
      textColor: "var(--pico-text)",
      tooltip: "Unknown",
    };
  };

  const getRumbleColor = (rumble: boolean | null) => {
    if (rumble === null) {
      return {
        color: "#FFF3E0",
        textColor: "#E65100",
        tooltip: "Unknown",
      };
    }
    if (rumble) {
      return { color: "#E8F5E9", textColor: "#2E7D32", tooltip: "Present" };
    }

    return { color: "#FFE5E5", textColor: "#B71C1C", tooltip: "Not present" };
  };

  const renderCoolingSection = () => {
    const coolingData = getCoolingColor(device.cooling);
    return (
      <div
        style={{
          backgroundColor: coolingData.color,
          padding: "0.25rem",
          borderRadius: "0.5em",
          textAlign: "center",
          fontSize: "0.75rem",
          color: coolingData.textColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        data-tooltip={coolingData.tooltip}
      >
        <strong>Cooling</strong>
        <span style={{ display: "flex", gap: "0.25rem", fontSize: "1rem" }}>
          {DeviceService.getCoolingIcons(device.cooling).map((
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
    const rumbleData = getRumbleColor(device.rumble);
    return (
      <div
        style={{
          backgroundColor: rumbleData.color,
          color: rumbleData.textColor,
          padding: "0.25rem",
          borderRadius: "0.5em",
          textAlign: "center",
          fontSize: "0.75rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        data-tooltip={rumbleData.tooltip}
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
