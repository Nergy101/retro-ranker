// deno-lint-ignore-file no-console
// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";
import { createSuperUserPocketBaseService } from "../data/pocketbase/pocketbase.service.ts";
import { Device } from "../data/frontend/contracts/device.model.ts";

console.info(chalk.blue(" --- Migrating deviceType field --- "));

// Create Pocketbase service
const pbService = await createSuperUserPocketBaseService(
  Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
  Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
  Deno.env.get("POCKETBASE_URL")!,
);

// Get all devices from Pocketbase
const devices = await pbService.getAll("devices");
console.info(chalk.blue(`Found ${devices.length} devices to process`));

let updatedCount = 0;
let skippedCount = 0;
let errorCount = 0;

for (const deviceRecord of devices) {
  try {
    // Skip if deviceType is already set
    if (deviceRecord.deviceType) {
      console.log(chalk.yellow(
        `⏭️  Skipping device with existing deviceType: ${
          chalk.dim(deviceRecord.nameSanitized)
        } (${deviceRecord.deviceType})`,
      ));
      skippedCount++;
      continue;
    }

    // Parse deviceData to extract deviceType
    const deviceData = JSON.parse(deviceRecord.deviceData) as Device;

    if (!deviceData.deviceType) {
      console.log(chalk.red(
        `✕ Error: No deviceType found in deviceData for ${
          chalk.bold(deviceRecord.nameSanitized)
        }`,
      ));
      errorCount++;
      continue;
    }

    // Update the device with deviceType
    await pbService.update("devices", deviceRecord.id, {
      deviceType: deviceData.deviceType,
    });

    updatedCount++;
    console.log(
      chalk.green(
        `✓ Updated: ${
          chalk.bold(deviceRecord.nameSanitized)
        } with deviceType: ${chalk.bold(deviceData.deviceType)}`,
      ),
    );
  } catch (error) {
    errorCount++;
    console.error(
      chalk.red(
        `✕ Error processing: ${
          chalk.bold(deviceRecord.nameSanitized || "Unknown device")
        }`,
      ),
    );
    console.error(chalk.dim(error));
  }
}

console.log(chalk.dim("\nDevice Type Migration Summary:"));
console.log(chalk.green(`✓ Updated: ${updatedCount}`));
console.log(chalk.yellow(`⏭️  Skipped (already set): ${skippedCount}`));
console.log(chalk.red(`✕ Errors: ${errorCount}`));

console.info(chalk.green("✅ Device type migration completed!"));
