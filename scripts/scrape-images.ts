// deno-lint-ignore-file no-console
import { Device } from "../data/device.model.ts";
import { slugify } from "https://deno.land/x/slugify@0.3.0/mod.ts";

slugify.extend({
  '?': 'question-mark'
})

export async function downloadDeviceImages(
  devices: Device[],
  targetDir: string,
) {
  console.info(`Starting download of ${devices.length} device images...`);

  // Create the target directory if it doesn't exist
  await Deno.mkdir(targetDir, { recursive: true });
  console.info(`Created device images target directory: ${targetDir}`);

  const downloads = devices.map((device) => {
    if (device.image.originalUrl) {
      downloadImage(device.image.originalUrl, device.name.sanitized, targetDir);
    }
  });

  await Promise.all(downloads);
  console.info("Finished downloading all images!");
}

async function downloadImage(
  url: string,
  deviceName: string,
  targetDir: string,
) {
  try {
    if (url == "") {
      console.info(`❌ ${deviceName}: No image URL found`);
      return;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const imageData = new Uint8Array(await response.arrayBuffer());
    const sanitizedName = slugify(deviceName);
    // const sanitizedName = deviceName.toLowerCase()
      // .replaceAll(" ", "-")
      // .replaceAll("?", "-question-mark-")
      // .replaceAll("!", "-exclamation-mark-")
      // .replaceAll("'", "-apostrophe-")
      // .replaceAll("(", "-open-parenthesis-")
      // .replaceAll(")", "-close-parenthesis-")
      // .replaceAll("&", "-ampersand-")
      // .replaceAll(":", "-colon-")
      // .replaceAll(";", "-semicolon-")
      // .replaceAll("/", "-slash-")
      // .replaceAll("\\", "-backslash-")
      // .replace(/[^a-z0-9$-_.+!*'(),]/g, "-");

    const filePath = `${targetDir}/${sanitizedName}.png`;

    await Deno.writeFile(filePath, imageData);

    console.info(`✅ ${deviceName}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`❌ ${deviceName}: ${error.message}`);
    } else {
      console.error(`❌ ${deviceName}: Unknown error`);
    }
  }
}

// Get all device images and download them to the static/devices directory
import { DeviceService } from "../services/devices/device.service.ts";
const devices = DeviceService.getInstance().getAllDevices();
await downloadDeviceImages(devices, "static/devices");
