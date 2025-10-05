export type AchievementMetricKey =
  | "ownedDeviceCount"
  | "collectionCount"
  | "favoritesCount"
  | "commentCount"
  | "reviewCount"
  | "commentReplyCount"
  | "commentReactionCount";

export interface AchievementMetrics {
  ownedDeviceCount: number;
  collectionCount: number;
  favoritesCount: number;
  commentCount: number;
  reviewCount: number;
  commentReplyCount: number;
  commentReactionCount: number;
}

interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  metric: AchievementMetricKey;
  threshold: number;
  lockedHint?: string;
  unlockedMessage?: string;
}

export interface AchievementStatus extends AchievementDefinition {
  unlocked: boolean;
  currentValue: number;
  progress: number;
  progressLabel: string;
  progressPercentage: number;
  remaining: number;
  statusText: string;
}

const METRIC_LABELS: Record<
  AchievementMetricKey,
  { singular: string; plural: string }
> = {
  ownedDeviceCount: { singular: "device", plural: "devices" },
  collectionCount: { singular: "collection", plural: "collections" },
  favoritesCount: { singular: "favorite", plural: "favorites" },
  commentCount: { singular: "comment", plural: "comments" },
  reviewCount: { singular: "review", plural: "reviews" },
  commentReplyCount: { singular: "reply", plural: "replies" },
  commentReactionCount: { singular: "reaction", plural: "reactions" },
};

const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: "collection-first-device",
    name: "Pocket Pal",
    description: "Own your very first handheld by adding it to a collection.",
    icon: "🎒",
    category: "Collector",
    metric: "ownedDeviceCount",
    threshold: 1,
    lockedHint: "Add your first device to any collection to get started.",
    unlockedMessage: "Welcome to the retro guild!",
  },
  {
    id: "collection-five-devices",
    name: "Shelf Starter",
    description: "Curate five unique devices across your collections.",
    icon: "🗃️",
    category: "Collector",
    metric: "ownedDeviceCount",
    threshold: 5,
    lockedHint: "Add {remaining} more {unit} to your shelf to level up.",
    unlockedMessage: "Your handheld shelf is starting to shine!",
  },
  {
    id: "collection-ten-devices",
    name: "Retro Librarian",
    description: "Gather ten unique devices in your collections.",
    icon: "🏛️",
    category: "Collector",
    metric: "ownedDeviceCount",
    threshold: 10,
    lockedHint: "Only {remaining} more {unit} until your archive is legendary.",
    unlockedMessage: "You've built a retro vault!",
  },
  {
    id: "collection-first",
    name: "Playlist Pioneer",
    description: "Create your very first custom collection.",
    icon: "🗂️",
    category: "Curator",
    metric: "collectionCount",
    threshold: 1,
    lockedHint: "Start a collection to show off your taste.",
    unlockedMessage: "You just curated your first lineup!",
  },
  {
    id: "collection-trio",
    name: "Box Set Builder",
    description: "Spin up three themed collections of your own.",
    icon: "🎁",
    category: "Curator",
    metric: "collectionCount",
    threshold: 3,
    lockedHint: "Draft {remaining} more {unit} to complete the set.",
    unlockedMessage: "Your curation instincts are kicking in!",
  },
  {
    id: "collection-legend",
    name: "Shelf Maestro",
    description:
      "Maintain five personal collections for the community to enjoy.",
    icon: "🎼",
    category: "Curator",
    metric: "collectionCount",
    threshold: 5,
    lockedHint: "Orchestrate {remaining} more {unit} to master the shelf.",
    unlockedMessage: "You're orchestrating a retro symphony!",
  },
  {
    id: "favorite-first",
    name: "Heart Spark",
    description: "Favorite a device you can't stop thinking about.",
    icon: "❤️",
    category: "Curator",
    metric: "favoritesCount",
    threshold: 1,
    lockedHint: "Tap the heart on any device to save it for later.",
    unlockedMessage: "You've marked your very first fave!",
  },
  {
    id: "comment-first",
    name: "Chatty Cartridge",
    description: "Leave your first comment on a device page.",
    icon: "💬",
    category: "Community",
    metric: "commentCount",
    threshold: 1,
    lockedHint: "Share a quick thought to unlock this emblem.",
    unlockedMessage: "Thanks for joining the conversation!",
  },
  {
    id: "comment-five",
    name: "Thread Spinner",
    description: "Post five thoughtful comments across the site.",
    icon: "🧵",
    category: "Community",
    metric: "commentCount",
    threshold: 5,
    lockedHint: "Weave {remaining} more {unit} into the discussion.",
    unlockedMessage: "You're keeping the discussion lively!",
  },
  {
    id: "comment-twenty",
    name: "Forum Firestarter",
    description: "Spark twenty conversations with your comments.",
    icon: "🔥",
    category: "Community",
    metric: "commentCount",
    threshold: 20,
    lockedHint: "Ignite {remaining} more {unit} to set the forum ablaze.",
    unlockedMessage: "You're a certified hype machine!",
  },
  {
    id: "review-first",
    name: "Critic Mode",
    description: "Publish your first device review.",
    icon: "⭐",
    category: "Community",
    metric: "reviewCount",
    threshold: 1,
    lockedHint: "Write a review to share your verdict with the crew.",
    unlockedMessage: "You're officially a Retro Ranker critic!",
  },
  {
    id: "review-three",
    name: "Score Keeper",
    description: "Publish three reviews to guide fellow collectors.",
    icon: "🎯",
    category: "Community",
    metric: "reviewCount",
    threshold: 3,
    lockedHint: "Compose {remaining} more {unit} to boost your critic cred.",
    unlockedMessage: "You're building a trusted review reel!",
  },
  {
    id: "review-seven",
    name: "Arcade Analyst",
    description: "Drop seven reviews packed with retro wisdom.",
    icon: "🕹️",
    category: "Community",
    metric: "reviewCount",
    threshold: 7,
    lockedHint: "Break down {remaining} more {unit} for the leaderboard.",
    unlockedMessage: "Your insights keep the meta fresh!",
  },
  {
    id: "reply-first",
    name: "Echo Starter",
    description: "Reply to someone else's comment to keep the chat rolling.",
    icon: "🔁",
    category: "Community",
    metric: "commentReplyCount",
    threshold: 1,
    lockedHint: "Drop a reply to loop someone back in.",
    unlockedMessage: "Conversation: continued!",
  },
  {
    id: "reply-ten",
    name: "Thread Weaver",
    description: "Write ten replies that keep discussions alive.",
    icon: "🕸️",
    category: "Community",
    metric: "commentReplyCount",
    threshold: 10,
    lockedHint: "Spin {remaining} more {unit} to connect the dots.",
    unlockedMessage: "You're a master of follow-ups!",
  },
  {
    id: "reaction-first",
    name: "High Five Hive",
    description: "React to a comment to show some quick love.",
    icon: "🙌",
    category: "Community",
    metric: "commentReactionCount",
    threshold: 1,
    lockedHint: "Tap a reaction to cheer someone on.",
    unlockedMessage: "You just made someone's day!",
  },
  {
    id: "reaction-fifty",
    name: "Hype Conductor",
    description: "Fire off fifty reactions to fuel the hype train.",
    icon: "🚂",
    category: "Community",
    metric: "commentReactionCount",
    threshold: 50,
    lockedHint: "Send {remaining} more {unit} to keep spirits high.",
    unlockedMessage: "You wield emoji energy like a pro!",
  },
];

