import { PageProps } from "$fresh/server.ts";
import { getAllDevices } from "../../data/device.service.ts";
import DeviceSearch from "../../islands/DeviceSearch.tsx";

export default function DevicesIndex(props: PageProps) {
  const devices = getAllDevices();
  const searchQuery = props.url.searchParams.get("q") || "";
  return <DeviceSearch initialDevices={devices} initialQuery={searchQuery} totalDeviceCount={devices.length} />;
}
