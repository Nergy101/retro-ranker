import { PiQuestionFill, PiVibrate } from "@preact-icons/pi";
import { Cooling } from "../data/models/cooling.model.ts";
import { Device } from "../data/models/device.model.ts";
import { DeviceService } from "../services/devices/device.service.ts";
import { RatingInfo } from "./ratings/RatingInfo.tsx";
interface EmulationPerformanceProps {
  device: Device;
}

export function EmulationPerformance({ device }: EmulationPerformanceProps) {
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
      return { color: "#AB0D0D", textColor: "white", tooltip: "None" };
    }
    if (trueCount === 1) {
      return { color: "#EEB61B", textColor: "black", tooltip: "Moderate" };
    }
    if (trueCount === 2) {
      return { color: "#3952A2", textColor: "white", tooltip: "Good" };
    }
    if (trueCount === 3) {
      return { color: "#16833E", textColor: "white", tooltip: "Excellent" };
    }
    return {
      color: "var(--pico-contrast)",
      textColor: "black",
      tooltip: "Unknown",
    };
  };

  const getRumbleColor = (rumble: boolean | null) => {
    if (rumble === null) {
      return {
        color: "#EEB61B",
        textColor: "black",
        tooltip: "Unknown",
      };
    }
    if (rumble) {
      return { color: "#16833E", textColor: "white", tooltip: "Present" };
    }

    return { color: "#AB0D0D", textColor: "white", tooltip: "Not present" };
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
          ) => (
            <span data-tooltip={tooltip} data-placement="bottom">{icon}</span>
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
      <h3 style={{ textAlign: "center" }}>Emulation Performance</h3>
      <div class="rating-info-grid">
        {ratings.map((rating) => (
          <RatingInfo key={rating.system} rating={rating} />
        ))}
      </div>

      <h3 style={{ textAlign: "center", paddingTop: "1rem" }}>Ergonomics</h3>
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

      {(device.reviews.videoReviews.length > 0) && (
        <>
          {device.reviews.videoReviews.length > 0 && (
            <div>
              <hr
                style={{ border: "1px solid var(--pico-muted-border-color)" }}
              />
              <strong>
                Video Reviews:
              </strong>
              <div class="video-reviews">
                {device.reviews.videoReviews.filter((review) =>
                  review.url.includes("youtu")
                ).map((review) => (
                  <div
                    key={review.url}
                    style={{ textDecoration: "none", listStyle: "none", width: "300px", height: "200px" }}
                  >
                    <iframe
                      width="300"
                      height="200"
                      src={DeviceService.getEmbedUrl(review.url)}
                      target="_blank"
                      alt={review.name}
                      defer
                    >
                      {review.name}
                    </iframe>
                  </div>
                ))}
                {device.reviews.videoReviews.filter((review) =>
                  !review.url.includes("youtu")
                ).map((review) => (
                  <div key={review.url}>
                    <a href={review.url} target="_blank">
                      {new URL(review.url).hostname} - {review.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {(device.reviews.writtenReviews.length > 0) && (
        <>
          <hr
            style={{ border: "1px solid var(--pico-muted-border-color)" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <strong>Written Reviews:</strong>
            {device.reviews.writtenReviews.length > 0
              ? (
                <div
                  style={{
                    display: "flex",
                    flexFlow: "row wrap",
                    gap: "1rem",
                  }}
                >
                  {device.reviews.writtenReviews.map((review) => (
                    <div key={review.url}>
                      <a
                        href={review.url}
                        target="_blank"
                        alt={review.name}
                      >
                        {review.name}
                      </a>
                    </div>
                  ))}
                </div>
              )
              : <span>No written reviews available.</span>}
          </div>
        </>
      )}

      {device.vendorLinks.length > 0 && (
        <>
          <hr
            style={{ border: "1px solid var(--pico-muted-border-color)" }}
          />
          <strong>
            Vendor Links:
          </strong>
          <div
            style={{
              display: "flex",
              flexFlow: "row wrap",
              gap: "1rem",
            }}
          >
            {device.vendorLinks.map((link) => (
              <a href={link.url} target="_blank">{link.name}</a>
            ))}
          </div>
        </>
      )}

      {device.hackingGuides.length > 0 && (
        <>
          <hr
            style={{ border: "1px solid var(--pico-muted-border-color)" }}
          />
          <strong>Hacking Guides:</strong>
          <div
            style={{
              display: "flex",
              flexFlow: "row wrap",
              gap: "1rem",
            }}
          >
            {device.hackingGuides.map((guide) => (
              <a href={guide.url} target="_blank">{guide.name}</a>
            ))}
          </div>
        </>
      )}
      <hr
        style={{ border: "1px solid var(--pico-muted-border-color)" }}
      />
    </div>
  );
}
