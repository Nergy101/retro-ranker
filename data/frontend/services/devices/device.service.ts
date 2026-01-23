// deno-lint-ignore-file no-console
import {
  createSuperUserPocketBaseService,
  PocketBaseService,
} from "../../../pocketbase/pocketbase.service.ts";
import { logJson } from "../../../tracing/tracer.ts";
import { Device } from "../../contracts/device.model.ts";
import { personalPicks } from "../../enums/personal-picks.ts";
import { TagModel } from "../../models/tag.model.ts";
import {
  DeviceHelpers,
  getPocketBaseImageUrl,
} from "../../helpers/device.helpers.ts";
import { RatingsService } from "./ratings.service.ts";

export class DeviceService {
  private pocketBaseService: PocketBaseService;
  private static instance: DeviceService;
  private devicesCache: { data: Device[]; timestamp: number } | null = null;
  private tagsCache: { data: TagModel[]; timestamp: number } | null = null;
  private readonly cacheDurationMs = 30 * 60 * 1000; // 30 minutes

  private constructor(pocketBaseService: PocketBaseService) {
    this.pocketBaseService = pocketBaseService;
  }

  /**
   * Enhances a raw PocketBase device record with the PocketBase image URL
   */
  // deno-lint-ignore no-explicit-any
  private enhanceDeviceWithImageUrl(rawDevice: any): Device {
    const deviceData = rawDevice.deviceData as Device;
    // Add PocketBase image URL if available
    if (rawDevice.deviceMainImage && deviceData.image) {
      deviceData.image.pocketbaseUrl = getPocketBaseImageUrl(
        rawDevice.id,
        rawDevice.deviceMainImage,
      );
    }
    return deviceData;
  }

