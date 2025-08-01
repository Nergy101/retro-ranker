import { slugify } from "https://deno.land/x/slugify@0.3.0/mod.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { Device } from "../../frontend/contracts/device.model.ts";
import { EmulationSystemOrder } from "../../frontend/enums/emulation-system.ts";
import { personalPicks } from "../../frontend/enums/personal-picks.ts";
import { TagModel } from "../../frontend/models/tag.model.ts";
import { ScoreCalculatorService } from "../../frontend/services/devices/score-calculator.service.ts";
import { mapHandheldsColumnToDevice } from "./device.parser.map.handheld.columns.ts";
import { mapOEMsColumnToDevice } from "./device.parser.map.oem.columns.ts";

export class DeviceParser {
  public static parseHandheldsHtml(fileContent: string): Device[] {
    const devices: Device[] = [];
    const $ = cheerio.load(fileContent);

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
    rows.slice(1).each((rowIndex, row) => {
      const device: Device = {
        id: "",
        index: rowIndex,
        name: {
          raw: "",
          sanitized: "",
          normalized: "",
        },
        brand: {
          raw: "",
          sanitized: "",
          normalized: "",
        },
        os: {
          raw: "",
          list: [],
          icons: [],
          customFirmwares: [],
        },
        tags: [],
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
          pngUrl: null,
          webpUrl: null,
          alt: null,
        },
        released: {
          raw: null,
          mentionedDate: null,
        },
        formFactor: null,
        systemRatings: [],
        deviceType: "handheld",
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
              pngUrl: null, // set later
              webpUrl: null, // set later
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

      device.totalRating = Number(
        ScoreCalculatorService.calculateScore(device).toFixed(2),
      );

      device.tags = this.getTags(device);

      devices.push(device);
    });

    // filter out devices that have too much information missing
    return devices.filter((device) => device.brand.raw !== "Unknown" // && device.name.raw !== "Unknown"
    );
  }

  public static parseOEMsHtml(fileContent: string): Device[] {
    const devices: Device[] = [];
    const $ = cheerio.load(fileContent);

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
    rows.slice(1).each((rowIndex, row) => {
      const device: Device = {
        id: "",
        index: rowIndex,
        name: {
          raw: "",
          sanitized: "",
          normalized: "",
        },
        brand: {
          raw: "",
          sanitized: "",
          normalized: "",
        },
        os: {
          raw: "",
          list: [],
          icons: [],
          customFirmwares: [],
        },
        tags: [],
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
          pngUrl: null,
          webpUrl: null,
          alt: null,
        },
        released: {
          raw: null,
          mentionedDate: null,
        },
        formFactor: null,
        deviceType: "oem",
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
              pngUrl: null, // set later
              webpUrl: null, // set later
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

      device.totalRating = Number(
        ScoreCalculatorService.calculateScore(device).toFixed(2),
      );

      device.tags = this.getTags(device);

      devices.push(device);
    });

    return devices.filter((device) => device.brand.raw !== "Unknown" // && device.name.raw !== "Unknown"
    );
  }

  private static getTags(device: Device): TagModel[] {
    const tags: (TagModel | null)[] = [
      ...this.getOsTags(device),
      this.getBrandTag(device),
      this.getPriceTag(device),
      this.getFormFactorTag(device),
      this.getScreenTypeTag(device),
      this.getReleaseDateTag(device),
      this.getPersonalPickTag(device),
    ];

    // Add device type tags
    if (device.deviceType === "oem") {
      tags.push({
        name: "OEM",
        slug: "oem",
        type: "deviceType",
      } as TagModel);
    } else if (device.deviceType === "handheld") {
      tags.push({
        name: "Handheld",
        slug: "handheld",
        type: "deviceType",
      } as TagModel);
    }

    return tags.filter((tag) =>
      tag !== null &&
      tag.slug !== "" &&
      tag.name !== "?"
    ) as TagModel[];
  }

  private static getOsTags(device: Device): TagModel[] {
    const tags: TagModel[] = [];

    for (const tag of device.os.list) {
      const slug = slugify(tag).toLowerCase();

      if (slug.includes("android")) {
        tags.push({ name: "Android", slug: "android", type: "os" } as TagModel);
        continue;
      }

      if (tag.toLowerCase().includes("steam")) {
        tags.push(
          { name: "Steam OS", slug: "steam-os", type: "os" } as TagModel,
        );
        continue;
      }

      if (tag.toLowerCase().includes("batocera")) {
        tags.push(
          { name: "Batocera", slug: "batocera", type: "os" } as TagModel,
        );
        continue;
      }

      if (tag.toLowerCase().includes("arkos")) {
        tags.push(
          { name: "ArkOS", slug: "arkos", type: "os" } as TagModel,
        );
        continue;
      }

      if (tag.toLowerCase().includes("emuelec")) {
        tags.push(
          { name: "EmuELEC", slug: "emuelec", type: "os" } as TagModel,
        );
        continue;
      }

      if (tag.toLowerCase().includes("onion")) {
        tags.push(
          { name: "Onion OS", slug: "onion-os", type: "os" } as TagModel,
        );
        continue;
      }

      if (tag.toLowerCase().includes("kinhank")) {
        tags.push(
          { name: "KinHank", slug: "kinhank", type: "os" } as TagModel,
        );
        continue;
      }

      if (tag.toLowerCase().includes("open source proprietary")) {
        tags.push(
          {
            name: "Open Source Proprietary",
            slug: "open-source-proprietary",
            type: "os",
          } as TagModel,
        );
        continue;
      }

      if (slug.includes("linux")) {
        tags.push({ name: "Linux", slug: "linux", type: "os" } as TagModel);

        if (slug.includes("(")) {
          // get name between ( and )
          const name = slug.split("(")[1].split(")")[0];
          if (name !== "linux") {
            tags.push({ name, slug: `linux-${name}`, type: "os" } as TagModel);
          }
        }
        continue;
      }

      tags.push({ name: tag, slug, type: "os" } as TagModel);
    }

    return tags;
  }

