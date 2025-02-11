import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { EmulationSystemOrder } from "../../enums/EmulationSystem.ts";
import { Device } from "../../device.model.ts";
import { mapHandheldsColumnToDevice } from "./device.parser.map.handheld.columns.ts";
import { mapOEMsColumnToDevice } from "./device.parser.map.oem.columns.ts";
import { DeviceService } from "../../../services/devices/device.service.ts";
import { slugify } from "https://deno.land/x/slugify@0.3.0/mod.ts";
import { Tag } from "../../models/tag.model.ts";
import { personalPicks } from "../../personal-picks.ts";

export class DeviceParser {
  public static parseHandheldsHtml(filePath: string): Device[] {
    const devices: Device[] = [];
    const text = Deno.readTextFileSync(filePath);
    const $ = cheerio.load(text);

    const table = $("tbody");
    if (!table.length) return devices;

    const rows = $("tr", table);
    const headers: string[] = [];

    // Get headers
    rows.first().find("td").each((_, el) => {
      const headerText = $(el).text().trim();
      if (headerText && !headerText.includes("Donations welcome")) {
        headers.push(headerText);
      }
    });

    // Process data rows (skip header)
    rows.slice(1).each((_, row) => {
      const device: Device = {
        name: {
          raw: "",
          sanitized: "",
          normalized: "",
        },
        os: {
          raw: "",
          list: [],
          icons: [],
          customFirmwares: [],
          links: [],
        },
        tags: [],
        brand: "",
        totalRating: 0,
        lowBatteryIndicator: null,
        hackingGuides: [],
        systemOnChip: null,
        architecture: null,
        ram: null,
        rumble: null,
        sensors: null,
        volumeControl: null,
        brightnessControl: null,
        powerControl: null,
        battery: {
          raw: null,
          capacity: null,
          unit: null,
        },
        chargePort: null,
        storage: null,
        dimensions: null,
        weight: null,
        shellMaterial: null,
        colors: [],
        image: {
          originalUrl: null,
          url: null,
          alt: null,
        },
        released: {
          raw: null,
          mentionedDate: null,
        },
        formFactor: null,
        systemRatings: [],
        connectivity: {
          hasWifi: null,
          hasBluetooth: null,
          hasNfc: null,
          hasUsb: null,
          hasUsbC: null,
        },
        cpus: [],
        gpus: [],
        performance: {
          tier: null,
          rating: null,
          normalizedRating: null,
          maxEmulation: null,
          emulationLimit: null,
        },
        screen: {
          size: null,
          type: null,
          resolution: null,
          ppi: null,
          aspectRatio: null,
          lens: null,
        },
        cooling: {
          raw: null,
          hasHeatsink: null,
          hasHeatPipe: null,
          hasFan: null,
          hasVentilationCutouts: null,
        },
        controls: {
          dPad: null,
          analogs: null,
          numberOfFaceButtons: null,
          shoulderButtons: null,
          extraButtons: null,
        },
        outputs: {
          videoOutput: null,
          audioOutput: null,
          speaker: null,
        },
        reviews: {
          videoReviews: [],
          writtenReviews: [],
        },

        pricing: {
          raw: null,
          average: null,
          range: {
            min: null,
            max: null,
          },
          currency: null,
          category: null,
          discontinued: null,
        },

        pros: [],
        cons: [],

        vendorLinks: [],
        notes: [],
      };

      $(row).find("td").each((colIndex, cell) => {
        if (colIndex === 0) {
          // get the image url
          const imageUrl = $(cell).find("img").attr("src");
          if (imageUrl) {
            device.image = {
              originalUrl: imageUrl,
              url: null, // set later
              alt: null, // set later
            };
          }
        }

        const vendorLinksColumns = [72, 73, 74, 75, 76];
        if (vendorLinksColumns.includes(colIndex)) {
          const hrefList: { url: string; name: string }[] = [];

          // Select all <a> elements and extract the href attributes
          $(cell).find("a").each((_, element) => {
            const href = $(element).attr("href");
            const name = $(element).text().trim() ??
              (href === undefined ? "Vendor" : new URL(href).hostname);
            if (href) {
              hrefList.push({ url: href, name });
            }
          });
          device.vendorLinks = [...device.vendorLinks, ...hrefList];
        }

        const videoReviewLinksColumns = [64, 65, 66, 67, 68];
        if (videoReviewLinksColumns.includes(colIndex)) {
          const hrefList: { url: string; name: string }[] = [];
          // Select all <a> elements and extract the href attributes
          $(cell).find("a").each((_, element) => {
            const href = $(element).attr("href");
            const name = $(element).text().trim() ??
              (href === undefined ? "Review" : new URL(href).hostname);
            if (href) {
              hrefList.push({ url: href, name });
            }
          });

          device.reviews.videoReviews = [
            ...device.reviews.videoReviews,
            ...hrefList,
          ];
        }

        if (colIndex === 69) {
          const hrefList: { url: string; name: string }[] = [];

          // Select all <a> elements and extract the href attributes
          $(cell).find("a").each((_, element) => {
            const href = $(element).attr("href");
            const name = $(element).text().trim() ??
              (href === undefined ? "Review" : new URL(href).hostname);

            if (href) {
              hrefList.push({ url: href, name });
            }
          });
          device.reviews.writtenReviews = [
            ...device.reviews.writtenReviews,
            ...hrefList,
          ];
        }
        // sortings

        // sort by rating number, then by system order (for readability)
        device.systemRatings = device.systemRatings.sort((a, b) => {
          if (a.ratingNumber === b.ratingNumber) {
            return EmulationSystemOrder[a.system] <
                EmulationSystemOrder[b.system]
              ? 1
              : -1;
          }

          return -((a.ratingNumber ?? 0) - (b.ratingNumber ?? 0));
        });

        const value = $(cell).text().trim();
        mapHandheldsColumnToDevice(colIndex, value, device);
      });

      device.connectivity.hasUsbC = device.connectivity.hasUsbC ||
        device.chargePort?.type === "USB-C" ||
        device.outputs.videoOutput?.hasUsbC ||
        device.outputs.audioOutput?.hasUsbC ||
        false;

      device.totalRating = DeviceService.calculateScore(device);

      device.tags = this.getTags(device);

      devices.push(device);
    });

    // filter out devices that have too much information missing
    return devices.filter((device) => {
      return (
        device.name.raw !== "" ||
        device.brand !== ""
      );
    });
  }

