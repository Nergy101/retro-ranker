// deno-lint-ignore-file no-console
import { load } from "$std/dotenv/mod.ts";
import { nanoid } from "https://deno.land/x/nanoid/mod.ts";
import { Device as DeviceContract } from "../frontend/contracts/device.model.ts";
import { createSuperUserPocketBaseService } from "../pocketbase/pocketbase.service.ts";

// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";
import { SystemRating } from "../entities/system-rating.entity.ts";
import { TagModel } from "../entities/tag.entity.ts";
import { unknownOrValue } from "./device-parser/device.parser.helpers.ts";

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
async function insertTags(
  deviceEntities: DeviceContract[],
): Promise<Map<string, TagModel>> {
  console.log(chalk.cyan.bold("\n📑 Processing Tags"));
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

  const existingTags = await pocketbaseClient.collection("tags").getFullList();
  const existingTagsMap = new Map(
    existingTags.map((tag) => [tag.slug, tag]),
  );
  console.log(chalk.blue(`Found ${existingTags.length} existing tags`));

  const uniqueTags = new Map();
  let updatedCount = 0;
  let createdCount = 0;
  let errorCount = 0;

  for (const device of deviceEntities) {
    for (const tag of device.tags) {
      if (!uniqueTags.has(tag.slug)) {
        const tagData = {
          name: tag.name,
          slug: tag.slug,
          type: tag.type,
        };

        try {
          if (existingTagsMap.has(tag.slug)) {
            const existingTag = existingTagsMap.get(tag.slug)!;
            await pocketbaseClient.collection("tags").update(
              existingTag.id,
              tagData,
            );
            uniqueTags.set(tag.slug, { id: existingTag.id, ...tagData });
            updatedCount++;
          } else {
            const newId = nanoid(15);
            await pocketbaseClient.collection("tags").create({
              id: newId,
              ...tagData,
            });
            uniqueTags.set(tag.slug, { id: newId, ...tagData });
            createdCount++;
          }
        } catch (error) {
          console.error(
            chalk.red(
              `❌ Failed to process tag "${tag.name}" (${tag.slug}):`,
              error,
            ),
          );
          errorCount++;
        }
      }
    }
  }

  console.log(chalk.dim("\nTag Processing Summary:"));
  console.log(chalk.green(`✓ Created: ${createdCount}`));
  console.log(chalk.blue(`↻ Updated: ${updatedCount}`));
  if (errorCount > 0) console.log(chalk.red(`✕ Errors: ${errorCount}`));
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));

  return uniqueTags;
}

// Modify insertSystemRatings
async function insertSystemRatings(deviceEntities: DeviceContract[]) {
  console.log(chalk.cyan.bold("\n🎮 Processing System Ratings"));
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

  const existingRatings = await pocketbaseClient.collection("system_ratings")
    .getFullList();
  const existingRatingsMap = new Map(
    existingRatings.map(
      (rating) => [`${rating.system}:${rating.rating}`, rating],
    ),
  );
  console.log(
    chalk.blue(`Found ${existingRatings.length} existing system ratings`),
  );

  const uniqueSystemRatings = new Map();
  let updatedCount = 0;
  let createdCount = 0;
  let errorCount = 0;

  for (const device of deviceEntities) {
    for (const rating of device.systemRatings) {
      const key = `${rating.system}:${rating.ratingNumber}`;
      if (!uniqueSystemRatings.has(key)) {
        const ratingData = {
          system: rating.system,
          rating: rating.ratingNumber,
        };

        try {
          if (existingRatingsMap.has(key)) {
            const existingRating = existingRatingsMap.get(key)!;
            await pocketbaseClient.collection("system_ratings").update(
              existingRating.id,
              ratingData,
            );
            uniqueSystemRatings.set(key, {
              id: existingRating.id,
              ...ratingData,
            });
            updatedCount++;
          } else {
            const newId = nanoid(15);
            await pocketbaseClient.collection("system_ratings").create({
              id: newId,
              ...ratingData,
            });
            uniqueSystemRatings.set(key, { id: newId, ...ratingData });
            createdCount++;
          }
        } catch (error) {
          console.error(
            chalk.red(`❌ Failed to process system rating ${key}:`),
            error,
          );
          errorCount++;
        }
      }
    }
  }

  console.log(chalk.dim("\nSystem Ratings Processing Summary:"));
  console.log(chalk.green(`✓ Created: ${createdCount}`));
  console.log(chalk.blue(`↻ Updated: ${updatedCount}`));
  if (errorCount > 0) console.log(chalk.red(`✕ Errors: ${errorCount}`));
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));

  return uniqueSystemRatings;
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

      let pricingId, performanceId;

      if (existingDevice) {
        // Update existing records
        if (existingDevice.pricing) {
          await pocketbaseClient.collection("pricings").update(
            existingDevice.pricing,
            pricingData,
          );
          pricingId = existingDevice.pricing;
        } else {
          pricingId = nanoid(15);
          await pocketbaseClient.collection("pricings").create({
            id: pricingId,
            ...pricingData,
          });
        }

        if (existingDevice.performance) {
          await pocketbaseClient.collection("performances").update(
            existingDevice.performance,
            performanceData,
          );
          performanceId = existingDevice.performance;
        } else {
          performanceId = nanoid(15);
          await pocketbaseClient.collection("performances").create({
            id: performanceId,
            ...performanceData,
          });
        }

        // Update device
        await pocketbaseClient.collection("devices").update(deviceId, {
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
        updatedCount++;
        console.log(
          chalk.blue(
            `↻ Updated: ${chalk.bold(device.brand.sanitized)} ${
              chalk.bold(device.name.sanitized)
            }`,
          ),
        );
      } else {
        // Create new records
        pricingId = nanoid(15);
        performanceId = nanoid(15);

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
  console.log(chalk.yellow(`⏭️  Skipped: ${skipCount}`));
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
  const tagMap = await insertTags(handhelds);
  const systemRatingsMap = await insertSystemRatings(handhelds);
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
