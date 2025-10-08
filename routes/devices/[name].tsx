import {
  PiCalendarCheck,
  PiCalendarSlash,
  PiChatCircleText,
  PiQuestion,
  PiStar,
} from "@preact-icons/pi";
import { Context, page } from "fresh";
import { DeviceCardMedium } from "../../components/cards/device-card-medium.tsx";
import { DeviceReviewCard } from "../../components/cards/device-review-card.tsx";
import { DeviceLinks } from "../../components/devices/device-links.tsx";
import { EmulationPerformance } from "../../components/devices/emulation-performance.tsx";
import { StarRating } from "../../components/ratings/star-rating.tsx";
import { CurrencyIcon } from "../../components/shared/currency-icon.tsx";
import { TagComponent } from "../../components/shared/tag-component.tsx";
import { DeviceSpecs } from "../../components/specifications/device-specs.tsx";
import { SummaryTable } from "../../components/specifications/tables/summary-table.tsx";
import { CommentContract } from "../../data/frontend/contracts/comment.contract.ts";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { ReviewContract } from "../../data/frontend/contracts/review.contract.ts";
import { User } from "../../data/frontend/contracts/user.contract.ts";
import { BrandWebsites } from "../../data/frontend/enums/brand-websites.ts";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import { createSuperUserPocketBaseService } from "../../data/pocketbase/pocketbase.service.ts";
import { CustomFreshState } from "../../interfaces/state.ts";
import { BackButton } from "../../islands/buttons/back-button.tsx";
import { ClipboardButton } from "../../islands/buttons/clipboard-button.tsx";
import { CompareButton } from "../../islands/buttons/compare-button.tsx";
import { ShareButton } from "../../islands/buttons/share-button.tsx";
import { DevicesSimilarRadarChart } from "../../islands/charts/devices-similar-radar-chart.tsx";
import { generateDeviceColors } from "../../data/frontend/services/utils/chart-colors.utils.ts";
import { AddDeviceCommentForm } from "../../islands/forms/add-device-comment-form.tsx";
import { AddDeviceReviewForm } from "../../islands/forms/add-device-review-form.tsx";
import { CommentThread } from "../../islands/comments/comment-thread.tsx";
import { DeviceHelpers } from "../../data/frontend/helpers/device.helpers.ts";

