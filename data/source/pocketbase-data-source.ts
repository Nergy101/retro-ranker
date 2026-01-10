// deno-lint-ignore-file no-console no-explicit-any
import { load } from "@std/dotenv";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import { Device as DeviceContract } from "../frontend/contracts/device.model.ts";
import { createSuperUserPocketBaseService } from "../pocketbase/pocketbase.service.ts";

// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";
import { SystemRating } from "../entities/system-rating.entity.ts";
import { TagModel } from "../entities/tag.entity.ts";
import { unknownOrValue } from "./device-parser/device.parser.helpers.ts";

// Path to the static devices folder containing WebP images
const STATIC_DEVICES_PATH = "../../static/devices";

let env: Record<string, string> = {};

try {
  env = await load({
    envPath: "../../.env",
    export: true,
  });
} catch (_error) {
  console.warn(
    chalk.yellow(
      "Warning: Could not load .env file. Using environment variables from system.",
    ),
  );
  // Fall back to system environment variables
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
  !env.POCKETBASE_URL ||
  env.POCKETBASE_SUPERUSER_EMAIL === "" ||
  env.POCKETBASE_SUPERUSER_PASSWORD === "" ||
  env.POCKETBASE_URL === ""
) {
  console.error(chalk.red("❌ PocketBase environment variables are not set"));
  console.error(
    chalk.yellow("Please set the following environment variables:"),
  );
  console.error(chalk.cyan("  - POCKETBASE_URL"));
  console.error(chalk.cyan("  - POCKETBASE_SUPERUSER_EMAIL"));
  console.error(chalk.cyan("  - POCKETBASE_SUPERUSER_PASSWORD"));
  console.error(chalk.dim("\nYou can either:"));
  console.error(chalk.dim("1. Create a .env file in the project root"));
  console.error(chalk.dim("2. Set them as system environment variables"));
  Deno.exit(1);
}

const pb = await createSuperUserPocketBaseService(
  env.POCKETBASE_SUPERUSER_EMAIL,
  env.POCKETBASE_SUPERUSER_PASSWORD,
  env.POCKETBASE_URL,
);
const pocketbaseClient = pb.getPocketBaseClient();

// Read handhelds.json
const handhelds = JSON.parse(
  new TextDecoder().decode(await Deno.readFile("results/handhelds.json")),
) as DeviceContract[];

/**
 * Reads a WebP image file for a device and returns it as a File object for upload
 * @param deviceSanitizedName The sanitized device name (used as filename)
 * @returns File object if image exists, null otherwise
 */
async function getDeviceImageFile(
  deviceSanitizedName: string,
): Promise<File | null> {
  const imagePath = `${STATIC_DEVICES_PATH}/${deviceSanitizedName}.webp`;

  try {
    const imageData = await Deno.readFile(imagePath);
    const filename = `${deviceSanitizedName}.webp`;
    const file = new File([imageData], filename, { type: "image/webp" });
    return file;
  } catch (_error) {
    // Image doesn't exist, return null
    return null;
  }
}

/**
 * Uploads an image to a device record in PocketBase
 * @param deviceId The device record ID
 * @param imageFile The image File object
 * @returns true if upload succeeded, false otherwise
 */
async function uploadDeviceImage(
  deviceId: string,
  imageFile: File,
): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("deviceMainImage", imageFile);

    await pocketbaseClient.collection("devices").update(deviceId, formData);
    return true;
  } catch (error) {
    console.warn(
      chalk.yellow(`⚠️  Failed to upload image for ${deviceId}:`),
      error,
    );
    return false;
  }
}

// Modify insertTags
async function getOrCreateTags(
  deviceEntities: DeviceContract[],
): Promise<Map<string, TagModel>> {
  console.log(chalk.cyan.bold("\n📑 Processing Tags"));
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

  const existingTags = await pocketbaseClient.collection("tags").getFullList();
  const tagMap: Map<string, any> = new Map(
    existingTags.map((tag) => [tag.slug, tag]),
  );
  console.log(chalk.blue(`Found ${existingTags.length} existing tags`));

  let createdCount = 0;

  // Collect all unique tags from devices
  for (const device of deviceEntities) {
    for (const tag of device.tags) {
      if (!tagMap.has(tag.slug)) {
        // Create new tag only if it doesn't exist
        const newId = nanoid(15);
        const tagData = {
          id: newId,
          name: tag.name,
          slug: tag.slug,
          type: tag.type,
        };

        await pocketbaseClient.collection("tags").create(tagData);
        tagMap.set(tag.slug, tagData);
        createdCount++;
      }
    }
  }

  if (createdCount > 0) {
    console.log(chalk.green(`Created ${createdCount} new tags`));
  }
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));

  return tagMap;
}

