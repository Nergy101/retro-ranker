import { Device } from "../data/device.model.ts";
import { StarRating } from "./StarRating.tsx";

interface DeviceCardSmallProps {
  device: Device;
}

export function DeviceCardSmall({ device }: DeviceCardSmallProps) {
  return (
    <div
      class="small-card"
      style="display: flex; justify-content: center; align-items: center;"
    >
      <a
        href={`/devices/${device.sanitizedName}`}
        style="font-weight: bold; text-decoration: none;"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "auto",
            gap: ".5rem",
          }}
        >
          <hgroup
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <strong
              style={{
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "8rem",
              }}
              title={device.name}
            >
              <span>{device.name}</span>
            </strong>
            <p style="font-size: 0.8rem;">{device.brand}</p>
          </hgroup>
          <div class="figure" style="width: 4rem; height: 4rem;">
            <img
              src={device.imageUrl}
              alt={device.name}
              style="width: 100%; height: 100%; object-fit: contain;"
            />
          </div>
          <StarRating performanceRating={device.performanceRating} />
        </div>
      </a>
    </div>
  );
}
