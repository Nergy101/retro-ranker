import { getAllDevices } from "../../data/device.service.ts";
import DeviceSearch from "../../islands/DeviceSearch.tsx";

export default function DevicesIndex() {
  const devices = getAllDevices();
  return <DeviceSearch initialDevices={devices} />;
}
