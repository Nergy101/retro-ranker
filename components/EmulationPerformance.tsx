import { PiVibrate } from "@preact-icons/pi";
import { Device } from "../data/models/device.model.ts";
import { DeviceService } from "../services/devices/device.service.ts";
import { RatingInfo } from "./RatingInfo.tsx";

interface EmulationPerformanceProps {
  device: Device;
}

export function EmulationPerformance({ device }: EmulationPerformanceProps) {
  const ratings = device.consoleRatings;

  const max20Characters = (text: string | null) => {
    if (text && text.length > 20) {
      return text.substring(0, 20) + "...";
    }
    return text;
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com")) {
      const videoId = url.split("v=")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  const getCoolingColor = (
    { hasHeatsink, hasHeatPipe, hasFan, hasVentilationCutouts },
  ) => {
    // count the number of true values
    const trueCount =
      [hasHeatsink, hasHeatPipe, hasFan, hasVentilationCutouts].filter(Boolean)
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

  const getRumbleColor = (rumble: string) => {
    console.log(rumble);
    if (rumble === "✅") {
      return { color: "#16833E", textColor: "white", tooltip: "Present" };
    }
    if (rumble === "❌") {
      return { color: "#AB0D0D", textColor: "white", tooltip: "Not present" };
    }
    return {
      color: "var(--pico-contrast)",
      textColor: "black",
      tooltip: "Unknown",
    };
  };

  return (
    <div
      class="emulation-performance"
      style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
    >
      <h3 style={{ textAlign: "center" }}>Emulation Performance</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "0.5rem",
          justifyContent: "center",
        }}
      >
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
        <div
          style={{
            backgroundColor: getCoolingColor(device.cooling).color,
            padding: "0.25rem",
            borderRadius: "0.5em",
            textAlign: "center",
            fontSize: "0.75rem",
            color: getCoolingColor(device.cooling).textColor,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          data-tooltip={getCoolingColor(device.cooling).tooltip}
        >
          <strong>Cooling</strong>
          <span style={{ display: "flex", gap: "0.25rem", fontSize: "1rem" }}>
            {DeviceService.getCoolingIcons(device.cooling).map((
              { icon, tooltip },
            ) => <span data-tooltip={tooltip} data-placement="bottom">{icon}</span>)}
          </span>
        </div>

        <div
          style={{
            backgroundColor: getRumbleColor(device.rumble).color,
            padding: "0.25rem",
            borderRadius: "0.5em",
            textAlign: "center",
            fontSize: "0.75rem",
            color: getRumbleColor(device.rumble).textColor,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          data-tooltip={getRumbleColor(device.rumble).tooltip}
        >
          <strong>Rumble</strong>
          <span style={{ display: "flex", gap: "0.25rem", fontSize: "1rem" }}>
            <PiVibrate />
          </span>
        </div>
      </div>



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
                <ul>
                  {device.reviews.writtenReviews.map((review) => (
                    <li key={review.url}>
                      <a
                        href={review.url}
                        target="_blank"
                        alt={review.name}
                      >
                        {review.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )
              : <span>No written reviews available.</span>}
          </div>
          <hr
            style={{ border: "1px solid var(--pico-muted-border-color)" }}
          />
        </>
      )}

      {(device.reviews.videoReviews.length > 0 ||
        device.vendorLinks.length > 0) && (
        <>
          <div>
            <strong>Video Reviews:</strong>
            {device.reviews.videoReviews.length > 0
              ? (
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
              )
              : <span>No video reviews available.</span>}
          </div>
          <hr
            style={{ border: "1px solid var(--pico-muted-border-color)" }}
          />
        </>
      )}

      
        {/* <div class="overflow-auto">
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
      </div> */}
    </div>
  );
}