// Modify insertSystemRatings
async function getOrCreateSystemRatings(
  deviceEntities: DeviceContract[],
): Promise<Map<string, SystemRating>> {
  console.log(chalk.cyan.bold("\n🎮 Processing System Ratings"));
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

  const existingRatings = await pocketbaseClient.collection("system_ratings")
    .getFullList();
  const ratingsMap: Map<string, any> = new Map(
    existingRatings.map((
      rating,
    ) => [`${rating.system}:${rating.rating}`, rating]),
  );
  console.log(
    chalk.blue(`Found ${existingRatings.length} existing system ratings`),
  );

  let createdCount = 0;

  // Collect all unique system ratings from devices
  for (const device of deviceEntities) {
    for (const rating of device.systemRatings) {
      const key = `${rating.system}:${rating.ratingNumber ?? 0}`;

      if (!ratingsMap.has(key)) {
        // Create new rating only if it doesn't exist
        const newId = nanoid(15);
        const ratingData: any = {
          id: newId,
          system: rating.system,
          rating: rating.ratingNumber,
          ratingNumber: rating.ratingNumber,
        };

        await pocketbaseClient.collection("system_ratings").create(ratingData);
        ratingsMap.set(key, ratingData);
        createdCount++;
      }
    }
  }

  if (createdCount > 0) {
    console.log(chalk.green(`Created ${createdCount} new system ratings`));
  }
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));

  return ratingsMap;
}