export const handler = {
  async GET(ctx: Context<CustomFreshState>) {
    const deviceId = ctx.params.name;
    const user = (ctx.state as CustomFreshState).user as User | null;

    const pb = await createSuperUserPocketBaseService(
      Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
      Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
      Deno.env.get("POCKETBASE_URL")!,
    );

    const likes = await pb.getAll(
      "device_likes",
      {
        filter: `device="${deviceId}"`,
        expand: "",
        sort: "",
      },
    );

    let userLiked = false;
    let userFavorited = false;
    if (user) {
      const userLike = await pb.getList(
        "device_likes",
        1,
        1,
        {
          filter: `device="${deviceId}" && user="${user.id}"`,
          sort: "",
          expand: "",
        },
      );
      userLiked = userLike.items.length > 0;
      const userFavorite = await pb.getList(
        "device_favorites",
        1,
        1,
        {
          filter: `device="${deviceId}" && user="${user.id}"`,
          sort: "",
          expand: "",
        },
      );
      userFavorited = userFavorite.items.length > 0;
    }

    // Get top-level comments (no parent) with their user and reactions
    const topLevelComments = (await pb.getList(
      "device_comments",
      1,
      100,
      {
        filter: `device="${deviceId}" && parent_comment=""`,
        sort: "-created",
        expand: "user,reactions.user",
      },
    )).items;

    // For each top-level comment, get its replies recursively
    const comments = await Promise.all(
      topLevelComments.map(async (comment) => {
        const loadReplies = async (
          parentId: string,
          depth = 0,
        ): Promise<any[]> => {
          if (depth > 3) return []; // Prevent infinite recursion

          const replies = (await pb.getList(
            "device_comments",
            1,
            100,
            {
              filter: `parent_comment="${parentId}"`,
              sort: "-created",
              expand: "user,reactions.user",
            },
          )).items;

          // Recursively load nested replies
          const nestedReplies = await Promise.all(
            replies.map(async (reply) => ({
              ...reply,
              expand: {
                ...reply.expand,
                replies: await loadReplies(reply.id, depth + 1),
              },
            })),
          );

          return nestedReplies;
        };

        const replies = await loadReplies(comment.id);
        return {
          ...comment,
          expand: {
            ...comment.expand,
            replies,
          },
        };
      }),
    );

    const reviews = (await pb.getList(
      "device_reviews",
      1,
      100,
      {
        filter: `device="${deviceId}"`,
        sort: "-created",
        expand: "user",
      },
    )).items;

    // Get total favorites count
    const favorites = await pb.getAll(
      "device_favorites",
      {
        filter: `device="${deviceId}"`,
        expand: "",
        sort: "",
      },
    );

    const jsonLdForDevice = (device: Device | null) => {
      if (!device) return "";

      return JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": device.name.raw,
        "brand": {
          "@type": "Brand",
          "name": device.brand.raw,
        },
        "image": device.image?.pngUrl ?? "/images/placeholder-100x100.svg",
        "description":
          `${device.name.raw} is a ${device.brand.raw} retro gaming handheld device. This ${device.pricing.category} budget emulation device costs on average ${device.pricing.average} ${device.pricing.currency}. Features include ${
            device.ram?.sizes?.[0]
          } ${device.ram?.unit} RAM, ${device.storage} storage, and ${device.battery.capacity}${device.battery.unit} battery.`,
        "offers": device.vendorLinks.length > 0
          ? device.vendorLinks.map((link) => ({
            "@type": "Offer",
            "url": link.url,
            "price": device.pricing?.average ?? "0",
            "priceCurrency": device.pricing?.currency ?? "USD",
            "priceSpecification": {
              "price": device.pricing?.average ?? "0",
              "priceCurrency": device.pricing?.currency ?? "USD",
            },
          }))
          : {
            "@type": "AggregateOffer",
            "offerCount": device.vendorLinks.length,
            "lowPrice": device.pricing.range?.min ?? 0,
            "highPrice": device.pricing.range?.max ?? 0,
            "priceCurrency": device.pricing?.currency ?? "USD",
          },
        "manufacturer": {
          "@type": "Organization",
          "name": device.brand.raw,
          "brand": {
            "@type": "Brand",
            "name": device.brand.raw,
          },
        },
        "releaseDate": device.released.mentionedDate
          ? new Date(device.released.mentionedDate).toISOString().split("T")[0]
          : "Unknown",
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "RAM",
            "value": device.ram?.sizes?.join(", ") + " " + device.ram?.unit,
          },
          {
            "@type": "PropertyValue",
            "name": "Storage",
            "value": device.storage,
          },
          {
            "@type": "PropertyValue",
            "name": "Battery",
            "value": device.battery.capacity + " " + device.battery.unit,
          },
          {
            "@type": "PropertyValue",
            "name": "Operating System",
            "value": device.os.list.join(", "),
          },
          {
            "@type": "PropertyValue",
            "name": "Form Factor",
            "value": device.formFactor,
          },
          {
            "@type": "PropertyValue",
            "name": "Screen Size",
            "value": device.screen.size
              ? `${device.screen.size} inches`
              : "Unknown",
          },
        ],
      });
    };

    const getReleaseDate = (
      deviceReleased: { raw: string | null; mentionedDate: Date | null },
    ): {
      date: string;
      icon: () => any;
      expected: boolean;
    } => {
      if (!deviceReleased.raw) {
        return {
          date: "Unknown",
          icon: () => <PiQuestion />,
          expected: false,
        };
      }

      if (deviceReleased.mentionedDate) {
        return {
          date: new Date(deviceReleased.mentionedDate).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            },
          ),
          icon: () => <PiCalendarCheck />,
          expected: false,
        };
      }

      return {
        date: deviceReleased.raw,
        icon: () => <PiCalendarSlash />,
        expected: deviceReleased.raw.toLowerCase().includes("upcoming"),
      };
    };

    const deviceService = await DeviceService.getInstance();
    const device = await deviceService.getDeviceByName(deviceId);
    const similarDevices = (await deviceService.getSimilarDevices(
      device?.name.sanitized ?? null,
    )).sort((a, b) => b.totalRating - a.totalRating);

    const releaseDate = getReleaseDate(
      device?.released ?? {
        raw: null,
        mentionedDate: null,
      },
    );

    (ctx.state as CustomFreshState).seo = {
      title:
        `Retro Ranker - ${device?.name.raw} - ${device?.brand.raw} Gaming Handheld`,
      description:
        `${device?.name.raw} by ${device?.brand.raw}: ${device?.pricing.category} budget retro gaming handheld with ${
          device?.ram?.sizes?.[0]
        } ${device?.ram?.unit} RAM, ${device?.storage} storage, and ${device?.battery.capacity}${device?.battery.unit} battery. Release: ${
          releaseDate.expected ? "Expected" : releaseDate.date
        }. ${
          device?.os.list.join(", ") !== "?"
            ? `Supports ${device?.os.list.join(", ")}.`
            : ""
        } Compare specs and performance ratings.`,
      keywords: `${device?.name.raw}, ${device?.brand.raw}, ${
        device?.os.list.join(", ")
      }, retro gaming handheld, emulation device, portable gaming, ${device?.pricing.category} budget, retro console, handheld emulator`,
      image: `https://retroranker.site${device?.image?.pngUrl ?? undefined}`,
      url: `https://retroranker.site${ctx.url.pathname}`,
      jsonLd: jsonLdForDevice(device),
    };

    (ctx.state as CustomFreshState).data = {
      user: (ctx.state as CustomFreshState).user,
      likesCount: likes.length,
      userLiked,
      userFavorited,
      device,
      similarDevices,
      comments,
      reviews,
      releaseDate,
      totalFavorites: favorites.length,
    };

    return page(ctx);
  },
};

