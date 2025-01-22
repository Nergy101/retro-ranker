import { Device } from "../data/models/device.model.ts";

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

  const getRatingInfo = (rating: string) => {
    switch (rating.toUpperCase()) {
      case "A":
        return { color: "#22c55e", text: "Excellent 5/5" };
      case "B":
        return { color: "#4dc1bb", text: "Playable 4/5" };
      case "C":
        return { color: "#fde047", text: "Playable with tweaks 3/5" };
      case "D":
        return { color: "#fb923c", text: "Barely works 2/5" };
      case "F":
        return { color: "#ef4444", text: "Doesn't work 1/5" };
      default:
        return { color: "var(--pico-contrast)", text: "Unknown" };
    }
  };

  return (
    <div
      class="emulation-performance"
      style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        {ratings.map((rating) => {
          const { color, text } = getRatingInfo(rating.rating);
          return (
            <div
              style={{
                backgroundColor: color,
                padding: "0.25rem",
                borderRadius: "0.5em",
                textAlign: "center",
                color: ["A", "B", "D", "F"].includes(rating.rating.toUpperCase())
                  ? "white"
                  : "black",
                fontSize: "0.75rem",
              }}
            >
              <span data-tooltip={text}>{rating.system}</span>
            </div>
          );
        })}
      </div>

      <div class="overflow-auto">
        <table class="striped">
          <tbody>
            {device.cpu && device.gpu && (
              <tr>
                <th>CPU</th>
                <td>
                  <span
                    data-tooltip={device.cpu.names.join(", ")}
                    data-placement="bottom"
                  >
                    {max20Characters(device.cpu.names[0])}
                  </span>
                  {device.cpu.cores && device.cpu.cores > 0 &&
                    ` (${device.cpu.cores} cores)`}
                  {device.cpu.clockSpeed && ` @ ${device.cpu.clockSpeed}`}
                </td>

                <th>GPU</th>
                <td>
                  <span
                    data-tooltip={device.gpu.name}
                    data-placement="bottom"
                  >
                    {max20Characters(device.gpu.name)}
                  </span>
                  {device.gpu.cores && ` (${device.gpu.cores})`}
                  {device.gpu.clockSpeed && ` @ ${device.gpu.clockSpeed}`}
                </td>
              </tr>
            )}
            {device.ram && (
              <tr>
                <th>RAM</th>
                <td>{device.ram}</td>
                <th>WiFi</th>
                <td>{device.connectivity.hasWifi ? "✅" : "❌"}</td>
              </tr>
            )}
            {device.screen.size && device.screen.aspectRatio && (
              <tr>
                <th>Screen Size</th>
                <td>{device.screen.size}</td>
                <th>Screen Aspect Ratio</th>
                <td>{device.screen.aspectRatio}</td>
              </tr>
            )}
            {device.battery && device.cooling && (
              <tr>
                <th>Battery</th>
                <td>{device.battery}</td>
                <th>Cooling</th>
                <td>{device.cooling.raw}</td>
              </tr>
            )}

            {(device.reviews.writtenReviews.length > 0 || device.hackingGuides.length > 0) && (
              <tr>
                <th>Written Reviews</th>
                <td colSpan={1}>
                  {device.reviews.writtenReviews.length > 0 ? (
                    <ul>
                      {device.reviews.writtenReviews.map((review) => (
                        <li key={review.url}>
                          <a href={review.url} target="_blank" alt={review.name}>
                            {review.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No written reviews available.</span>
                  )}
                </td>
                <th>Hacking Guides</th>
                <td colSpan={1}>
                  {device.hackingGuides.length > 0 ? (
                    <ul>
                      {device.hackingGuides.map((guide) => (
                        <li key={guide.url}>
                          <a href={guide.url} target="_blank" alt={guide.name}>
                            {guide.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No hacking guides available.</span>
                  )}
                </td>
              </tr>
            )}

            {(device.reviews.videoReviews.length > 0 || device.vendorLinks.length > 0) && (
              <tr>
                <th>Video Reviews</th>
                <td colSpan={1}>
                  {device.reviews.videoReviews.length > 0 ? (
                    <ul>
                      {device.reviews.videoReviews.map((review) => (
                        <li key={review.url}>
                          <a href={review.url} target="_blank" alt={review.name}>
                            {review.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No video reviews available.</span>
                  )}
                </td>
                <th>Vendor Links</th>
                <td colSpan={1}>
                  {device.vendorLinks.length > 0 ? (
                    <ul>
                      {device.vendorLinks.map((link) => (
                        <li key={link.url}>
                          <a href={link.url} target="_blank" alt={link.name}>
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No vendor links available.</span>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
