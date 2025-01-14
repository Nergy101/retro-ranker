import { Device } from "../data/device.model.ts";
import { StarRating } from "./StarRating.tsx";
interface DeviceCardMediumProps {
  device: Device;
}

export default function DeviceCardMedium({ device }: DeviceCardMediumProps) {
  return (
    <article>
      <header>
        <hgroup>
          <h2 style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            <a href={`/devices/${device.sanitizedName}`}>
              {device.name}
            </a>
          </h2>
          <StarRating performanceRating={device.performanceRating} />
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; gap: 0.5rem;">
              <p>{device.brand}</p>
            </div>
          </div>
        </hgroup>
      </header>

      <div style="width: 12rem; height: 12rem; margin: 1rem auto; display: flex; justify-content: center; align-items: center;">
        <img
          src={device.imageUrl}
          alt={device.name}
          style="width: 200px; height: 200px; object-fit: contain;"
          loading="lazy"
        />
      </div>

      <div style="align-self: flex-start; display: flex; flex-flow: row wrap; gap: 0.5rem;">
        {
          /* {device.specs.map((spec) => (
          <div key={spec.name} style="display: flex; gap: 0.1rem;">
            <div
              style={{
                backgroundColor: {
                  "A": "#22c55e",
                  "B": "#86efac",
                  "C": "#fde047",
                  "D": "#fb923c",
                  "E": "#ef4444",
                }[spec.rating],
                color: spec.rating === "A" || spec.rating === "E"
                  ? "white"
                  : "black",
                padding: "0.25rem",
                borderRadius: "0.25rem",
                minWidth: "1.5rem",
                textAlign: "center",
              }}
            >
              <span>{spec.name}</span>
            </div>
          </div>
        ))} */
        }
      </div>
    </article>
  );
}