  private static getBrandTag(device: Device): TagModel | null {
    if (device.brand.raw === "") {
      return null;
    }

    if (device.brand.raw.toLowerCase().includes("dingoo")) {
      return {
        name: "Dingoo Technology",
        slug: "dingoo-technology",
        type: "brand",
      } as TagModel;
    }

    return {
      name: device.brand.raw,
      slug: device.brand.sanitized,
      type: "brand",
    } as TagModel;
  }

  private static getPriceTag(device: Device): TagModel | null {
    const slug = slugify(device.pricing.category ?? "").toLowerCase();
    if (slug === "low") {
      return { name: "$", slug: "low", type: "price" } as TagModel;
    }

    if (slug === "mid") {
      return { name: "$$", slug: "mid", type: "price" } as TagModel;
    }

    if (slug === "high") {
      return { name: "$$$", slug: "high", type: "price" } as TagModel;
    }

    if (slug === "unknown") {
      return { name: "$??", slug: "price-unknown", type: "price" } as TagModel;
    }

    return null;
  }

  private static getFormFactorTag(device: Device): TagModel | null {
    const slug = slugify(device.formFactor ?? "").toLowerCase();

    if (slug.includes("micro")) {
      return {
        name: "Micro",
        slug: "micro",
        type: "formFactor",
      } as TagModel;
    }

    if (slug.includes("horizontal")) {
      return {
        name: "Horizontal",
        slug: "horizontal",
        type: "formFactor",
      } as TagModel;
    }

    if (slug.includes("vertical")) {
      return {
        name: "Vertical",
        slug: "vertical",
        type: "formFactor",
      } as TagModel;
    }

    if (slug.includes("clamshell")) {
      return {
        name: "Clamshell",
        slug: "clamshell",
        type: "formFactor",
      } as TagModel;
    }

    if (slug.includes("landscape")) {
      return {
        name: "Landscape",
        slug: "landscape",
        type: "formFactor",
      } as TagModel;
    }

    if (slug.includes("portrait")) {
      return {
        name: "Portrait",
        slug: "portrait",
        type: "formFactor",
      } as TagModel;
    }

    if (device.formFactor === null) {
      return null;
    }

    return { name: device.formFactor, slug, type: "formFactor" } as TagModel;
  }

  private static getScreenTypeTag(device: Device): TagModel | null {
    const slug = slugify(device.screen?.type?.type ?? "").toLowerCase();

    if (slug.includes("ips")) {
      return { name: "IPS", slug: "ips", type: "screenType" } as TagModel;
    }

    if (slug.includes("ads")) {
      return { name: "ADS", slug: "ads", type: "screenType" } as TagModel;
    }

    if (slug.includes("hips")) {
      return { name: "HIPS", slug: "hips", type: "screenType" } as TagModel;
    }

    if (slug.includes("oled")) {
      return { name: "OLED", slug: "oled", type: "screenType" } as TagModel;
    }

    if (slug.includes("monochrome-oled")) {
      return {
        name: "Monochrome OLED",
        slug: "monochrome-oled",
        type: "screenType",
      } as TagModel;
    }

    if (slug.includes("lcd")) {
      return { name: "LCD", slug: "lcd", type: "screenType" } as TagModel;
    }

    if (slug.includes("ltps")) {
      return { name: "LTPS", slug: "ltps", type: "screenType" } as TagModel;
    }

    if (slug.includes("tft")) {
      return { name: "TFT", slug: "tft", type: "screenType" } as TagModel;
    }

    if (slug.includes("amoled")) {
      return { name: "AMOLED", slug: "amoled", type: "screenType" } as TagModel;
    }
    return null;
  }

  private static getReleaseDateTag(device: Device): TagModel | null {
    if (device.released.raw?.toLowerCase().includes("upcoming")) {
      return {
        name: "Upcoming",
        slug: "upcoming",
        type: "releaseDate",
      } as TagModel;
    }

    // get year from date otherwise null
    const year = new Date(device.released.mentionedDate ?? "").getFullYear();
    if (year) {
      return {
        name: year.toString(),
        slug: `year-${year}`,
        type: "releaseDate",
      } as TagModel;
    }

    return null;
  }

  private static getPersonalPickTag(device: Device): TagModel | null {
    if (personalPicks.includes(device.name.sanitized)) {
      return {
        name: "Personal Pick",
        slug: "personal-pick",
        type: "personalPick",
      } as TagModel;
    }

    return null;
  }
}
