import { getAllDevices } from "../data/device.service.ts";
import { navigationItems } from "../data/navigation.ts";

const SITE_URL = "https://retroranker.site";
const devices = getAllDevices();

const deviceNames = devices.map((device) => device.sanitizedName);

const staticUrls = navigationItems.map((item) => ({
  loc: `${SITE_URL}${item.href}`,
  lastmod: "2025-01-15", // Replace with actual last modification date if available
}));

const dynamicUrls = deviceNames.map((device) => ({
  loc: `${SITE_URL}/devices/${device}`,
  lastmod: "2025-01-15", // Replace with actual last modification date if available
}));

const urls = [...staticUrls, ...dynamicUrls];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${
  urls
    .map(
      (url) => `
    <url>
      <loc>${url.loc}</loc>
      <lastmod>${url.lastmod}</lastmod>
    </url>`,
    )
    .join("")
}
  </urlset>`;

console.log(sitemap);
// write to file as byte[]
await Deno.writeFile("static/sitemap.xml", new TextEncoder().encode(sitemap));
