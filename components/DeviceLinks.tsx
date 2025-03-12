import { PiCaretCircleDoubleDown } from "@preact-icons/pi";
import { Device } from "../data/frontend/contracts/device.model.ts";
import { DeviceService } from "../data/frontend/services/devices/device.service.ts";

export function DeviceLinks({ device }: { device: Device }) {
  return (
    <>
      {(device.reviews.videoReviews.length > 0) && (
        <>
          {device.reviews.videoReviews.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <hr
                style={{ border: "1px solid var(--pico-muted-border-color)" }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div style={{ visibility: "hidden" }}></div>
                <strong>
                  Video Reviews
                </strong>
                <span
                  data-tooltip="Scroll down to see more"
                  data-placement="left"
                >
                  <PiCaretCircleDoubleDown />
                </span>
              </div>
              <div class="video-reviews">
                {device.reviews.videoReviews.filter((review) =>
                  review.url.includes("youtu")
                ).map((review) => (
                  <div
                    key={review.url}
                    style={{
                      textDecoration: "none",
                      listStyle: "none",
                      width: "300px",
                      height: "200px",
                    }}
                  >
                    <iframe
                      width="300"
                      height="200"
                      src={DeviceService.getEmbedUrl(review.url)}
                      target="_blank"
                      alt={review.name}
                      defer
                    >
                      {review.name}
                    </iframe>
                  </div>
                ))}
                {device.reviews.videoReviews.filter((review) =>
                  !review.url.includes("youtu")
                ).map((review) => (
                  <div key={review.url}>
                    <a href={review.url} target="_blank">
                      {new URL(review.url).hostname} - {review.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {(device.reviews.writtenReviews.length > 0) && (
        <div style={{ textAlign: "center" }}>
          <hr
            style={{ border: "1px solid var(--pico-muted-border-color)" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <strong>Written Reviews</strong>
            {device.reviews.writtenReviews.length > 0
              ? (
                <div
                  style={{
                    display: "flex",
                    flexFlow: "row wrap",
                    gap: "1rem",
                    justifyContent: "center",
                  }}
                >
                  {device.reviews.writtenReviews.map((review) => (
                    <div key={review.url}>
                      <a
                        href={review.url}
                        target="_blank"
                        alt={review.name}
                      >
                        {review.name}
                      </a>
                    </div>
                  ))}
                </div>
              )
              : <span>No written reviews available.</span>}
          </div>
        </div>
      )}

      {device.vendorLinks.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <hr
            style={{ border: "1px solid var(--pico-muted-border-color)" }}
          />
          <strong>
            Vendor Links
          </strong>
          <div
            style={{
              display: "flex",
              flexFlow: "row wrap",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            {device.vendorLinks.map((link) => (
              <a href={link.url} target="_blank">{link.name}</a>
            ))}
          </div>
        </div>
      )}

      {device.hackingGuides.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <hr
            style={{ border: "1px solid var(--pico-muted-border-color)" }}
          />
          <strong>Hacking Guides</strong>
          <div
            style={{
              display: "flex",
              flexFlow: "row wrap",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            {device.hackingGuides.map((guide) => (
              <a href={guide.url} target="_blank">{guide.name}</a>
            ))}
          </div>
        </div>
      )}
      <hr
        style={{ border: "1px solid var(--pico-muted-border-color)" }}
      />
    </>
  );
}
