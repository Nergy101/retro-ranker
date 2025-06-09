// deno-lint-ignore-file no-console
import { Device } from "@data/frontend/contracts/device.model.ts";
import { navigationItems } from "@data/frontend/navigation-items.ts";
// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";

console.info(chalk.blue(" --- Generating sitemap --- "));
const SITE_URL = "https://retroranker.site";

const devices = JSON.parse(
  new TextDecoder().decode(
    await Deno.readFile("@data/source/results/handhelds.json"),
  ),
) as Device[];

const deviceNames = devices.map((device) => device.name.sanitized);

const staticUrls = navigationItems.map((item) => ({
  loc: `${SITE_URL}${item.href}`,
  priority: item.priority,
}));

const dynamicUrls = deviceNames.map((device) => ({
  loc: `${SITE_URL}/devices/${device}`,
  priority: null,
}));

const urls = [...staticUrls, ...dynamicUrls];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${
  urls
    .map(
      (url) => {
        if (url.priority !== null) {
          return `
        <url>
            <loc>${url.loc}</loc>
            <priority>${url.priority}</priority>
        </url>
        `;
        }
        return `
        <url>
            <loc>${url.loc}</loc>
        </url>
        `;
      },
    )
    .join("")
}
  </urlset>`;

// write to file as byte[]
const projectPathToStatic = "../static";
const sitemapPath = projectPathToStatic + "/sitemap.xml";

await Deno.writeFile(sitemapPath, new TextEncoder().encode(sitemap));

console.info(chalk.green("Sitemap generated successfully!"));