function buildProgressLabel(
  metric: AchievementMetricKey,
  value: number,
  threshold: number,
  unlocked: boolean,
): string {
  const unit = threshold === 1
    ? METRIC_LABELS[metric].singular
    : METRIC_LABELS[metric].plural;
  const displayedValue = unlocked ? threshold : Math.min(value, threshold);
  return `${displayedValue} / ${threshold} ${unit}`;
}

function formatHint(
  template: string | undefined,
  remaining: number,
  metric: AchievementMetricKey,
): string {
  if (remaining <= 0) {
    return "Unlocked!";
  }

  const units = METRIC_LABELS[metric];
  const unitWord = remaining === 1 ? units.singular : units.plural;

  if (!template) {
    return `Only ${remaining} more ${unitWord} to go!`;
  }

  return template
    .replaceAll("{remaining}", remaining.toString())
    .replaceAll("{unit}", unitWord);
}

function ensureMetrics(
  metrics: Partial<AchievementMetrics>,
): AchievementMetrics {
  return {
    ownedDeviceCount: 0,
    collectionCount: 0,
    favoritesCount: 0,
    commentCount: 0,
    reviewCount: 0,
    commentReplyCount: 0,
    commentReactionCount: 0,
    ...metrics,
  };
}

/**
 * Build the achievement board for a profile page.
 * The calculation is purely front-end for now, but the unlocked achievement IDs
 * are designed to plug into a future PocketBase collection.
 */
export function buildAchievementBoard(
  metrics: Partial<AchievementMetrics>,
  unlockedAchievementIds: string[] = [],
): AchievementStatus[] {
  const normalizedMetrics = ensureMetrics(metrics);

  return ACHIEVEMENT_DEFINITIONS
    .map((definition) => {
      const currentValue = normalizedMetrics[definition.metric] ?? 0;
      const unlockedByProgress = currentValue >= definition.threshold;
      const unlockedManually = unlockedAchievementIds.includes(definition.id);
      const unlocked = unlockedByProgress || unlockedManually;
      const progressValue = unlocked
        ? definition.threshold
        : Math.min(currentValue, definition.threshold);
      const progressPercentage = definition.threshold === 0 ? 100 : Math.min(
        100,
        Math.round((progressValue / definition.threshold) * 100),
      );
      const remaining = Math.max(0, definition.threshold - currentValue);
      const statusText = unlocked
        ? definition.unlockedMessage ?? "Unlocked!"
        : formatHint(definition.lockedHint, remaining, definition.metric);

      return {
        ...definition,
        unlocked,
        currentValue,
        progress: progressValue,
        progressLabel: buildProgressLabel(
          definition.metric,
          currentValue,
          definition.threshold,
          unlocked,
        ),
        progressPercentage,
        remaining,
        statusText,
      } as AchievementStatus;
    })
    .sort((a, b) => {
      if (a.unlocked !== b.unlocked) {
        return a.unlocked ? -1 : 1;
      }
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.threshold - b.threshold;
    });
}