  public static parseOEMsHtml(filePath: string): Device[] {
    const devices: Device[] = [];
    const text = Deno.readTextFileSync(filePath);
    const $ = cheerio.load(text);

    const table = $("tbody");
    if (!table.length) return devices;

    const rows = $("tr", table);
    const headers: string[] = [];

    // Get headers
    rows.first().find("td").each((_, el) => {
      const headerText = $(el).text().trim();
      if (headerText && !headerText.includes("Donations welcome")) {
        headers.push(headerText);
      }
    });

    // Process data rows (skip header)
    rows.slice(1).each((_, row) => {
      const device: Device = {
        name: {
          raw: "",
          sanitized: "",
          normalized: "",
        },
        os: {
          raw: "",
          list: [],
          icons: [],
          customFirmwares: [],
          links: [],
        },
        tags: [],
        brand: "",
        totalRating: 0,
        lowBatteryIndicator: null,
        hackingGuides: [],
        systemRatings: [],
        systemOnChip: null,
        architecture: null,
        ram: null,
        rumble: null,
        sensors: null,
        volumeControl: null,
        brightnessControl: null,
        powerControl: null,
        battery: {
          raw: null,
          capacity: null,
          unit: null,
        },
        chargePort: null,
        storage: null,
        dimensions: null,
        weight: null,
        shellMaterial: null,
        colors: [],
        image: {
          originalUrl: null,
          url: null,
          alt: null,
        },
        released: {
          raw: null,
          mentionedDate: null,
        },
        formFactor: null,
        connectivity: {
          hasWifi: false,
          hasBluetooth: false,
          hasNfc: false,
          hasUsb: false,
          hasUsbC: false,
        },
        cpus: [],
        gpus: [],
        performance: {
          tier: null,
          rating: null,
          normalizedRating: null,
          maxEmulation: null,
          emulationLimit: null,
        },
        screen: {
          size: null,
          type: null,
          resolution: null,
          ppi: null,
          aspectRatio: null,
          lens: null,
        },
        cooling: {
          raw: null,
          hasHeatsink: null,
          hasHeatPipe: null,
          hasFan: null,
          hasVentilationCutouts: null,
        },
        controls: {
          dPad: null,
          analogs: null,
          numberOfFaceButtons: null,
          shoulderButtons: null,
          extraButtons: null,
        },
        outputs: {
          videoOutput: null,
          audioOutput: null,
          speaker: null,
        },
        reviews: {
          videoReviews: [],
          writtenReviews: [],
        },

        pricing: {
          raw: null,
          average: null,
          range: {
            min: null,
            max: null,
          },
          currency: null,
          category: null,
          discontinued: null,
        },

        pros: [],
        cons: [],

        vendorLinks: [],
        notes: [],
      };

      $(row).find("td").each((colIndex, cell) => {
        if (colIndex === 0) {
          // get the image url
          const imageUrl = $(cell).find("img").attr("src");
          if (imageUrl) {
            device.image = {
              originalUrl: imageUrl,
              url: null, // set later
              alt: null, // set later
            };
          }
        }

        if (colIndex === 61) {
          const hrefList: { url: string; name: string }[] = [];

          // Select all <a> elements and extract the href attributes
          $(cell).find("a").each((_, element) => {
            const href = $(element).attr("href");
            const name = $(element).text().trim() ??
              (href === undefined ? "Hacking guide" : new URL(href).hostname);
            if (href) {
              hrefList.push({ url: href, name });
            }
          });
          device.hackingGuides = [...device.hackingGuides, ...hrefList];
        }

        const videoReviewLinksColumns = [62, 63, 64, 65];
        if (videoReviewLinksColumns.includes(colIndex)) {
          const hrefList: { url: string; name: string }[] = [];

          // Select all <a> elements and extract the href attributes
          $(cell).find("a").each((_, element) => {
            const href = $(element).attr("href");
            const name = $(element).text().trim() ??
              (href === undefined ? "Review" : new URL(href).hostname);
            if (href) {
              hrefList.push({ url: href, name });
            }
          });
          device.reviews.videoReviews = [
            ...device.reviews.videoReviews,
            ...hrefList,
          ];
        }

        if (colIndex === 66) {
          const hrefList: { url: string; name: string }[] = [];

          // Select all <a> elements and extract the href attributes
          $(cell).find("a").each((_, element) => {
            const href = $(element).attr("href");
            const name = $(element).text().trim() ??
              (href === undefined ? "Review" : new URL(href).hostname);
            if (href) {
              hrefList.push({ url: href, name });
            }
          });
          device.reviews.writtenReviews = [
            ...device.reviews.writtenReviews,
            ...hrefList,
          ];
        }

        const vendorLinksColumns = [68, 69, 70, 71, 72];
        if (vendorLinksColumns.includes(colIndex)) {
          const hrefList: { url: string; name: string }[] = [];

          // Select all <a> elements and extract the href attributes
          $(cell).find("a").each((_, element) => {
            const href = $(element).attr("href");
            const name = $(element).text().trim() ??
              (href === undefined ? "Vendor" : new URL(href).hostname);
            if (href) {
              hrefList.push({ url: href, name });
            }
          });
          device.vendorLinks = [...device.vendorLinks, ...hrefList];
        }

        const value = $(cell).text().trim();
        mapOEMsColumnToDevice(colIndex, value, device);
      });

      // sort by rating number, then by system order (for readability)
      device.systemRatings = device.systemRatings.sort((a, b) => {
        if (a.ratingNumber === b.ratingNumber) {
          return EmulationSystemOrder[a.system] <
              EmulationSystemOrder[b.system]
            ? 1
            : -1;
        }

        return -((a.ratingNumber ?? 0) - (b.ratingNumber ?? 0));
      });

      device.connectivity.hasUsbC = device.connectivity.hasUsbC ||
        device.chargePort?.type === "USB-C" ||
        device.outputs.videoOutput?.hasUsbC ||
        device.outputs.audioOutput?.hasUsbC ||
        false;

      device.totalRating = DeviceService.calculateScore(device);

      device.tags = this.getTags(device);

      devices.push(device);
    });

    return devices;
  }

