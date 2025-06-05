// deno-lint-ignore-file no-console no-explicit-any
import { load } from "$std/dotenv/mod.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import { Device as DeviceContract } from "../frontend/contracts/device.model.ts";
import { createSuperUserPocketBaseService } from "../pocketbase/pocketbase.service.ts";

// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";
import { SystemRating } from "../entities/system-rating.entity.ts";
import { TagModel } from "../entities/tag.entity.ts";
import { unknownOrValue } from "./device-parser/device.parser.helpers.ts";
import { json } from "node:stream/consumers";

const env = await load({
  envPath: "../../.env",
  allowEmptyValues: true,
  export: true,
});

if (
  env.POCKETBASE_SUPERUSER_EMAIL == "" ||
  env.POCKETBASE_SUPERUSER_PASSWORD == "" ||
  env.POCKETBASE_URL == ""
) {
  console.error(chalk.red("Pocketbase environment variables are not set"));
  Deno.exit(0);
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

  const existingDevicesMap = new Map(
    existingDevices.map((device) => [device.id, device]),
  );

  for (const device of deviceEntities) {
    const deviceId = device.name.sanitized;
    const existingDevice = existingDevicesMap.get(deviceId);

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
        min: device.pricing.range.min,
        max: device.pricing.range.max,
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
          deviceData: JSON.stringify(device),
          systemRatings: device.systemRatings.map((rating) =>
            systemRatingsMap.get(`${rating.system}:${rating.ratingNumber}`)?.id
          ).filter(Boolean),
          tags: device.tags.map((tag) => tagMap.get(tag.slug)?.id).filter(
            Boolean,
          ),
          pricing: pricingId,
          performance: performanceId,
        }

        if (JSON.stringify(device) == JSON.stringify(existingDevice.deviceData)) {
          console.log(chalk.yellow(
            `⏭️  Skipping device without changes: ${
              chalk.dim(device.name.raw || "Unknown")
            }`,
          ),
          );
          continue;
        }

        // Update device only
        await pocketbaseClient.collection("devices").update(deviceId, updateData);


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
