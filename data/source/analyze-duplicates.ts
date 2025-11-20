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
  created: string;
  updated: string;
}

interface UserDataCounts {
  likes: number;
  favorites: number;
  comments: number;
  reviews: number;
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

// Get user data counts for a device
async function getUserDataCounts(deviceId: string): Promise<UserDataCounts> {
  const [likes, favorites, comments, reviews] = await Promise.all([
    pocketbaseClient.collection("device_likes").getFullList({
      filter: `device="${deviceId}"`,
    }),
    pocketbaseClient.collection("device_favorites").getFullList({
      filter: `device="${deviceId}"`,
    }),
    pocketbaseClient.collection("device_comments").getFullList({
      filter: `device="${deviceId}"`,
    }),
    pocketbaseClient.collection("device_reviews").getFullList({
      filter: `device="${deviceId}"`,
    }),
  ]);

  return {
    likes: likes.length,
    favorites: favorites.length,
    comments: comments.length,
    reviews: reviews.length,
  };
}

// Normalize device names for comparison
function normalizeForComparison(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") // Remove all non-alphanumeric characters
    .trim();
}

// Check if two normalized names represent version differences
function isVersionDifference(
  norm1: string,
  norm2: string,
  original1: string,
  original2: string,
): boolean {
  // Check for plus sign differences first (before normalization removes them)
  const hasPlus1 = original1.includes("+");
  const hasPlus2 = original2.includes("+");

  if (hasPlus1 !== hasPlus2) {
    // One has plus, the other doesn't - check if they're otherwise the same
    const base1 = original1.replace(/\+/g, "").toLowerCase().replace(
      /[^a-z0-9]/g,
      "",
    ).trim();
    const base2 = original2.replace(/\+/g, "").toLowerCase().replace(
      /[^a-z0-9]/g,
      "",
    ).trim();

    if (base1 === base2) {
      return true; // Same base name, one has plus - version difference
    }
  }

  // If one is a subset of the other, check for version indicators
  const shorter = norm1.length < norm2.length ? norm1 : norm2;
  const longer = norm1.length < norm2.length ? norm2 : norm1;

  // If the shorter name is contained in the longer name
  if (longer.includes(shorter)) {
    const remaining = longer.replace(shorter, "");

    // Check if the remaining part looks like a version indicator
    // Version indicators: single letters (X, S, Pro, Max, Plus, etc.)
    // Or numbers that could be version numbers
    const versionPatterns = [
      /^[a-z]$/, // Single letter (X, S, etc.)
      /^pro$/, // "pro"
      /^max$/, // "max"
      /^plus$/, // "plus"
      /^ultra$/, // "ultra"
      /^mini$/, // "mini"
      /^lite$/, // "lite"
      /^se$/, // "se"
      /^le$/, // "le"
      /^oled$/, // "oled"
      /^\d+$/, // Just numbers (like "08" vs "18")
      /^\d+[a-z]$/, // Number + letter (like "35xx" vs "35xxh")
      /^[a-z]\d+$/, // Letter + number (like "rs08" vs "rs18")
    ];

    // Check if the remaining part matches any version pattern
    for (const pattern of versionPatterns) {
      if (pattern.test(remaining)) {
        return true;
      }
    }
  }

  // Check for specific version difference patterns
  // Only consider it a version difference if there are actual content differences
  // not just formatting differences

  // ROG Ally vs ROG Ally X (one has X suffix)
  if (
    norm1.endsWith("x") && !norm2.endsWith("x") && norm1.slice(0, -1) === norm2
  ) {
    return true;
  }
  if (
    norm2.endsWith("x") && !norm1.endsWith("x") && norm2.slice(0, -1) === norm1
  ) {
    return true;
  }

  // Check for number variations at the end (like rs08 vs rs18)
  const numberSuffix1 = norm1.match(/\d+$/);
  const numberSuffix2 = norm2.match(/\d+$/);

  if (numberSuffix1 && numberSuffix2) {
    const base1 = norm1.replace(/\d+$/, "");
    const base2 = norm2.replace(/\d+$/, "");

    // If the bases are the same but numbers are different, it's a version difference
    if (base1 === base2 && numberSuffix1[0] !== numberSuffix2[0]) {
      return true;
    }
  }

  return false;
}

// Check if two devices are likely duplicates
function areLikelyDuplicates(
  device1: DeviceRecord,
  device2: DeviceRecord,
): { isDuplicate: boolean; reason: string; similarity: number } {
  // Same brand is required
  if (device1.brandSanitized !== device2.brandSanitized) {
    return { isDuplicate: false, reason: "Different brands", similarity: 0 };
  }

  const norm1 = normalizeForComparison(device1.nameRaw);
  const norm2 = normalizeForComparison(device2.nameRaw);

  // Calculate similarity
  const similarity = calculateSimilarity(norm1, norm2);

  // Exact match after normalization
  if (norm1 === norm2) {
    return {
      isDuplicate: true,
      reason: "Identical after normalization",
      similarity: 1.0,
    };
  }

  // Check for version differences - if one name is a subset of the other with version indicators
  if (isVersionDifference(norm1, norm2, device1.nameRaw, device2.nameRaw)) {
    return {
      isDuplicate: false,
      reason: "Version difference detected",
      similarity,
    };
  }

  // Very high similarity (95%+) - only for true formatting differences
  if (similarity >= 0.95) {
    return {
      isDuplicate: true,
      reason: `Very high similarity (${Math.round(similarity * 100)}%)`,
      similarity,
    };
  }

  // Check for common patterns like "rg35xx-pro" vs "rg-35xx-pro" (formatting only)
  const pattern1 = norm1.replace(/(\d+)/g, "$1").replace(
    /([a-z]+)(\d+)/g,
    "$1$2",
  );
  const pattern2 = norm2.replace(/(\d+)/g, "$1").replace(
    /([a-z]+)(\d+)/g,
    "$1$2",
  );

  if (pattern1 === pattern2 && similarity >= 0.90) {
    return {
      isDuplicate: true,
      reason: "Same pattern, different formatting",
      similarity,
    };
  }

  return {
    isDuplicate: false,
    reason: `Low similarity (${Math.round(similarity * 100)}%)`,
    similarity,
  };
}

// Utility function to calculate string similarity using Levenshtein distance
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null)
  );

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

