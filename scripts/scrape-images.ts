// deno-lint-ignore-file no-console
import { Device } from "../data/device.model.ts";
// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";
import { slugify } from "https://deno.land/x/slugify@0.3.0/mod.ts";

slugify.extend({
  "?": "question-mark",
});

let noErrors = true;

export async function downloadDeviceImages(
  devices: Device[],
  targetDir: string,
) {
  console.info(chalk.blue("--- Downloading device images ---"));

  // Create the target directory if it doesn't exist
  try {
    await Deno.mkdir(targetDir, { recursive: true });
    console.info(
      chalk.green(`Created device images target directory: ${targetDir}`),
    );
  } catch (error: unknown) {
    console.error(
      chalk.red(
        `❌ Failed to create device images target directory: ${targetDir}`,
      ),
    );
    noErrors = false;
    throw error;
  }

  const downloads = devices.map(async (device) => {
    if (device.image.originalUrl) {
      await downloadImage(
        device.image.originalUrl,
        device.name.sanitized,
        targetDir,
      );
    } else {
      console.info(
        chalk.yellow(`device ${device.name.sanitized} does not have originalUrl`),
      );
    }
  });

  await Promise.all(downloads);

  if (noErrors) {
    console.info(chalk.green("Finished downloading all images!"));
  } else {
    console.info(
      chalk.red("Errors occurred, check the console for more details!"),
    );
  }
}

async function downloadImage(
  url: string,
  deviceName: string,
  targetDir: string,
) {
  try {
    if (url == "") {
      console.info(chalk.red(`❌ ${deviceName}: No image URL found`));
      noErrors = false;
      return;
    }
    const response = await fetch(url);
    if (!response.ok) {
      console.info(
        chalk.red(
          `❌ ${deviceName}: Failed to fetch ${url}: ${response.status}`,
        ),
      );
      noErrors = false;
      return;
    }

    const imageData = new Uint8Array(await response.arrayBuffer());
    const sanitizedName = slugify(deviceName);

    const filePath = `${targetDir}/${sanitizedName}.png`;

    await Deno.writeFile(filePath, imageData);

    // console.info(chalk.green(`✅ ${deviceName}`));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(chalk.red(`❌ ${deviceName}: ${error.message}`));
    } else {
      console.error(chalk.red(`❌ ${deviceName}: Unknown error`));
    }
    noErrors = false;
  }
}

console.info(chalk.blue("Downloading device images..."));
// Get all device images and download them to the static/devices directory

const devices = JSON.parse(
  new TextDecoder().decode(
    await Deno.readFile("../data/source/results/handhelds.json"),
  ),
) as Device[];

await downloadDeviceImages(devices, "../static/devices");
