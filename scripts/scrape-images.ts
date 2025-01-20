import { Device } from "../data/models/device.model.ts";

async function downloadImage(url: string, deviceName: string) {
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
    const sanitizedName = deviceName.toLowerCase()
      .replaceAll(" ", "-")
      .replaceAll("?", "-question-mark-")
      .replaceAll("!", "-exclamation-mark-")
      .replaceAll("'", "-apostrophe-")
      .replaceAll("(", "-open-parenthesis-")
      .replaceAll(")", "-close-parenthesis-")
      .replaceAll("&", "-ampersand-")
      .replaceAll(":", "-colon-")
      .replaceAll(";", "-semicolon-")
      .replaceAll("/", "-slash-")
      .replaceAll("\\", "-backslash-")
      .replace(/[^a-z0-9$-_.+!*'(),]/g, "-");

    const filePath = `static/devices/${sanitizedName}.png`;

    await Deno.mkdir("static/devices", { recursive: true });
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

export async function downloadDeviceImages(devices: Device[]) {
  console.info(`Starting download of ${devices.length} device images...`);

  const downloads = devices.map((device) => {
    downloadImage(device.image.originalUrl, device.name.sanitized);
  });

  await Promise.all(downloads);

  console.info("Finished downloading all images!");
}

// Example usage:.
import { DeviceService } from "../services/devices/device.service.ts";
const devices = DeviceService.getInstance().getAllDevices();
await downloadDeviceImages(devices);
