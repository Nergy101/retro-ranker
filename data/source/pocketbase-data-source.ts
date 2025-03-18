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
const env = await load({ envPath: "../../.env", allowEmptyValues: true, export: true });

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
const batch = pocketbaseClient.createBatch();

const devicesCollection = batch.collection("devices");
const pricingCollection = batch.collection("pricings");
const performanceCollection = batch.collection("performances");

// Read handhelds.json
const handhelds = JSON.parse(
  new TextDecoder().decode(await Deno.readFile("results/handhelds.json")),
) as DeviceContract[];

// Delete all existing records from collections before inserting new data
async function clearCollections() {
  try {
    console.log(chalk.yellow.bold("🗑️  Deleting all existing records..."));

    const collections = [
      "devices",
    ];

    for (const collection of collections) {
      // const deleteBatch = pocketbaseClient.createBatch();


      console.log(
        chalk.yellow.bold(
          `🗑️  Deleting all existing records from ${collection}...`,
        ),
      );
      const records = await pocketbaseClient.collection(collection)
        .getFullList();

      console.info(chalk.blue(`Found ${records.length} records`));

      for (const record of records) {
        pocketbaseClient.collection(collection).delete(record.id);
      }

      // if (records.length > 0) {
      //   const deleteBatchResult = await deleteBatch.send();
      //   if (
      //     deleteBatchResult.filter((r) => r.status !== 200 && r.status !== 204)
      //       .length > 0
      //   ) {
      //     console.error(
      //       chalk.red.bold("❌ Failed to delete some records:"),
      //       deleteBatchResult,
      //     );
      //     Deno.exit(1);
      //   }
      // }
    }

    console.log(
      chalk.green.bold("🔥 All existing records deleted successfully"),
    );
  } catch (error) {
    console.error(chalk.red.bold("❌ Failed to clear collections:"), error);
    Deno.exit(1);
  }
}

// Add a new function to insert tags first
async function insertTags(
  deviceEntities: DeviceContract[],
): Promise<Map<string, TagModel>> {
  console.log(chalk.cyan.bold("📥 Inserting unique tags..."));

  // Create a map to store unique tags by slug
  const uniqueTags = new Map();

  // Collect all unique tags from all devices
  for (const device of deviceEntities) {
    for (const tag of device.tags) {
      if (!uniqueTags.has(tag.slug)) {
        uniqueTags.set(tag.slug, {
          id: nanoid(15),
          name: tag.name,
          slug: tag.slug,
          type: tag.type,
        });
      }
    }
  }

  const tagsBatch = pocketbaseClient.createBatch();
  for (const tag of uniqueTags.values()) {
    tagsBatch.collection("tags").create(tag);
  }

  const tagsBatchResult = await tagsBatch.send();

  if (tagsBatchResult.filter((r) => r.status !== 200).length > 0) {
    console.error(
      chalk.red.bold("❌ Failed to insert some tags:"),
      tagsBatchResult,
    );
    Deno.exit(1);
  }

  console.log(chalk.green.bold(`✅ Inserted ${uniqueTags.size} unique tags`));

  return uniqueTags;
}

// Add a new function to insert system ratings first
async function insertSystemRatings(deviceEntities: DeviceContract[]) {
  console.log(chalk.cyan.bold("📥 Inserting unique system ratings..."));

  // Create a map to store unique system ratings by system+rating combination
  const uniqueSystemRatings = new Map();

  // Collect all unique system ratings from all devices
  for (const device of deviceEntities) {
    for (const rating of device.systemRatings) {
      // Create a unique key combining system and rating
      const key = `${rating.system}:${rating.ratingNumber}`;
      if (!uniqueSystemRatings.has(key)) {
        uniqueSystemRatings.set(key, {
          id: nanoid(15),
          system: rating.system,
          rating: rating.ratingNumber,
        });
      }
    }
  }

  const systemRatingsBatch = pocketbaseClient.createBatch();
  for (const systemRating of uniqueSystemRatings.values()) {
    systemRatingsBatch.collection("system_ratings").create(systemRating);
  }

  const systemRatingsBatchResult = await systemRatingsBatch.send();

  if (systemRatingsBatchResult.filter((r) => r.status !== 200).length > 0) {
    console.error(
      chalk.red.bold("❌ Failed to insert some system ratings:"),
      systemRatingsBatchResult,
    );
    Deno.exit(1);
  }

  console.log(
    chalk.green.bold(
      `✅ Inserted ${uniqueSystemRatings.size} unique system ratings`,
    ),
  );

  return uniqueSystemRatings;
}

