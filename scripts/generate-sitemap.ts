import { navigationItems } from "../data/navigation.ts";
import { DeviceService } from "../services/devices/device.service.ts";

const deviceService = DeviceService.getInstance();
const SITE_URL = "https://retroranker.site";
const devices = deviceService.getAllDevices();

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
await Deno.writeFile("static/sitemap.xml", new TextEncoder().encode(sitemap));
