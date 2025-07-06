#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Script to optimize translation files by compressing JSON structure
 */

const TRANSLATIONS_DIR = "./static/i18n";

async function optimizeTranslationFile(filePath: string) {
  try {
    // Read the original file
    const content = await Deno.readTextFile(filePath);
    const translations = JSON.parse(content);

    // Create optimized version (minified)
    const optimized = JSON.stringify(translations);

    // Write optimized version back
    await Deno.writeTextFile(filePath, optimized);

    const originalSize = content.length;
    const optimizedSize = optimized.length;
    const savings = ((originalSize - optimizedSize) / originalSize * 100)
      .toFixed(1);

    console.log(
      `✅ Optimized ${filePath}: ${originalSize} → ${optimizedSize} bytes (${savings}% smaller)`,
    );

    return { originalSize, optimizedSize, savings };
  } catch (error) {
    console.error(`❌ Failed to optimize ${filePath}:`, error);
    return null;
  }
}

async function main() {
  console.log("🚀 Starting translation optimization...\n");

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let filesProcessed = 0;

  // List of translation files to optimize
  const translationFiles = [
    "en-US.json",
    "en-GB.json",
    "de-DE.json",
    "fr-FR.json",
    "es-ES.json",
    "nl-NL.json",
    "pt-PT.json",
  ];

  // Process each translation file
  for (const fileName of translationFiles) {
    const filePath = `${TRANSLATIONS_DIR}/${fileName}`;
    const result = await optimizeTranslationFile(filePath);
    if (result) {
      totalOriginalSize += result.originalSize;
      totalOptimizedSize += result.optimizedSize;
      filesProcessed++;
    }
  }

  const totalSavings =
    ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100)
      .toFixed(1);

  console.log("\n📊 Optimization Summary:");
  console.log(`Files processed: ${filesProcessed}`);
  console.log(
    `Total original size: ${totalOriginalSize.toLocaleString()} bytes`,
  );
  console.log(
    `Total optimized size: ${totalOptimizedSize.toLocaleString()} bytes`,
  );
  console.log(`Total savings: ${totalSavings}%`);
  console.log(`\n✨ Translation optimization complete!`);
}

if (import.meta.main) {
  main().catch(console.error);
}