async function insertDevices(
  deviceEntities: DeviceContract[],
  tagMap: Map<string, TagModel>,
  systemRatingsMap: Map<string, SystemRating>,
) {

  if (hasDoubleDevices(deviceEntities)) {
    console.error(
      chalk.red.bold("❌ Duplicate devices found"),
    );
    Deno.exit(1);
  }

  console.log(
    chalk.cyan.bold(
      `📥 Starting import of ${deviceEntities.length} devices...`,
    ),
  );
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const device of deviceEntities) {
    const deviceId = device.name.sanitized; //  nanoid(15);
    const pricingId = nanoid(15);
    const performanceId = nanoid(15);
    // Use existing tag IDs from the map
    const tagIds = device.tags.map((tag) => tagMap.get(tag.slug)?.id);
    // Use existing system rating IDs from the map with the combined key
    const systemRatingIds = device.systemRatings.map((rating) =>
      systemRatingsMap.get(`${rating.system}:${rating.ratingNumber}`)?.id
    );

    try {
      // Insert Device
      if (
        device.brand.raw === "Unknown"
        // && device.name.raw === "Unknown"
      ) {
        console.log(
          chalk.yellow(
            `⏭️  Skipping device with incomplete data: ${device.name.raw || "Unknown"
            } - ${device.brand.raw || "Unknown"}`,
          ),
        );
        skipCount++;
        continue;
      }

      // Insert Pricing
      pricingCollection.create({
        id: pricingId,
        average: device.pricing.average,
        min: device.pricing.range.min,
        max: device.pricing.range.max,
        currency: device.pricing.currency,
        category: device.pricing.category,
        discontinued: device.pricing.discontinued,
      });

      // Insert Performance
      performanceCollection.create({
        id: performanceId,
        emulationLimit: device.performance.emulationLimit,
        maxEmulation: device.performance.maxEmulation,
        normalizedRating: device.performance.normalizedRating,
        rating: device.performance.rating,
        tier: device.performance.tier,
      });

      // No longer inserting tags or system ratings here, as they're already inserted

      devicesCollection.create({
        id: deviceId,
        nameRaw: unknownOrValue(device.name.raw),
        nameSanitized: unknownOrValue(device.name.sanitized),
        brandRaw: unknownOrValue(device.brand.raw),
        brandSanitized: unknownOrValue(device.brand.sanitized),
        released: device.released.mentionedDate,
        totalRating: device.totalRating ?? 0,

        deviceData: JSON.stringify(device),

        pricing: pricingId,
        performance: performanceId,
        systemRatings: systemRatingIds,
        tags: tagIds,
      });

      console.log(
        chalk.green(
          `✅ Inserted: ${chalk.bold(device.brand.sanitized)} ${chalk.bold(device.name.sanitized)
          } (ID: ${chalk.dim(deviceId)})`,
        ),
      );
      successCount++;
    } catch (error) {
      console.error(
        chalk.red.bold(
          `❌ Failed to insert ${device.name.sanitized || "Unknown device"}`,
        ),
        chalk.red(error),
      );
      errorCount++;
    }
  }

  console.log(
    chalk.cyan.bold(
      `📊 Import summary: ${chalk.green(`${successCount} succeeded`)} | ${chalk.yellow(`${skipCount} skipped`)
      } | ${chalk.red(`${errorCount} failed`)}`,
    ),
  );
}

// Clear all collections before inserting new data
console.log(chalk.magenta.bold("🚀 Starting database population process..."));

await clearCollections();

const tagMap = await insertTags(handhelds);
const systemRatingsMap = await insertSystemRatings(handhelds);
await insertDevices(handhelds, tagMap, systemRatingsMap);

const batchResult = await batch.send();

const failed = batchResult.filter((r) => r.status !== 200);

if (failed.length > 0) {
  console.error(chalk.red.bold("❌ Failed to insert some records:"), failed);
} else {
  console.log(chalk.green.bold("🎉 All records inserted successfully!"));
}

console.log(chalk.magenta.bold("✨ Database population process completed"));


function hasDoubleDevices(deviceEntities: DeviceEntity[]): boolean {
  const deviceNames = new Set<string>();
  for (const device of deviceEntities) {
    const name = device.name.sanitized;
    if (deviceNames.has(name)) {
      console.error(
        chalk.red.bold(`❌ Duplicate device found: ${name}`),
      );
      return true;
    }
    deviceNames.add(name);
  }
  return false;
}