// Main analysis function
async function analyzeDuplicates() {
  console.log(chalk.cyan.bold("\n🔍 Analyzing potential duplicate devices..."));
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

  const devices = await pocketbaseClient.collection("devices").getFullList({
    sort: "brandSanitized,nameSanitized",
    expand: "",
  }) as DeviceRecord[];

  console.log(chalk.blue(`Analyzing ${devices.length} devices...`));

  const potentialDuplicates: Array<{
    device1: DeviceRecord;
    device2: DeviceRecord;
    reason: string;
    similarity: number;
  }> = [];

  // Check all pairs of devices
  for (let i = 0; i < devices.length; i++) {
    for (let j = i + 1; j < devices.length; j++) {
      const device1 = devices[i];
      const device2 = devices[j];

      const { isDuplicate, reason, similarity } = areLikelyDuplicates(
        device1,
        device2,
      );

      if (isDuplicate) {
        potentialDuplicates.push({
          device1,
          device2,
          reason,
          similarity,
        });
      }
    }
  }

  // Sort by similarity (highest first)
  potentialDuplicates.sort((a, b) => b.similarity - a.similarity);

  console.log(
    chalk.green(
      `Found ${potentialDuplicates.length} potential duplicate pairs`,
    ),
  );
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));

  if (potentialDuplicates.length === 0) {
    console.log(chalk.green("✅ No potential duplicates found!"));
    return;
  }

  // Display results
  console.log(chalk.cyan.bold("📊 Potential Duplicate Pairs:"));
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

  for (const duplicate of potentialDuplicates) {
    const { device1, device2, reason, similarity } = duplicate;

    console.log(
      chalk.white.bold(
        `\n${device1.brandRaw} - ${device1.nameRaw} vs ${device2.nameRaw}`,
      ),
    );
    console.log(chalk.dim(`  IDs: ${device1.id} vs ${device2.id}`));
    console.log(chalk.dim(`  Reason: ${reason}`));
    console.log(chalk.dim(`  Similarity: ${Math.round(similarity * 100)}%`));

    // Get user data counts
    const [userData1, userData2] = await Promise.all([
      getUserDataCounts(device1.id),
      getUserDataCounts(device2.id),
    ]);

    const total1 = userData1.likes + userData1.favorites + userData1.comments +
      userData1.reviews;
    const total2 = userData2.likes + userData2.favorites + userData2.comments +
      userData2.reviews;

    console.log(
      chalk.blue(
        `  Device 1 user data: ${userData1.likes}L ${userData1.favorites}F ${userData1.comments}C ${userData1.reviews}R (${total1} total)`,
      ),
    );
    console.log(
      chalk.blue(
        `  Device 2 user data: ${userData2.likes}L ${userData2.favorites}F ${userData2.comments}C ${userData2.reviews}R (${total2} total)`,
      ),
    );

    // Suggest which device to keep
    const suggestedPrimary = total1 >= total2 ? device1 : device2;
    const suggestedSecondary = total1 >= total2 ? device2 : device1;

    console.log(
      chalk.green(
        `  💡 Suggested primary: ${suggestedPrimary.nameRaw} (more user data)`,
      ),
    );
    console.log(
      chalk.yellow(`  💡 Would merge into: ${suggestedSecondary.nameRaw}`),
    );
  }

  console.log(chalk.dim("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(chalk.cyan("💡 To merge these duplicates, run:"));
  console.log(
    chalk.cyan(
      "   deno run --allow-net --allow-read --allow-env data/source/merge-duplicate-devices.ts --execute",
    ),
  );
}

// Main execution
console.log(chalk.magenta.bold("\n🚀 Starting Duplicate Analysis"));
console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

const startTime = Date.now();

try {
  await analyzeDuplicates();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(chalk.magenta.bold("\n✨ Duplicate Analysis Complete"));
  console.log(chalk.dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(chalk.white(`Total time: ${duration} seconds`));
} catch (error) {
  console.error(chalk.red.bold("\n❌ Duplicate Analysis Failed"));
  console.error(chalk.red(error));
  Deno.exit(1);
}