  public static async getInstance(): Promise<DeviceService> {
    const startTime = performance.now();
    if (!DeviceService.instance) {
      logJson("debug", "Creating new DeviceService instance");

      try {
        const pbServiceStart = performance.now();
        const pbService = await createSuperUserPocketBaseService(
          Deno.env.get("POCKETBASE_SUPERUSER_EMAIL") || "",
          Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD") || "",
          Deno.env.get("POCKETBASE_URL") ||
            "https://pocketbase.retroranker.site",
        );
        const pbServiceEnd = performance.now();

        DeviceService.instance = new DeviceService(pbService);

        logJson("debug", "DeviceService Instance Created", {
          pbServiceTime: `${(pbServiceEnd - pbServiceStart).toFixed(2)}ms`,
          totalTime: `${(performance.now() - startTime).toFixed(2)}ms`,
        });
      } catch (error) {
        console.error("Failed to create DeviceService instance:", error);
        // Create a mock service or throw a more descriptive error
        throw new Error(
          `Failed to initialize DeviceService: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
      }
    } else {
      logJson("debug", "DeviceService Instance Retrieved from Cache", {
        totalTime: `${(performance.now() - startTime).toFixed(2)}ms`,
      });
    }
    return DeviceService.instance;
  }

  public async getAllDevices(forceRefresh = false): Promise<Device[]> {
    const startTime = performance.now();
    const now = Date.now();
    if (
      !forceRefresh && this.devicesCache &&
      now - this.devicesCache.timestamp < this.cacheDurationMs
    ) {
      logJson("debug", "getAllDevices - Cache Hit", {
        cacheAge: `${(now - this.devicesCache.timestamp).toFixed(2)}ms`,
        totalTime: `${(performance.now() - startTime).toFixed(2)}ms`,
        deviceCount: this.devicesCache.data.length,
      });
      return this.devicesCache.data;
    }

    logJson("debug", "getAllDevices - Cache Miss, Fetching from DB", {
      forceRefresh,
      cacheAge: this.devicesCache
        ? `${(now - this.devicesCache.timestamp).toFixed(2)}ms`
        : "no cache",
    });

    const dbStart = performance.now();
    const rawDevices = await this.pocketBaseService.getAll("devices");
    const data = rawDevices.map((device) =>
      this.enhanceDeviceWithImageUrl(device)
    );
    const dbEnd = performance.now();

    this.devicesCache = { data, timestamp: now };

    logJson("debug", "getAllDevices - Database Fetch Completed", {
      dbTime: `${(dbEnd - dbStart).toFixed(2)}ms`,
      totalTime: `${(performance.now() - startTime).toFixed(2)}ms`,
      deviceCount: data.length,
    });

    return data;
  }

  public async getAllTags(forceRefresh = false): Promise<TagModel[]> {
    const startTime = performance.now();
    const now = Date.now();
    if (
      !forceRefresh && this.tagsCache &&
      now - this.tagsCache.timestamp < this.cacheDurationMs
    ) {
      logJson("debug", "getAllTags - Cache Hit", {
        cacheAge: `${(now - this.tagsCache.timestamp).toFixed(2)}ms`,
        totalTime: `${(performance.now() - startTime).toFixed(2)}ms`,
        tagCount: this.tagsCache.data.length,
      });
      return this.tagsCache.data;
    }

    logJson("debug", "getAllTags - Cache Miss, Fetching from DB", {
      forceRefresh,
      cacheAge: this.tagsCache
        ? `${(now - this.tagsCache.timestamp).toFixed(2)}ms`
        : "no cache",
    });

    const dbStart = performance.now();
    const data = await this.pocketBaseService.getAll("tags");
    const dbEnd = performance.now();

    this.tagsCache = { data, timestamp: now };

    logJson("debug", "getAllTags - Database Fetch Completed", {
      dbTime: `${(dbEnd - dbStart).toFixed(2)}ms`,
      totalTime: `${(performance.now() - startTime).toFixed(2)}ms`,
      tagCount: data.length,
    });

    return data;
  }

  public async searchDevices(
    query: string,
    category: "all" | "low" | "mid" | "high" = "all",
    sortBy:
      | "all"
      | "highly-ranked"
      | "new-arrivals"
      | "high-low-price"
      | "low-high-price"
      | "alphabetical"
      | "reverse-alphabetical" = "all",
    filter:
      | "all"
      | "upcoming"
      | "personal-picks" = "all",
    tags: TagModel[] = [],
    pageNumber: number = 1,
    pageSize: number = 9,
  ): Promise<{ page: Device[]; totalAmountOfResults: number }> {
    const lowerQuery = query.toLowerCase();
    let filterString = "";

    // Build filter string based on category
    if (category !== "all") {
      filterString += `deviceData.pricing.category = "${category}"`;
    }

    // Add search query filter
    if (query) {
      if (filterString) filterString += " && ";
      filterString +=
        `(deviceData.name.sanitized ~ "${lowerQuery}" || deviceData.name.raw ~ "${lowerQuery}" || deviceData.brand.raw ~ "${lowerQuery}" || deviceData.os.raw ~ "${lowerQuery}")`;
    }

    // Add filter for upcoming devices
    if (filter === "upcoming") {
      if (filterString) filterString += " && ";
      filterString += `deviceData.released.raw ~ "upcoming"`;
    }

    // Add filter for personal picks
    if (filter === "personal-picks") {
      if (filterString) filterString += " && ";
      filterString += personalPicks.map((pick) => `id = "${pick}"`).join(
        " || ",
      );
    }

    // Add tag filters
    if (tags.length > 0) {
      if (filterString) filterString += " && ";
      filterString += `(${tags.map((tag) => `tags~"${tag.id}"`).join(" && ")})`;
    }

    // Build sort string
    let sortString = "";
    switch (sortBy) {
      case "new-arrivals":
        sortString = "-deviceData.released.mentionedDate";
        break;
      case "highly-ranked":
        sortString = "-totalRating";
        break;
      case "alphabetical":
        sortString = "deviceData.name.raw";
        break;
      case "reverse-alphabetical":
        sortString = "-deviceData.name.raw";
        break;
      case "high-low-price":
        sortString = "-deviceData.pricing.average";
        break;
      case "low-high-price":
        sortString = "deviceData.pricing.average";
        break;
      default:
        sortString = "-deviceData.released.mentionedDate";
    }

    const result = await this.pocketBaseService.getList(
      "devices",
      pageNumber,
      pageSize,
      {
        filter: filterString,
        sort: sortString,
        expand: "",
      },
    );

    return {
      page: result.items.map((device) =>
        this.enhanceDeviceWithImageUrl(device)
      ),
      totalAmountOfResults: result.totalItems,
    };
  }

  public async getDeviceByName(sanitizedName: string): Promise<Device | null> {
    const cached = await this.getAllDevices();
    const found = cached.find((d) => d.name.sanitized === sanitizedName);
    if (found) return found;

    const result = await this.pocketBaseService.getList(
      "devices",
      1,
      1,
      {
        filter: `deviceData.name.sanitized = "${sanitizedName}"`,
        sort: "",
        expand: "",
      },
    );
    const rawDevice = result.items[0];
    if (!rawDevice) return null;

    const device = this.enhanceDeviceWithImageUrl(rawDevice);
    const now = Date.now();
    // merge into cache if exists
    const devices = cached.concat(device).filter((d, idx, arr) =>
      arr.findIndex((e) => e.name.sanitized === d.name.sanitized) === idx
    );
    this.devicesCache = { data: devices, timestamp: now };
    return device;
  }

  public async getSimilarDevices(
    sanitizedName: string | null,
    limit: number = 4,
  ): Promise<Device[]> {
    if (!sanitizedName) return [];

    const currentDevice = await this.getDeviceByName(sanitizedName);
    if (!currentDevice) return [];

    const allDevices = await this.getAllDevices();
    return allDevices
      .filter((device) => device.name.sanitized !== sanitizedName)
      .sort((a, b) => {
        const scoreA = RatingsService.getSimilarityScore(a, currentDevice);
        const scoreB = RatingsService.getSimilarityScore(b, currentDevice);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  public async getPersonalPicks(amount: number = 5): Promise<Device[]> {
    const personalPickTag = await this.getTagBySlug("personal-pick");
    const personalPickTagId = personalPickTag!.id;

    const result = await this.pocketBaseService.getList(
      "devices",
      1,
      amount,
      {
        filter: `tags~"${personalPickTagId}"`,
        sort: "-deviceData.released.mentionedDate",
        expand: "",
      },
    );
    return result.items.map((device) => this.enhanceDeviceWithImageUrl(device));
  }

  public async getNewArrivals(amount: number = 5): Promise<Device[]> {
    const result = await this.pocketBaseService.getList(
      "devices",
      1,
      amount,
      {
        filter: "",
        sort: "-deviceData.released.mentionedDate",
        expand: "",
      },
    );
    return result.items.map((device) => this.enhanceDeviceWithImageUrl(device));
  }

  public async getUpcoming(amount: number = 5): Promise<Device[]> {
    // Get all upcoming devices first
    const allUpcomingResult = await this.pocketBaseService.getList(
      "devices",
      1,
      100, // Get a large number to ensure we have enough
      {
        filter: `deviceData.released ~ 'upcoming'`,
        sort: "",
        expand: "",
      },
    );

    const allUpcomingDevices = allUpcomingResult.items.map((device) =>
      this.enhanceDeviceWithImageUrl(device)
    );

    // Separate by device type
    const handheldDevices = allUpcomingDevices
      .filter((d) => d.deviceType === "handheld")
      .sort((a, b) => a.index - b.index); // descending

    const oemDevices = allUpcomingDevices
      .filter((d) => d.deviceType === "oem")
      .sort((a, b) => a.index - b.index); // ascending

    // Take first 3 handhelds
    const selectedHandhelds = handheldDevices.slice(0, 3);

    // Take first 2 OEMs
    const selectedOEMs = oemDevices.slice(0, 2);

    // If we don't have enough total devices, prioritize handhelds (non-OEM) to fill to 5
    let remainingSlots = amount - selectedHandhelds.length -
      selectedOEMs.length;
    let additionalHandhelds: Device[] = [];
    let additionalOEMs: Device[] = [];

    if (remainingSlots > 0) {
      // First, try to fill with more handhelds (non-OEM devices)
      if (selectedHandhelds.length < handheldDevices.length) {
        const handheldsNeeded = Math.min(
          remainingSlots,
          handheldDevices.length - selectedHandhelds.length,
        );
        additionalHandhelds = handheldDevices.slice(
          selectedHandhelds.length,
          selectedHandhelds.length + handheldsNeeded,
        );
        remainingSlots -= handheldsNeeded;
      }

      // If we still need more devices, fill with OEMs
      if (remainingSlots > 0 && selectedOEMs.length < oemDevices.length) {
        const oemsNeeded = Math.min(
          remainingSlots,
          oemDevices.length - selectedOEMs.length,
        );
        additionalOEMs = oemDevices.slice(
          selectedOEMs.length,
          selectedOEMs.length + oemsNeeded,
        );
      }
    }

    // Combine all results
    return [
      ...selectedHandhelds,
      ...additionalHandhelds,
      ...selectedOEMs,
      ...additionalOEMs,
    ];
  }

  public async getHighlyRated(amount: number = 5): Promise<Device[]> {
    const result = await this.pocketBaseService.getList(
      "devices",
      1,
      amount,
      {
        filter:
          `totalRating > 0 && pricing.category = "mid" && deviceData.released.raw!~"upcoming"`,
        sort: "-totalRating,-released",
        expand: "",
      },
    );
    return result.items.map((device) => this.enhanceDeviceWithImageUrl(device));
  }

  /**
   * Get top devices by price category for "Bang for your buck" section
   * Returns: 3 sweet spot ($100-$200), 5 mid ($$) in order
   */
  public async getBangForYourBuck(): Promise<Device[]> {
    const baseFilter =
      `totalRating > 0 && deviceData.released.raw!~"upcoming" && deviceData.deviceType = "handheld"`;

    const [sweetSpotResult, midResult] = await Promise.all([
      this.pocketBaseService.getList("devices", 1, 3, {
        filter:
          `${baseFilter} && pricing.average >= 100 && pricing.average <= 200`,
        sort: "-released,-totalRating",
        expand: "",
      }),
      this.pocketBaseService.getList("devices", 1, 5, {
        filter:
          `${baseFilter} && pricing.average > 200 && pricing.average <= 500`,
        sort: "-released,-totalRating",
        expand: "",
      }),
    ]);

    return [
      ...sweetSpotResult.items.map((d) => this.enhanceDeviceWithImageUrl(d)),
      ...midResult.items.map((d) => this.enhanceDeviceWithImageUrl(d)),
    ];
  }

  public async getTagBySlug(tagSlug: string): Promise<TagModel | null> {
    const tags = await this.getAllTags();
    const found = tags.find((t) => t.slug === tagSlug);
    if (found) return found;

    const result = await this.pocketBaseService.getList(
      "tags",
      1,
      1,
      {
        filter: `slug = "${tagSlug}"`,
        sort: "",
        expand: "",
      },
    );
    const tag = result.items[0] || null;
    if (tag) {
      const now = Date.now();
      const tagsMerged = tags.concat(tag).filter((t, i, arr) =>
        arr.findIndex((e) => e.id === t.id) === i
      );
      this.tagsCache = { data: tagsMerged, timestamp: now };
    }
    return tag;
  }

  public async getTagsBySlugs(slugs: string[]): Promise<TagModel[]> {
    const tags = await this.getAllTags();
    const filtered = tags.filter((t) => slugs.includes(t.slug));
    if (filtered.length === slugs.length) return filtered;

    const result = await this.pocketBaseService.getList(
      "tags",
      1,
      1,
      {
        filter: `slug ~ "${slugs.join(" || ")}"`,
        sort: "",
        expand: "",
      },
    );
    const resultItems = result.items;
    if (resultItems.length > 0) {
      const now = Date.now();
      const tagsMerged = tags.concat(...resultItems).filter((t, i, arr) =>
        arr.findIndex((e) => e.id === t.id) === i
      );
      this.tagsCache = { data: tagsMerged, timestamp: now };
    }
    return resultItems;
  }

  public static getPropertyIconByCharacter(
    char: "✅" | "❌" | "?" | string | null,
  ) {
    return DeviceHelpers.getPropertyIconByCharacter(char);
  }
}
