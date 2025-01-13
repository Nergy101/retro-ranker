import { Device } from "../data/device.model.ts";

interface DeviceCardSmallProps {
  device: Device;
}

export function DeviceCardSmall({ device }: DeviceCardSmallProps) {
  return (
    <div class="small-card" style="display: flex; justify-content: center; align-items: center;">
      <a
        href={`/devices/${device.sanitizedName}`}
        style="font-weight: bold; text-decoration: none;"
      >
        <div style="display: flex; flex-direction: column; align-items: center;">
          <span>{device.name}</span>
          <div style="width: 4rem; height: 4rem;">
            <img
              src={device.imageUrl}
              alt={device.name}
              style="width: 100%; height: 100%; object-fit: contain;"
            />
          </div>
          <span style="font-size: 0.8rem;">{device.brand}</span>
        </div>
      </a>
    </div>
  );
}
