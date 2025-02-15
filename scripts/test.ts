// deno-lint-ignore-file no-console
import { Device } from "../data/device.model.ts";

const devices: Device[] = JSON.parse(
  Deno.readTextFileSync("../data/source/results/handhelds.json"),
);

const sortedDevices = devices.sort((a: Device, b: Device) => {
  return (b.screen.ppi?.[0] ?? 0) - (a.screen.ppi?.[0] ?? 0);
});

console.info(sortedDevices[0].screen.ppi?.[0], sortedDevices[0].name.raw);
