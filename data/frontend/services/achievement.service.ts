import {
  createSuperUserPocketBaseService,
  PocketBaseService,
} from "../../pocketbase/pocketbase.service.ts";
import {
  AchievementMetrics,
  buildAchievementBoard,
} from "../helpers/achievement.helpers.ts";

export class AchievementService {
  private pb: PocketBaseService;

  constructor(pb?: PocketBaseService) {
    // If no service provided, we'll create our own superuser service
    this.pb = pb!;
  }

  private async getSuperUserService(): Promise<PocketBaseService> {
    if (this.pb) {
      return this.pb;
    }

    return await createSuperUserPocketBaseService(
      Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
      Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
      Deno.env.get("POCKETBASE_URL")!,
    );
  }

  /**
   * Check and unlock achievements for a user based on their current metrics
   */
  async checkAndUnlockAchievements(userId: string): Promise<string[]> {
    try {
      console.log(`Checking achievements for user: ${userId}`);

      const pb = await this.getSuperUserService();

      // Get user's current metrics
      const metrics = await this.getUserMetrics(userId);
      console.log("User metrics:", metrics);

      // Get currently unlocked achievements
      const unlockedAchievementIds = await this.getUnlockedAchievementIds(
        userId,
      );
      console.log("Currently unlocked achievements:", unlockedAchievementIds);

      // Build achievement board to see which achievements should be unlocked
      const achievements = buildAchievementBoard(
        metrics,
        unlockedAchievementIds,
      );

      // Find newly unlocked achievements
      const newlyUnlocked = achievements
        .filter((achievement) =>
          achievement.unlocked &&
          !unlockedAchievementIds.includes(achievement.id)
        )
        .map((achievement) => achievement.id);

      console.log("Newly unlocked achievements:", newlyUnlocked);

      // Unlock new achievements
      const unlockedIds: string[] = [];
      for (const achievementId of newlyUnlocked) {
        try {
          console.log(`Unlocking achievement: ${achievementId}`);
          await pb.create("user_achievements", {
            user: userId,
            achievement: achievementId,
          });
          unlockedIds.push(achievementId);
          console.log(`Successfully unlocked: ${achievementId}`);
        } catch (error) {
          console.error(
            `Failed to unlock achievement ${achievementId}:`,
            error,
          );
        }
      }

      console.log(`Total unlocked: ${unlockedIds.length} achievements`);
      return unlockedIds;
    } catch (error) {
      console.error("Failed to check achievements:", error);
      return [];
    }
  }

  /**
   * Get user's current achievement metrics
   */
  async getUserMetrics(userId: string): Promise<AchievementMetrics> {
    const pb = await this.getSuperUserService();

    const [
      collections,
      favoritedDevices,
      commentCount,
      reviewCount,
      replyCount,
      reactionCount,
    ] = await Promise.all([
      this.getUserCollections(userId, pb),
      this.getUserFavorites(userId, pb),
      this.getUserCommentCount(userId, pb),
      this.getUserReviewCount(userId, pb),
      this.getUserReplyCount(userId, pb),
      this.getUserReactionCount(userId, pb),
    ]);

    const ownedDeviceIds = new Set(
      collections.flatMap((collection) =>
        collection.devices.map((d: any) => d.id)
      ),
    );

    return {
      ownedDeviceCount: ownedDeviceIds.size,
      collectionCount: collections.length,
      favoritesCount: favoritedDevices.length,
      commentCount,
      reviewCount,
      commentReplyCount: replyCount,
      commentReactionCount: reactionCount,
    };
  }

  private async getUserCollections(userId: string, pb: PocketBaseService) {
    try {
      const collections = await pb.getList(
        "device_collections",
        1,
        100,
        {
          filter: `owner = "${userId}"`,
          expand: "devices",
          sort: "-created",
        },
      );
      return collections.items.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        devices: (c.expand?.devices ?? []).map((d: any) => ({
          id: d.id,
          name: d.name,
        })),
        deviceCount: (c.expand?.devices ?? []).length,
      }));
    } catch (error) {
      console.error("Failed to fetch user collections:", error);
      return [];
    }
  }

  private async getUserFavorites(userId: string, pb: PocketBaseService) {
    try {
      const favorites = await pb.getList(
        "device_favorites",
        1,
        100,
        {
          filter: `user = "${userId}"`,
          expand: "device",
          sort: "-created",
        },
      );
      return favorites.items.map((f: any) => f.expand?.device);
    } catch (error) {
      console.error("Failed to fetch user favorites:", error);
      return [];
    }
  }

  private async getUserCommentCount(
    userId: string,
    pb: PocketBaseService,
  ): Promise<number> {
    try {
      const comments = await pb.getList(
        "device_comments",
        1,
        1,
        {
          filter: `user = "${userId}" && parent_comment = ""`,
          sort: "-created",
          expand: "",
        },
      );
      return comments.totalItems ?? comments.items.length ?? 0;
    } catch (error) {
      console.error("Failed to fetch user comment count:", error);
      return 0;
    }
  }

  private async getUserReviewCount(
    userId: string,
    pb: PocketBaseService,
  ): Promise<number> {
    try {
      console.log(`Fetching review count for user: ${userId}`);
      const reviews = await pb.getList(
        "device_reviews",
        1,
        1,
        {
          filter: `user = "${userId}"`,
          sort: "-created",
          expand: "",
        },
      );
      const count = reviews.totalItems ?? reviews.items.length ?? 0;
      console.log(`Found ${count} reviews for user ${userId}`);
      return count;
    } catch (error) {
      console.error("Failed to fetch user review count:", error);
      return 0;
    }
  }

  private async getUserReplyCount(
    userId: string,
    pb: PocketBaseService,
  ): Promise<number> {
    try {
      const replies = await pb.getList(
        "device_comments",
        1,
        1,
        {
          filter: `user = "${userId}" && parent_comment != ""`,
          sort: "-created",
          expand: "",
        },
      );
      return replies.totalItems ?? replies.items.length ?? 0;
    } catch (error) {
      console.error("Failed to fetch user reply count:", error);
      return 0;
    }
  }

  private async getUserReactionCount(
    userId: string,
    pb: PocketBaseService,
  ): Promise<number> {
    try {
      const reactions = await pb.getList(
        "comment_reactions",
        1,
        1,
        {
          filter: `user = "${userId}"`,
          sort: "-created",
          expand: "",
        },
      );
      return reactions.totalItems ?? reactions.items.length ?? 0;
    } catch (error) {
      console.error("Failed to fetch user reaction count:", error);
      return 0;
    }
  }

  private async getUnlockedAchievementIds(userId: string): Promise<string[]> {
    try {
      const pb = await this.getSuperUserService();
      const result = await pb.getList(
        "user_achievements",
        1,
        200,
        {
          filter: `user = "${userId}"`,
          sort: "-created",
          expand: "",
        },
      );
      return result.items.map((record) => record.achievement);
    } catch (error) {
      console.error("Failed to fetch unlocked achievements:", error);
      return [];
    }
  }
}
