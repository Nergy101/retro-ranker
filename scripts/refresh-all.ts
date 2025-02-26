// deno-lint-ignore-file no-console
// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";

console.info(chalk.blue(" --- Refreshing all data --- "));

const denoCwd = Deno.cwd();
console.log("cwd", denoCwd);

const getNewSourcesCommand = new Deno.Command(Deno.execPath(), {
  args: ["run", "--allow-all", `scripts/get-new-sources.ts`],
  cwd: "..",
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
const scrapeImagesCommand = new Deno.Command(Deno.execPath(), {
  args: ["run", "--allow-all", "scrape-images.ts"],
  cwd: denoCwd,
});

const scrapeImagesProcess = scrapeImagesCommand.spawn();
const scrapeImagesStatus = await scrapeImagesProcess.status;
if (!scrapeImagesStatus.success) {
  Deno.exit(1);
}

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

// console.info("");
// console.info(chalk.blue("--- Deleting png images ---"));

// // Get all files in the devices directory
// for (const file of Deno.readDirSync("../static/devices")) {
//   // Check if file ends with .png
//   if (file.name.endsWith(".png")) {
//     // Remove the file
//     Deno.removeSync(`../static/devices/${file.name}`);
//   }
// }

// console.info(chalk.green("Deleted png images"));

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
