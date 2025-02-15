// deno-lint-ignore-file no-console
// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";

console.info(chalk.blue(" --- Refreshing all data --- "));

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
  cwd: Deno.cwd(),
});

const scrapeImagesProcess = scrapeImagesCommand.spawn();
const scrapeImagesStatus = await scrapeImagesProcess.status;
if (!scrapeImagesStatus.success) {
  Deno.exit(1);
}

console.info("");
const generateSitemapCommand = new Deno.Command(Deno.execPath(), {
  args: ["run", "--allow-all", "generate-sitemap.ts"],
  cwd: Deno.cwd(),
});

const generateSitemapProcess = generateSitemapCommand.spawn();
const generateSitemapStatus = await generateSitemapProcess.status;
if (!generateSitemapStatus.success) {
  Deno.exit(1);
}