// Modify insertDevices
async function insertDevices(
  deviceEntities: DeviceContract[],
  tagMap: Map<string, TagModel>,
  systemRatingsMap: Map<string, SystemRating>,
) {
  console.log(chalk.cyan.bold("\n📱 Processing Devices"));
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

  const existingDevices = await pocketbaseClient.collection("devices")
    .getFullList();
  console.log(chalk.blue(`Found ${existingDevices.length} existing devices`));
  console.log(chalk.yellow(`Processing ${deviceEntities.length} devices...\n`));

  let createdCount = 0;
  let updatedCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  let imageUploadCount = 0;
  let imageSkipCount = 0;

  const existingDevicesMap = new Map(
    existingDevices.map((device) => [device.id, device]),
  );

  for (const device of deviceEntities) {
    const deviceId = device.name.sanitized;
    const existingDevice = existingDevicesMap.get(deviceId);

    // Debug logging for Odin 3
    if (device.name.raw === "Odin 3" || device.name.sanitized === "odin-3") {
      console.log(chalk.cyan(`\n🔍 DEBUG: Odin 3`));
      console.log(chalk.dim(`  Device ID (sanitized): ${deviceId}`));
      console.log(
        chalk.dim(`  Existing device found: ${existingDevice ? "YES" : "NO"}`),
      );
      if (existingDevice) {
        console.log(
          chalk.dim(
            `  Existing deviceData type: ${typeof existingDevice.deviceData}`,
          ),
        );
        console.log(
          chalk.dim(
            `  Existing deviceData is string: ${
              typeof existingDevice.deviceData === "string"
            }`,
          ),
        );
      }
      console.log(
        chalk.dim(
          `  New device released: ${
            device.released?.mentionedDate || "undefined"
          }`,
        ),
      );
      console.log(
        chalk.dim(
          `  New device image: ${device.image?.originalUrl || "undefined"}`,
        ),
      );
    }

    // Skip incomplete devices
    if (device.brand.raw === "Unknown") {
      console.log(
        chalk.yellow(
          `⏭️  Skipping incomplete device: ${
            chalk.dim(device.name.raw || "Unknown")
          }`,
        ),
      );
      skipCount++;
      continue;
    }

    try {
      const pricingData = {
        average: device.pricing.average,
        min: device.pricing.range?.min,
        max: device.pricing.range?.max,
        currency: device.pricing.currency,
        category: device.pricing.category,
        discontinued: device.pricing.discontinued,
      };

      const performanceData = {
        emulationLimit: device.performance.emulationLimit,
        maxEmulation: device.performance.maxEmulation,
        normalizedRating: device.performance.normalizedRating,
        rating: device.performance.rating,
        tier: device.performance.tier,
      };

      if (existingDevice) {
        // Use existing pricing and performance IDs
        const pricingId = existingDevice.pricing;
        const performanceId = existingDevice.performance;

        const updateData = {
          nameRaw: unknownOrValue(device.name.raw),
          nameSanitized: unknownOrValue(device.name.sanitized),
          brandRaw: unknownOrValue(device.brand.raw),
          brandSanitized: unknownOrValue(device.brand.sanitized),
          released: device.released.mentionedDate,
          totalRating: device.totalRating ?? 0,
          deviceType: device.deviceType,
          index: device.index,
          deviceData: JSON.stringify(device),
          systemRatings: device.systemRatings.map((rating) =>
            systemRatingsMap.get(`${rating.system}:${rating.ratingNumber}`)?.id
          ).filter(Boolean),
          tags: device.tags.map((tag) => tagMap.get(tag.slug)?.id).filter(
            Boolean,
          ),
          pricing: pricingId,
          performance: performanceId,
        };

        // Parse existing deviceData if it's a string, otherwise use it directly
        const existingDeviceDataParsed =
          typeof existingDevice.deviceData === "string"
            ? JSON.parse(existingDevice.deviceData)
            : existingDevice.deviceData;

        // Normalize both objects for comparison
        // JSON.stringify should be consistent, but we'll do a simple comparison
        // If there are issues, the debug logging will help identify them
        const normalizeForComparison = (obj: any): string => {
          return JSON.stringify(obj);
        };

        const newDeviceJson = normalizeForComparison(device);
        const existingDeviceJson = normalizeForComparison(
          existingDeviceDataParsed,
        );

        // Debug logging for Odin 3 comparison
        if (
          device.name.raw === "Odin 3" || device.name.sanitized === "odin-3"
        ) {
          console.log(chalk.cyan(`🔍 DEBUG: Odin 3 Comparison`));
          console.log(
            chalk.dim(`  New device JSON length: ${newDeviceJson.length}`),
          );
          console.log(
            chalk.dim(
              `  Existing device JSON length: ${existingDeviceJson.length}`,
            ),
          );
          console.log(
            chalk.dim(
              `  JSONs are equal: ${newDeviceJson === existingDeviceJson}`,
            ),
          );
          if (newDeviceJson !== existingDeviceJson) {
            // Find first difference
            const minLength = Math.min(
              newDeviceJson.length,
              existingDeviceJson.length,
            );
            for (let i = 0; i < minLength; i++) {
              if (newDeviceJson[i] !== existingDeviceJson[i]) {
                console.log(chalk.dim(`  First difference at position ${i}`));
                console.log(
                  chalk.dim(
                    `  New: ...${
                      newDeviceJson.substring(Math.max(0, i - 50), i + 50)
                    }...`,
                  ),
                );
                console.log(
                  chalk.dim(
                    `  Old: ...${
                      existingDeviceJson.substring(Math.max(0, i - 50), i + 50)
                    }...`,
                  ),
                );
                break;
              }
            }
          }
        }

        if (newDeviceJson === existingDeviceJson) {
          console.log(chalk.yellow(
            `⏭️  Skipping device without changes: ${
              chalk.dim(device.name.raw || "Unknown")
            }`,
          ));
          continue;
        }

        // Update device only
        await pocketbaseClient.collection("devices").update(
          deviceId,
          updateData,
        );

        // Upload image if device doesn't have one yet
        if (!existingDevice.deviceMainImage) {
          const imageFile = await getDeviceImageFile(device.name.sanitized);
          if (imageFile) {
            const uploaded = await uploadDeviceImage(deviceId, imageFile);
            if (uploaded) {
              imageUploadCount++;
              console.log(
                chalk.magenta(`📷 Uploaded image for ${device.name.sanitized}`),
              );
            }
          } else {
            imageSkipCount++;
          }
        }

        updatedCount++;
        console.log(
          chalk.blue(
            `↻ Updated: ${chalk.bold(device.brand.sanitized)} ${
              chalk.bold(device.name.sanitized)
            }`,
          ),
        );
      } else {
        // Create new records only for new devices
        const pricingId = nanoid(15);
        const performanceId = nanoid(15);

        await pocketbaseClient.collection("pricings").create({
          id: pricingId,
          ...pricingData,
        });
        await pocketbaseClient.collection("performances").create({
          id: performanceId,
          ...performanceData,
        });

        await pocketbaseClient.collection("devices").create({
          id: deviceId,
          nameRaw: unknownOrValue(device.name.raw),
          nameSanitized: unknownOrValue(device.name.sanitized),
          brandRaw: unknownOrValue(device.brand.raw),
          brandSanitized: unknownOrValue(device.brand.sanitized),
          released: device.released.mentionedDate,
          totalRating: device.totalRating ?? 0,
          deviceType: device.deviceType,
          index: device.index,
          deviceData: JSON.stringify(device),
          systemRatings: device.systemRatings.map((rating) =>
            systemRatingsMap.get(`${rating.system}:${rating.ratingNumber}`)?.id
          ).filter(Boolean),
          tags: device.tags.map((tag) => tagMap.get(tag.slug)?.id).filter(
            Boolean,
          ),
          pricing: pricingId,
          performance: performanceId,
        });

        // Upload image for new device
        const imageFile = await getDeviceImageFile(device.name.sanitized);
        if (imageFile) {
          const uploaded = await uploadDeviceImage(deviceId, imageFile);
          if (uploaded) {
            imageUploadCount++;
            console.log(
              chalk.magenta(`📷 Uploaded image for ${device.name.sanitized}`),
            );
          }
        } else {
          imageSkipCount++;
        }

        createdCount++;
        console.log(
          chalk.green(
            `✓ Created: ${chalk.bold(device.brand.sanitized)} ${
              chalk.bold(device.name.sanitized)
            }`,
          ),
        );
      }
    } catch (error) {
      errorCount++;
      console.error(
        chalk.red(
          `✕ Error processing: ${
            chalk.bold(device.name.sanitized || "Unknown device")
          }`,
        ),
      );
      console.error(chalk.dim(error));
    }
  }

  console.log(chalk.dim("\nDevice Processing Summary:"));
  console.log(chalk.green(`✓ Created: ${createdCount}`));
  console.log(chalk.blue(`↻ Updated: ${updatedCount}`));
  console.log(chalk.yellow(`⏭️  Skipped (incomplete): ${skipCount}`));
  console.log(
    chalk.dim(
      `• Skipped (no changes): ${
        deviceEntities.length - createdCount - updatedCount - skipCount -
        errorCount
      }`,
    ),
  );
  if (errorCount > 0) console.log(chalk.red(`✕ Errors: ${errorCount}`));
  console.log(chalk.magenta(`📷 Images uploaded: ${imageUploadCount}`));
  if (imageSkipCount > 0) {
    console.log(chalk.dim(`• Images not found: ${imageSkipCount}`));
  }
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
}

