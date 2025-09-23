// deno-lint-ignore-file no-console no-explicit-any
import { load } from "@std/dotenv";
import { createSuperUserPocketBaseService } from "../pocketbase/pocketbase.service.ts";

// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";

interface DeviceRecord {
  id: string;
  nameRaw: string;
  nameSanitized: string;
  brandRaw: string;
  brandSanitized: string;
  released: string;
  totalRating: number;
  deviceData: any;
  created: string;
  updated: string;
}

interface MergePair {
  primaryDeviceId: string;
  duplicateDeviceId: string;
}

interface UserDataRecord {
  id: string;
  device: string;
  user?: string;
  [key: string]: any;
}

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

// Define merge pairs here - easy to fill with device IDs
const MERGE_PAIRS: MergePair[] = [
  // Example format:
  // { primaryDeviceId: "abc123", duplicateDeviceId: "def456" },
  // { primaryDeviceId: "xyz789", duplicateDeviceId: "uvw012" },
];

// Get device by ID
async function getDeviceById(deviceId: string): Promise<DeviceRecord | null> {
  try {
    const device = await pocketbaseClient.collection("devices").getOne(
      deviceId,
    );
    return device as unknown as DeviceRecord;
  } catch (error) {
    console.error(chalk.red(`❌ Failed to fetch device ${deviceId}: ${error}`));
    return null;
  }
}

// Get user data for a device
async function getUserDataForDevice(deviceId: string): Promise<{
  likes: UserDataRecord[];
  favorites: UserDataRecord[];
  comments: UserDataRecord[];
  reviews: UserDataRecord[];
}> {
  const [likes, favorites, comments, reviews] = await Promise.all([
    pocketbaseClient.collection("device_likes").getFullList({
      filter: `device="${deviceId}"`,
    }) as Promise<UserDataRecord[]>,
    pocketbaseClient.collection("device_favorites").getFullList({
      filter: `device="${deviceId}"`,
    }) as Promise<UserDataRecord[]>,
    pocketbaseClient.collection("device_comments").getFullList({
      filter: `device="${deviceId}"`,
    }) as Promise<UserDataRecord[]>,
    pocketbaseClient.collection("device_reviews").getFullList({
      filter: `device="${deviceId}"`,
    }) as Promise<UserDataRecord[]>,
  ]);

  return { likes, favorites, comments, reviews };
}

// Merge a single device pair
async function mergeDevicePair(
  pair: MergePair,
  dryRun: boolean = true,
): Promise<boolean> {
  const { primaryDeviceId, duplicateDeviceId } = pair;

  // Get both devices
  const [primaryDevice, duplicateDevice] = await Promise.all([
    getDeviceById(primaryDeviceId),
    getDeviceById(duplicateDeviceId),
  ]);

  if (!primaryDevice) {
    console.error(chalk.red(`❌ Primary device ${primaryDeviceId} not found`));
    return false;
  }

  if (!duplicateDevice) {
    console.error(
      chalk.red(`❌ Duplicate device ${duplicateDeviceId} not found`),
    );
    return false;
  }

  console.log(
    chalk.yellow.bold(
      `\n📱 Merging: ${duplicateDevice.nameRaw} → ${primaryDevice.nameRaw}`,
    ),
  );
  console.log(
    chalk.dim(`Primary: ${primaryDevice.nameRaw} (${primaryDevice.id})`),
  );
  console.log(
    chalk.dim(`Duplicate: ${duplicateDevice.nameRaw} (${duplicateDevice.id})`),
  );

  if (dryRun) {
    console.log(chalk.blue("🔍 DRY RUN - No changes will be made"));
    return true;
  }

  // Get user data from duplicate device
  const userData = await getUserDataForDevice(duplicateDeviceId);

  console.log(
    chalk.blue(
      `  Found user data: ${userData.likes.length} likes, ${userData.favorites.length} favorites, ${userData.comments.length} comments, ${userData.reviews.length} reviews`,
    ),
  );

  // Update user data to point to primary device
  const updateUserData = async (
    collection: string,
    records: UserDataRecord[],
  ) => {
    for (const record of records) {
      await pocketbaseClient.collection(collection).update(record.id, {
        device: primaryDeviceId,
      });
    }
  };

  await Promise.all([
    updateUserData("device_likes", userData.likes),
    updateUserData("device_favorites", userData.favorites),
    updateUserData("device_comments", userData.comments),
    updateUserData("device_reviews", userData.reviews),
  ]);

  // Delete duplicate device
  await pocketbaseClient.collection("devices").delete(duplicateDeviceId);
  console.log(
    chalk.red(`  Deleted: ${duplicateDevice.nameRaw} (${duplicateDevice.id})`),
  );

  console.log(
    chalk.green(
      `  ✅ Successfully merged ${duplicateDevice.nameRaw} into ${primaryDevice.nameRaw}`,
    ),
  );

  return true;
}

// Main execution
async function main() {
  console.log(chalk.magenta.bold("\n🚀 Starting Device Duplicate Merger"));
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

  const startTime = Date.now();
  const args = Deno.args;
  const dryRun = !args.includes("--execute");

  // Use the predefined merge pairs
  const mergePairs = MERGE_PAIRS;

  if (mergePairs.length === 0) {
    console.error(chalk.red("❌ No merge pairs defined"));
    console.error(
      chalk.yellow(
        "Please add device ID pairs to the MERGE_PAIRS array in the script.",
      ),
    );
    console.error(
      chalk.yellow(
        "Format: { primaryDeviceId: 'abc123', duplicateDeviceId: 'def456' }",
      ),
    );
    Deno.exit(1);
  }

  if (dryRun) {
    console.log(
      chalk.yellow("🔍 Running in DRY RUN mode - no changes will be made"),
    );
    console.log(chalk.yellow("Use --execute flag to perform actual merges"));
  } else {
    console.log(
      chalk.red("⚠️  EXECUTE mode - changes will be made to the database"),
    );
  }

  console.log(
    chalk.cyan.bold(
      `\n📊 Found ${mergePairs.length} merge pair(s) to process:`,
    ),
  );
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

  for (const pair of mergePairs) {
    console.log(
      chalk.white(`• ${pair.duplicateDeviceId} → ${pair.primaryDeviceId}`),
    );
  }

  try {
    let successCount = 0;
    let failureCount = 0;

    console.log(chalk.cyan.bold("\n🔄 Starting merge process..."));

    for (const pair of mergePairs) {
      const success = await mergeDevicePair(pair, dryRun);
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(chalk.magenta.bold("\n✨ Merge process complete!"));
    console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

    if (successCount > 0) {
      console.log(
        chalk.green(`✅ Successfully processed ${successCount} merge pair(s)`),
      );
    }

    if (failureCount > 0) {
      console.log(
        chalk.red(`❌ Failed to process ${failureCount} merge pair(s)`),
      );
    }

    console.log(chalk.white(`Total time: ${duration} seconds`));

    if (dryRun) {
      console.log(
        chalk.blue(
          "\n🔍 This was a dry run. Use --execute to perform the actual merges.",
        ),
      );
    }
  } catch (error) {
    console.error(chalk.red.bold("\n❌ Merge process failed"));
    console.error(chalk.red(error));
    Deno.exit(1);
  }
}

// Run the script
await main();
