import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { EmulationSystemOrder } from "../../enums/EmulationSystem.ts";
import { Device } from "../../models/device.model.ts";
import { mapHandheldsColumnToDevice } from "./device.parser.map.handheld.columns.ts";
import { mapOEMsColumnToDevice } from "./device.parser.map.oem.columns.ts";

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
        brand: "",
        lowBatteryIndicator: null,
        hackingGuides: [],
        systemOnChip: null,
        architecture: null,
        ram: null,
        rumble: null,
        sensors: [],
        volumeControl: null,
        brightnessControl: null,
        powerControl: null,
        battery: null,
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
          hasNFC: null,
          hasUSB: null,
          hasUSBC: null,
          hasDisplayPort: null,
          hasVGA: null,
          hasDVI: null,
          hasHDMI: null,
        },
        cpu: {
          raw: null,
          names: [],
          cores: null,
          threads: null,
          clockSpeed: null,
        },
        gpu: {
          name: null,
          cores: null,
          clockSpeed: null,
        },
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
          analogs: [],
          faceButtons: [],
          shoulderButtons: [],
          extraButtons: [],
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
        brand: "",
        lowBatteryIndicator: null,
        hackingGuides: [],
        systemRatings: [],
        systemOnChip: null,
        architecture: null,
        ram: null,
        rumble: null,
        sensors: [],
        volumeControl: null,
        brightnessControl: null,
        powerControl: null,
        battery: null,
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
          hasNFC: false,
          hasUSB: false,
          hasUSBC: false,
          hasDisplayPort: false,
          hasVGA: false,
          hasDVI: false,
          hasHDMI: false,
        },
        cpu: {
          raw: null,
          names: [],
          cores: null,
          threads: null,
          clockSpeed: null,
        },
        gpu: {
          name: null,
          cores: null,
          clockSpeed: null,
        },
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
          analogs: [],
          faceButtons: [],
          shoulderButtons: [],
          extraButtons: [],
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

      devices.push(device);
    });

    return devices;
  }
}