// Fix the updateOrCreateRecords function - it was returning a map outside the loop
async function updateOrCreateRecords() {
  try {
    console.log(chalk.yellow.bold("🔄 Starting update/create process..."));

    const collectionMaps = new Map();
    const collections = ["devices", "pricings", "performances"];

    for (const collection of collections) {
      console.log(
        chalk.yellow.bold(
          `📝 Fetching existing records from ${collection}...`,
        ),
      );
      const existingRecords = await pocketbaseClient.collection(collection)
        .getFullList();

      // Create a map of existing records by ID for quick lookup
      const existingRecordsMap = new Map(
        existingRecords.map((record) => [record.id, record]),
      );

      collectionMaps.set(collection, existingRecordsMap);
      console.info(
        chalk.blue(`Found ${existingRecords.length} existing records`),
      );
    }

    return collectionMaps;
  } catch (error) {
    console.error(
      chalk.red.bold("❌ Failed to fetch existing records:"),
      error,
    );
    Deno.exit(1);
  }
}

// Main execution
console.log(chalk.magenta.bold("\n🚀 Starting Database Update Process"));
console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

const startTime = Date.now();

try {
  await updateOrCreateRecords();
  const tagMap = await getOrCreateTags(handhelds);
  const systemRatingsMap = await getOrCreateSystemRatings(handhelds);
  await insertDevices(handhelds, tagMap, systemRatingsMap);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(chalk.magenta.bold("\n✨ Database Update Complete"));
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(chalk.white(`Total time: ${duration} seconds`));
} catch (error) {
  console.error(chalk.red.bold("\n❌ Database Update Failed"));
  console.error(chalk.red(error));
  Deno.exit(1);
}