export default function DeviceDetail(ctx: Context<CustomFreshState>) {
  const data = (ctx.state as CustomFreshState).data;
  const translations = (ctx.state as CustomFreshState).translations ?? {};
  const user = (ctx.state as CustomFreshState).user as User | null;
  const likesCount = data.likesCount;
  const userLiked = data.userLiked;
  const userFavorited = data.userFavorited;
  const device = data.device as Device | null;
  const similarDevices = data.similarDevices as Device[];
  const comments = data.comments as CommentContract[];
  const reviews = data.reviews || [];
  const releaseDate = data.releaseDate;

  if (!device) {
    return (
      <div>
        <article>
          <header>
            <h1>
              Device Not Found "{ctx.params?.name}"
            </h1>
          </header>
          <p>
            The device you're looking for doesn't exist or has been removed.
          </p>
          <footer>
            <a href="/devices" role="button">
              Return to Devices
            </a>
          </footer>
        </article>
      </div>
    );
  }

  const brandWebsite = BrandWebsites[
    device.brand.sanitized.toLowerCase() as keyof typeof BrandWebsites
  ];

  return (
    <div class="device-detail">
      <div class="device-detail-header">
        <BackButton />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 .5rem",
          }}
        >
          <h2
            style={{
              padding: "0",
              margin: "0",
              color: "var(--pico-primary)",
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              gap: "0.5rem",
            }}
            data-tooltip={device.name.normalized != device.name.raw
              ? device.name.raw
              : undefined}
            data-placement="bottom"
          >
            {device.name.normalized}
          </h2>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "flex-end",
            }}
          >
            <span
              style={{ textAlign: "center" }}
              data-tooltip={device.brand.raw === device.brand.normalized
                ? undefined
                : device.brand.raw}
            >
              {brandWebsite
                ? (
                  <a
                    href={brandWebsite}
                    target="_blank"
                    rel="noopener"
                  >
                    {device.brand.normalized}
                  </a>
                )
                : (
                  device.brand.normalized
                )}
            </span>
          </div>
          <div>
            {device.image?.originalUrl
              ? (
                <img
                  loading="lazy"
                  src={device.image?.webpUrl ??
                    "/images/placeholder-100x100.svg"}
                  width={100}
                  height={100}
                  alt={device.image?.alt ??
                    "Device Image"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              )
              : (
                <span
                  data-tooltip="No image available"
                  data-placement="bottom"
                >
                  <img
                    src="/images/placeholder-100x100.svg"
                    width={100}
                    height={100}
                    alt="Device Image"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "contain",
                      borderRadius: "1em",
                    }}
                  />
                </span>
              )}
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <StarRating device={device} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
              }}
            >
              {!device.pricing.discontinued && device.pricing.average
                ? (
                  <span
                    style={{
                      color: "var(--pico-color)",
                      display: "inline-flex",
                      alignItems: "flex-end",
                    }}
                    data-tooltip={`${device.pricing.category}: 
                ${device.pricing.range?.min}-${device.pricing.range?.max} 
                ${device.pricing.currency}`}
                    data-placement="bottom"
                  >
                    <CurrencyIcon currencyCode={device.pricing.currency} />
                    <span style={{ lineHeight: "normal", fontSize: "0.9rem" }}>
                      {device.pricing.average}
                    </span>
                  </span>
                )
                : (
                  <span
                    style={{ display: "flex" }}
                    data-tooltip="No pricing information available"
                  >
                    <CurrencyIcon currencyCode="USD" />
                    <PiQuestion />
                  </span>
                )}

              <span
                style={{
                  display: "flex",
                  gap: "0.25rem",
                  fontSize: "1.2rem",
                  marginTop: "0.5rem",
                }}
                data-tooltip={device.os.list.join(", ") === "?"
                  ? "No OS information available"
                  : device.os.list.join(", ")}
              >
                {device.os.icons.map((icon) =>
                  DeviceHelpers.getOsIconComponent(icon)
                )}
              </span>
            </div>

            <span
              style={{
                color: "var(--pico-color)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                paddingTop: "0.25rem",
              }}
            >
              {releaseDate.icon()}

              {releaseDate.expected ? "Expected" : releaseDate.date}
            </span>
          </div>
        </div>
        <div class="device-detail-actions">
          <ClipboardButton
            url={`https://retroranker.site/devices/${device.name.sanitized}`}
          />
          <ShareButton
            title={device.name.raw}
            shareTitle={`Check out ${device.name.raw} on RetroRanker`}
            url={`https://retroranker.site/devices/${device.name.sanitized}`}
          />
          <CompareButton deviceName={device.name.sanitized} />
        </div>
      </div>

      <div class="device-detail-radar-chart">
        <DevicesSimilarRadarChart
          device={device}
          similarDevices={similarDevices}
          showTitle={false}
          translations={translations}
        />
      </div>

      <div class="device-detail-performance">
        <h3
          style={{
            textAlign: "center",
            padding: 0,
            margin: "1rem 0",
          }}
        >
          Tags
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "center",
          }}
        >
          {device.tags.map((tag) => (
            <TagComponent
              key={tag.name}
              tag={tag}
            />
          ))}
        </div>
        <EmulationPerformance
          device={device}
          user={user}
          likes={likesCount}
          isLiked={userLiked}
          userFavorited={userFavorited}
          totalComments={comments.reduce((total, comment) => {
            const countReplies = (replies: any[]): number => {
              return replies.reduce((replyTotal, reply) => {
                const nestedReplies = reply.expand?.replies
                  ? countReplies(reply.expand.replies)
                  : 0;
                return replyTotal + 1 + nestedReplies;
              }, 0);
            };
            const nestedReplies = comment.expand?.replies
              ? countReplies(comment.expand.replies)
              : 0;
            return total + 1 + nestedReplies;
          }, 0)}
          totalReviews={reviews.length}
          averageReviewScore={reviews.length > 0
            ? reviews.reduce(
              (sum: any, review: { overall_rating: any }) =>
                sum + (review.overall_rating || 0),
              0,
            ) / reviews.length
            : null}
          totalFavorites={data.totalFavorites || null}
        />
      </div>

      {/* Device Reviews Section */}
      <div class="device-detail-reviews">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div class="divider" style={{ padding: "0.5rem 0" }}></div>
          <details open>
            <summary
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "space-between",
              }}
            >
              <strong style={{ color: "var(--pico-primary)" }}>
                Reviews
              </strong>
              <span
                style={{
                  color: "var(--pico-muted-color)",
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                }}
              >
                Share your experience with this device
              </span>
            </summary>
            <section>
              <div style={{ textAlign: "center", marginBottom: "0.5em" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5em",
                  }}
                >
                </span>
                {reviews.length === 0 &&
                  (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5em",
                      }}
                    >
                      <PiStar
                        size={20}
                        style={{ color: "var(--pico-primary)" }}
                      />
                      <strong>
                        No reviews yet
                      </strong>
                      <span style={{ marginLeft: "0.5em" }}>
                        Be the first to review this device
                      </span>
                    </div>
                  )}
              </div>
              {user == null && (
                <p style={{ textAlign: "center" }}>
                  <a href="/auth/sign-in">
                    Log In
                  </a>{" "}
                  Log in to add a review
                </p>
              )}
              {user && <AddDeviceReviewForm device={device} user={user} />}
              {reviews?.length > 0 && (
                <>
                  {reviews.map((review: ReviewContract) => (
                    <DeviceReviewCard review={review} />
                  ))}
                </>
              )}
            </section>
          </details>
        </div>
      </div>

      {/* Comments Section */}
      <div class="device-detail-comments">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div class="divider" style={{ padding: "0.5rem 0" }}></div>
          <details open>
            <summary
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "space-between",
              }}
            >
              <strong style={{ color: "var(--pico-primary)" }}>
                Comments
              </strong>
              <span
                style={{
                  color: "var(--pico-muted-color)",
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                }}
              >
                Discuss this device with the community
              </span>
            </summary>
            <section>
              <div style={{ textAlign: "center", marginBottom: "0.5em" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5em",
                  }}
                >
                  <PiChatCircleText
                    size={20}
                    style={{ color: "var(--pico-primary)" }}
                  />
                  {comments.length === 0
                    ? (
                      <>
                        <strong>
                          No comments yet
                        </strong>
                        <span style={{ marginLeft: "0.5em" }}>
                          Be the first to comment
                        </span>
                      </>
                    )
                    : (
                      <>
                        <strong>{comments.length}</strong>{" "}
                        {comments.length === 1 ? "comment" : "comments"} so far.
                      </>
                    )}
                </span>
              </div>
              {user == null && (
                <p style={{ textAlign: "center" }}>
                  <a href="/auth/sign-in">
                    Sign In
                  </a>{" "}
                  to add yours.
                </p>
              )}

              {user && <AddDeviceCommentForm device={device} user={user} />}

              {comments?.length > 0
                ? (
                  <CommentThread
                    comments={comments}
                    user={user}
                    deviceId={device.id}
                  />
                )
                : (
                  <>
                    {
                      /* <p style={{ textAlign: "center" }}>
                      No comments yet. Be the first to add your thoughts!
                    </p> */
                    }
                  </>
                )}
            </section>
          </details>
        </div>
      </div>

      <div class="device-detail-links">
        <DeviceLinks device={device} />
      </div>

      <div class="device-detail-similar-devices">
        <h2 style={{ textAlign: "center" }}>
          Find Similar Devices
        </h2>

        <div class="tags">
          {device.tags.map((tag) => <TagComponent key={tag.name} tag={tag} />)}
        </div>
        <div class="similar-devices-grid">
          {(() => {
            return similarDevices.map((deviceItem) => {
              // Use index + 1 because index 0 is the main device
              const borderColor = generateDeviceColors([
                device,
                ...similarDevices,
              ])[deviceItem.name.sanitized];

              return (
                <a
                  key={deviceItem.name.sanitized}
                  href={`/devices/${deviceItem.name.sanitized}`}
                  style={{ textDecoration: "none" }}
                >
                  <DeviceCardMedium
                    device={deviceItem}
                    isActive={false}
                    borderColor={borderColor}
                  />
                </a>
              );
            });
          })()}
        </div>
      </div>
      <div class="device-detail-specs">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div class="divider" style={{ padding: "0.5rem 0" }}></div>
          <details>
            <summary
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "space-between",
              }}
            >
              <strong style={{ color: "var(--pico-primary)" }}>
                Specifications Summary
              </strong>
              <span
                style={{
                  color: "var(--pico-muted-color)",
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                }}
              >
                Key specifications and features at a glance
              </span>
            </summary>
            <section>
              <div class="overflow-auto">
                <SummaryTable device={device} />
              </div>
            </section>
          </details>

          <div class="divider" style={{ padding: "0.5rem 0" }}></div>

          <details>
            <summary
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "space-between",
              }}
            >
              <strong style={{ color: "var(--pico-primary)" }}>
                Full Specifications
              </strong>
              <span
                style={{
                  color: "var(--pico-muted-color)",
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                }}
              >
                Complete technical specifications and detailed information
              </span>
            </summary>
            <DeviceSpecs device={device} />
          </details>
          <div class="divider" style={{ padding: "0.5rem 0 0 0" }}></div>
        </div>
      </div>
    </div>
  );
}
