// deno-lint-ignore-file no-console
import { Device } from "../frontend/contracts/device.model.ts";
import { DeviceParser } from "./device-parser/device.parser.ts";
import { slugify } from "https://deno.land/x/slugify@0.3.0/mod.ts";
// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";
import { exists } from "jsr:@std/fs/exists";

console.info(chalk.blue(" --- Generating devices json --- "));

slugify.extend({
  "?": "-question-mark-",
  '"': "-double-quote-",
  " ": "-",
  "+": "-plus-",
});

// living data path
const filePath = `results/handhelds.json`;
const handheldsFileContent = await Deno.readTextFile("./files/Handhelds.html");
const oemsFileContent = await Deno.readTextFile("./files/OEM.html");
const _resourcesPath = "./files/resources";

// parse handhelds html
const parsedDevicesHandhelds = await DeviceParser.parseHandheldsHtml(
  handheldsFileContent,
);
console.info(
  chalk.blue("parsed handheld devices: ", parsedDevicesHandhelds.length),
);

const parsedDevicesOEMs = await DeviceParser.parseOEMsHtml(oemsFileContent);
console.info(chalk.blue("parsed OEM devices: ", parsedDevicesOEMs.length));

const allDevices = [...parsedDevicesHandhelds, ...parsedDevicesOEMs];

console.info(chalk.blue("Combined devices parsed: ", allDevices.length));

const devices = allDevices
  .filter((device) => device.name.sanitized !== "")
  .filter((device) => device.image.originalUrl !== "");

if (await exists(filePath)) {
  console.info(chalk.blue("Reading existing devices from: ", filePath));
  const currentDevices = JSON.parse(
    new TextDecoder().decode(await Deno.readFile(filePath)),
  ) as Device[];

  const currentDevicesMap = new Map(
    currentDevices.map((device) => [device.name.raw, device]),
  );

  devices.forEach((newDevice) => {
    const currentDevice = currentDevicesMap.get(newDevice.name.raw);

    if (!currentDevice) {
      console.info(chalk.blue(`New device added: ${newDevice.name.raw}`));
    }
  });
}

// marshall into JSON and into bytes
const devicesJson = JSON.stringify(devices, null, 2);
const devicesJsonBytes = new TextEncoder().encode(devicesJson);

// place source/handhelds.json

await Deno.mkdir("results", { recursive: true });
await Deno.writeFile(filePath, devicesJsonBytes);

console.info(chalk.green("Devices json saved to: ", filePath));

// Clean up temporary files after processing
console.info(chalk.blue("Cleaning up temporary files..."));
try {
  // Remove HTML files
  await Deno.remove("./files/Handhelds.html");
  await Deno.remove("./files/OEM.html");
  console.info(chalk.green("Removed HTML files"));

  // Remove resources folder if it exists
  try {
    await Deno.remove("./files/resources", { recursive: true });
    console.info(chalk.green("Removed resources folder"));
  } catch (_error) {
    console.info(chalk.yellow("Resources folder not found or already removed"));
  }

  console.info(chalk.green("Cleanup completed successfully"));
} catch (error) {
  console.error(chalk.red("Error during cleanup:"), error);
}
