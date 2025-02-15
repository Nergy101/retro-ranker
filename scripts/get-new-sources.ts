// deno-lint-ignore-file no-console
// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";
import { extract } from "jsr:@quentinadam/zip";

console.info(chalk.blue(" --- Getting new sources --- "));

const sourceDownloadUrl =
  `https://docs.google.com/spreadsheets/d/1irg60f9qsZOkhp0cwOU7Cy4rJQeyusEUzTNQzhoTYTU/export?format=zip&id=1irg60f9qsZOkhp0cwOU7Cy4rJQeyusEUzTNQzhoTYTU`;

console.info(chalk.blue(`Downloading sources from: ${sourceDownloadUrl}`));

const zipDownloadedFromUrl = await fetch(sourceDownloadUrl);
const zip = await zipDownloadedFromUrl.arrayBuffer();

// save zip to local file
const zipPath = "sources.zip";
const extractPath = "../data/source/files";

// create extractPath if it doesn't exist
await Deno.mkdir(extractPath, { recursive: true });
console.info(chalk.blue(`Created extract path: ${extractPath}`));

await Deno.writeFile(zipPath, new Uint8Array(zip));
console.info(chalk.blue(`Saved zip to: ${extractPath}/${zipPath}`));

try {
  const buffer = await Deno.readFile("./sources.zip");

  for (const { name, data } of await extract(buffer)) {
    if (name === "Handhelds.html" || name === "OEM.html") {
      await Deno.writeFile(`${extractPath}/${name}`, data, {
        create: true,
      });
      console.info(chalk.blue(`Saved ${name}`));
    }
  }
} finally {
  await Deno.remove(zipPath);
  console.info(chalk.blue(`Removed zip file: ${zipPath}`));
}

console.info(chalk.green(`Saved Handhelds.html and OEM.html!`));