  private static getTags(device: Device): Tag[] {
    return [
      ...this.getOsTags(device),
      this.getBrandTag(device),
      this.getPriceTag(device),
      this.getFormFactorTag(device),
      this.getReleaseDateTag(device),
      this.getPersonalPickTag(device),
    ].filter((tag) => tag !== null) as Tag[];
  }

  private static getOsTags(device: Device): Tag[] {
    return device.os.list.map((tag) => {
      const slug = slugify(tag).toLowerCase();

      if (tag.toLowerCase().includes("steam")) {
        return { name: "Steam OS", slug: "steam-os", type: "os" } as Tag;
      }

      return { name: tag, slug, type: "os" } as Tag;
    });
  }

  private static getBrandTag(device: Device): Tag | null {
    if (device.brand === "") {
      return null;
    }

    return {
      name: device.brand,
      slug: slugify(device.brand).toLowerCase(),
      type: "brand",
    } as Tag;
  }

  private static getPriceTag(device: Device): Tag | null {
    const slug = slugify(device.pricing.category ?? "").toLowerCase();
    if (slug === "low") {
      return { name: "$", slug: "low", type: "price" } as Tag;
    }

    if (slug === "mid") {
      return { name: "$$", slug: "mid", type: "price" } as Tag;
    }

    if (slug === "high") {
      return { name: "$$$", slug: "high", type: "price" } as Tag;
    }

    if (slug === "unknown") {
      return { name: "$??", slug: "price-unknown", type: "price" } as Tag;
    }

    return null;
  }

