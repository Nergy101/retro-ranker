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

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com")) {
      const videoId = url.split("v=")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

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

  const getRumbleColor = (rumble: string | null) => {
    if (!rumble) {
      return {
        color: "#EEB61B",
        textColor: "black",
        tooltip: "Unknown",
      };
    }

    if (rumble === "✅") {
      return { color: "#16833E", textColor: "white", tooltip: "Present" };
    }
    if (rumble === "❌") {
      return { color: "#AB0D0D", textColor: "white", tooltip: "Not present" };
    }

    return {
      color: "#EEB61B",
      textColor: "black",
      tooltip: "Unknown",
    };
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
          {device.rumble === "✅" ? <PiVibrate /> : <PiQuestionFill />}
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
                {device.reviews.videoReviews.map((review) => (
                  <div
                    key={review.url}
                    style={{ textDecoration: "none", listStyle: "none" }}
                  >
                    <iframe
                      width="300"
                      height="200"
                      src={getEmbedUrl(review.url)}
                      target="_blank"
                      alt={review.name}
                    >
                      {review.name}
                    </iframe>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {(device.reviews.writtenReviews.length > 0 ||
        device.hackingGuides.length > 0) && (
        <>
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

      {
        /* <div class="overflow-auto">
        {device.cpu && device.gpu && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <strong>CPU:</strong>
                <div>
                  {device.cpu.names.length > 1 ? (
                    <span
                      data-tooltip={device.cpu.names.join(", ")}
                      data-placement="bottom"
                    >
                      {max20Characters(device.cpu.names[0])}
                    </span>
                  ) : (
                    device.cpu.names[0]
                  )}
                </div>
                <div>
                  {device.cpu.cores && device.cpu.cores > 0 && `(${device.cpu.cores} cores)`}
                  {device.cpu.clockSpeed && ` @ ${device.cpu.clockSpeed}`}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <strong>GPU:</strong>
                <div>
                  {device.gpu.name && device.gpu.name.length > 20 ? (
                    <span
                      data-tooltip={device.gpu.name}
                      data-placement="bottom"
                    >
                      {max20Characters(device.gpu.name)}
                    </span>
                  ) : (
                    device.gpu.name
                  )}
                </div>
                <div>
                  {device.gpu.cores && `(${device.gpu.cores})`}
                  {device.gpu.clockSpeed && ` @ ${device.gpu.clockSpeed}`}
                </div>
              </div>
            </div>
            <hr
              style={{ border: "1px solid var(--pico-muted-border-color)" }}
            />
          </>
        )}
        {device.ram && (
          <>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <strong>RAM:</strong> {device.ram}
              </div>
              <div style={{ flex: 1 }}>
                <strong>WiFi:</strong> {DeviceService.getPropertyIconByBool(
                  device.connectivity.hasWifi,
                )}
              </div>
            </div>
            <hr
              style={{ border: "1px solid var(--pico-muted-border-color)" }}
            />
          </>
        )}
        {device.screen.size && device.screen.aspectRatio && (
          <>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <strong>Screen Size:</strong> {device.screen.size}
              </div>
              <div style={{ flex: 1 }}>
                <strong>Screen Aspect Ratio:</strong> {device.screen.aspectRatio}
              </div>
            </div>
            <hr
              style={{ border: "1px solid var(--pico-muted-border-color)" }}
            />
          </>
        )}
        {device.battery && device.cooling && (
          <>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <strong>Battery:</strong> {device.battery}
              </div>
              <div style={{ flex: 1 }}>
                <strong>Cooling:</strong>
                <span style={{ display: "flex", gap: "0.25rem" }}>
                  {DeviceService.getCoolingIcons(device.cooling).map((
                    { icon, tooltip },
                  ) => <span data-tooltip={tooltip}>{icon}</span>)}
                </span>
              </div>
            </div>
            <hr
              style={{ border: "1px solid var(--pico-muted-border-color)" }}
            />
          </>
        )}
      </div> */
      }
    </div>
  );
}
