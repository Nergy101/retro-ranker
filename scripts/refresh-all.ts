// deno-lint-ignore-file no-console
// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";

console.info(chalk.blue(" --- Refreshing all data --- "));

const denoCwd = Deno.cwd();

const getNewSourcesCommand = new Deno.Command(Deno.execPath(), {
  args: ["run", "--allow-all", `get-new-sources.ts`],
  cwd: ".",
});

const getNewSourcesProcess = getNewSourcesCommand.spawn();
const getNewSourcesStatus = await getNewSourcesProcess.status;
if (!getNewSourcesStatus.success) {
  Deno.exit(1);
}

console.info("");
const generateDevicesCommand = new Deno.Command("deno", {
  args: ["run", "--allow-all", "data-source.ts"],
  cwd: "../data/source",
});

const generateDevicesProcess = generateDevicesCommand.spawn();
const generateDevicesStatus = await generateDevicesProcess.status;
if (!generateDevicesStatus.success) {
  Deno.exit(1);
}

console.info("");
try {
  console.info("");
  console.info(chalk.blue("--- Optimizing images ---"));
  const optimizeImagesCommand = new Deno.Command("optimizt", {
    args: ["--webp", "../static/devices"],
    cwd: denoCwd,
  });

  const optimizeImagesProcess = optimizeImagesCommand.spawn();
  const optimizeImagesStatus = await optimizeImagesProcess.status;
  if (!optimizeImagesStatus.success) {
    Deno.exit(1);
  }

  console.info(chalk.green("Optimized images"));

  // Remove all .jpg files from static/devices folder
  console.info(chalk.blue("--- Removing .jpg files ---"));
  try {
    const devicesPath = "../static/devices";
    let jpgCount = 0;

    for await (const dirEntry of Deno.readDir(devicesPath)) {
      if (dirEntry.isFile && dirEntry.name.endsWith(".jpg")) {
        await Deno.remove(`${devicesPath}/${dirEntry.name}`);
        jpgCount++;
      }
    }

    console.info(chalk.green(`Removed ${jpgCount} .jpg files`));
  } catch (error) {
    console.error(chalk.red("Error removing .jpg files:"));
    console.error(error);
  }
} catch (error) {
  console.error(chalk.red("Error optimizing images, is optimizt installed?"));
  console.error(error);
}
console.info("");
const generateSitemapCommand = new Deno.Command(Deno.execPath(), {
  args: ["run", "--allow-all", "generate-sitemap.ts"],
  cwd: denoCwd,
});

const generateSitemapProcess = generateSitemapCommand.spawn();
const generateSitemapStatus = await generateSitemapProcess.status;
if (!generateSitemapStatus.success) {
  Deno.exit(1);
}

console.info(chalk.green("Generated sitemap"));

console.info("");
console.info(chalk.blue("--- Refreshing pocketbase ---"));

const refreshPocketbaseCommand = new Deno.Command(Deno.execPath(), {
  args: ["run", "--allow-all", "pocketbase-data-source.ts"],
  cwd: "../data/source",
});
const refreshPocketbaseProcess = refreshPocketbaseCommand.spawn();
const refreshPocketbaseStatus = await refreshPocketbaseProcess.status;
if (!refreshPocketbaseStatus.success) {
  Deno.exit(1);
}

console.info(chalk.green("✅Refreshed pocketbase"));

console.info("");
console.info(chalk.blue("--- Analyzing for duplicate devices ---"));

const analyzeDuplicatesCommand = new Deno.Command(Deno.execPath(), {
  args: ["run", "--allow-all", "analyze-duplicates.ts"],
  cwd: "../data/source",
});

const analyzeDuplicatesProcess = analyzeDuplicatesCommand.spawn();
const analyzeDuplicatesStatus = await analyzeDuplicatesProcess.status;
if (!analyzeDuplicatesStatus.success) {
  console.warn(
    chalk.yellow("⚠️  Duplicate analysis failed, but continuing..."),
  );
} else {
  console.info(chalk.green("✅ Duplicate analysis complete"));
}
