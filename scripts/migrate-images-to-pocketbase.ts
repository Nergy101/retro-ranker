// deno-lint-ignore-file no-console
/**
 * One-time migration script to upload existing device images from static/devices
 * to PocketBase. Run this once after the PocketBase schema is updated with the
 * deviceMainImage field.
 *
 * Usage: deno run --allow-all scripts/migrate-images-to-pocketbase.ts
 */

import { load } from "@std/dotenv";
// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";
import { createSuperUserPocketBaseService } from "../data/pocketbase/pocketbase.service.ts";

const STATIC_DEVICES_PATH = "./static/devices";

let env: Record<string, string> = {};

try {
  env = await load({
    envPath: "./.env",
    export: true,
  });
} catch (_error) {
  console.warn(
    chalk.yellow(
      "Warning: Could not load .env file. Using environment variables from system.",
    ),
  );
  env = {
    POCKETBASE_SUPERUSER_EMAIL: Deno.env.get("POCKETBASE_SUPERUSER_EMAIL") ||
      "",
    POCKETBASE_SUPERUSER_PASSWORD:
      Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD") || "",
    POCKETBASE_URL: Deno.env.get("POCKETBASE_URL") || "",
  };
}

if (
  !env.POCKETBASE_SUPERUSER_EMAIL ||
  !env.POCKETBASE_SUPERUSER_PASSWORD ||
  !env.POCKETBASE_URL
) {
  console.error(chalk.red("❌ PocketBase environment variables are not set"));
  console.error(
    chalk.yellow("Please set the following environment variables:"),
  );
  console.error(chalk.cyan("  - POCKETBASE_URL"));
  console.error(chalk.cyan("  - POCKETBASE_SUPERUSER_EMAIL"));
  console.error(chalk.cyan("  - POCKETBASE_SUPERUSER_PASSWORD"));
  Deno.exit(1);
}

console.log(chalk.blue.bold("\n📷 Device Image Migration to PocketBase"));
console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

const pb = await createSuperUserPocketBaseService(
  env.POCKETBASE_SUPERUSER_EMAIL,
  env.POCKETBASE_SUPERUSER_PASSWORD,
  env.POCKETBASE_URL,
);

const pocketbaseClient = pb.getPocketBaseClient();

// Get all existing devices
console.log(chalk.cyan("Fetching existing devices..."));
const existingDevices = await pocketbaseClient.collection("devices")
  .getFullList();
console.log(
  chalk.blue(`Found ${existingDevices.length} devices in PocketBase`),
);

// Count WebP files in static/devices
let webpFileCount = 0;
const webpFiles: Map<string, string> = new Map();

try {
  for await (const dirEntry of Deno.readDir(STATIC_DEVICES_PATH)) {
    if (dirEntry.isFile && dirEntry.name.endsWith(".webp")) {
      const deviceName = dirEntry.name.replace(".webp", "");
      webpFiles.set(deviceName, `${STATIC_DEVICES_PATH}/${dirEntry.name}`);
      webpFileCount++;
    }
  }
} catch (error) {
  console.error(chalk.red(`Error reading ${STATIC_DEVICES_PATH}:`), error);
  Deno.exit(1);
}

console.log(
  chalk.blue(`Found ${webpFileCount} WebP images in ${STATIC_DEVICES_PATH}`),
);
console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));

let uploadedCount = 0;
let skippedCount = 0;
let notFoundCount = 0;
let errorCount = 0;

const startTime = Date.now();

for (const device of existingDevices) {
  const deviceId = device.id;
  const deviceName = device.nameSanitized;

  // Skip if device already has an image
  if (device.deviceMainImage) {
    console.log(chalk.dim(`⏭️  Skipping ${deviceName} (already has image)`));
    skippedCount++;
    continue;
  }

  // Check if we have a WebP file for this device
  const imagePath = webpFiles.get(deviceName);
  if (!imagePath) {
    console.log(chalk.yellow(`⚠️  No image found for ${deviceName}`));
    notFoundCount++;
    continue;
  }

  try {
    // Read the image file
    const imageData = await Deno.readFile(imagePath);
    const filename = `${deviceName}.webp`;
    const file = new File([imageData], filename, { type: "image/webp" });

    // Upload to PocketBase
    const formData = new FormData();
    formData.append("deviceMainImage", file);

    await pocketbaseClient.collection("devices").update(deviceId, formData);

    uploadedCount++;
    console.log(chalk.green(`✓ Uploaded image for ${deviceName}`));
  } catch (error) {
    errorCount++;
    console.error(
      chalk.red(`✕ Error uploading image for ${deviceName}:`),
      error,
    );
  }
}

const duration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log(chalk.dim("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
console.log(chalk.blue.bold("Migration Summary:"));
console.log(chalk.green(`✓ Uploaded: ${uploadedCount}`));
console.log(chalk.dim(`⏭️  Skipped (already has image): ${skippedCount}`));
console.log(chalk.yellow(`⚠️  No image found: ${notFoundCount}`));
if (errorCount > 0) {
  console.log(chalk.red(`✕ Errors: ${errorCount}`));
}
console.log(chalk.dim(`\nTotal time: ${duration} seconds`));
console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));

if (uploadedCount > 0) {
  console.log(chalk.magenta.bold("✨ Migration complete!"));
} else if (skippedCount === existingDevices.length) {
  console.log(chalk.blue("All devices already have images uploaded."));
} else {
  console.log(chalk.yellow("No new images were uploaded."));
}