  private static getFormFactorTag(device: Device): Tag | null {
    const slug = slugify(device.formFactor ?? "").toLowerCase();

    if (slug.includes("horizontal")) {
      return {
        name: "Horizontal",
        slug: "horizontal",
        type: "formFactor",
      } as Tag;
    }

    if (slug.includes("vertical")) {
      return { name: "Vertical", slug: "vertical", type: "formFactor" } as Tag;
    }

    if (slug.includes("clamshell")) {
      return {
        name: "Clamshell",
        slug: "clamshell",
        type: "formFactor",
      } as Tag;
    }

    if (device.formFactor === null) {
      return null;
    }

    return { name: device.formFactor, slug, type: "formFactor" } as Tag;
  }

  private static getReleaseDateTag(device: Device): Tag | null {
    if (device.released.raw?.toLowerCase().includes("upcoming")) {
      return { name: "Upcoming", slug: "upcoming", type: "releaseDate" } as Tag;
    }

    // get year from date otherwise null
    const year = new Date(device.released.mentionedDate ?? "").getFullYear();
    if (year) {
      return {
        name: year.toString(),
        slug: `year-${year}`,
        type: "releaseDate",
      } as Tag;
    }

    return null;
  }

  private static getPersonalPickTag(device: Device): Tag | null {
    if (personalPicks.includes(device.name.sanitized)) {
      return {
        name: "Personal Pick",
        slug: "personal-pick",
        type: "personalPick",
      } as Tag;
    }

    return null;
  }
}
