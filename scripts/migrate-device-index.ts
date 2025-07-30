// deno-lint-ignore-file no-console
import { createSuperUserPocketBaseService } from "../data/pocketbase/pocketbase.service.ts";
import { Device } from "../data/frontend/contracts/device.model.ts";
// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";

console.info(chalk.blue("🔄 Starting device index migration..."));

const pocketbaseClient = await createSuperUserPocketBaseService(
  Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
  Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
  Deno.env.get("POCKETBASE_URL")!,
);

try {
  // Get all existing devices
  console.info(chalk.yellow("📝 Fetching existing devices from PocketBase..."));
  const existingDevices = await pocketbaseClient.getAll("devices");
  console.info(chalk.blue(`Found ${existingDevices.length} existing devices`));

  let updatedCount = 0;
  let skippedCount = 0;

  for (const deviceRecord of existingDevices) {
    try {
      // Parse the device data
      const deviceData = JSON.parse(deviceRecord.deviceData) as Device;

      // Check if device already has an index
      if (deviceData.index !== undefined) {
        console.log(chalk.yellow(
          `⏭️  Skipping device with existing index: ${
            chalk.dim(deviceData.name.raw || "Unknown")
          } (index: ${deviceData.index})`,
        ));
        skippedCount++;
        continue;
      }

      // Assign index based on the order in the database
      // We'll use the existing order as a fallback
      const newIndex = updatedCount + skippedCount;

      // Update the device data with the new index
      deviceData.index = newIndex;

      // Update the device record
      await pocketbaseClient.update("devices", deviceRecord.id, {
        index: newIndex,
        deviceData: JSON.stringify(deviceData),
      });

      updatedCount++;
      console.log(
        chalk.green(
          `✓ Updated: ${chalk.bold(deviceData.brand.raw || "Unknown")} ${
            chalk.bold(deviceData.name.raw || "Unknown")
          } (index: ${newIndex})`,
        ),
      );
    } catch (error) {
      console.error(
        chalk.red(
          `✕ Error processing device ${deviceRecord.id}:`,
        ),
        error,
      );
    }
  }

  console.log(chalk.dim("\nMigration Summary:"));
  console.log(chalk.green(`✓ Updated: ${updatedCount}`));
  console.log(chalk.yellow(`⏭️  Skipped (already had index): ${skippedCount}`));
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
} catch (error) {
  console.error(
    chalk.red.bold("❌ Migration failed:"),
    error,
  );
  Deno.exit(1);
}

console.info(chalk.green("✅ Device index migration completed successfully!"));
