import {
  PiChatText,
  PiFileText,
  PiGithubLogo,
  PiInfo,
  PiShield,
} from "@preact-icons/pi";
import { VersionTag } from "./shared/version-tag.tsx";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

export function Footer(
  { translations }: { translations: Record<string, string> },
) {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--pico-primary)",
        backgroundColor: "var(--pico-card-background-color-darker)",
      }}
      class="footer"
    >
      <div class="container-fluid">
        <div class="footer-grid">
          <div
            class="footer-grid-item quick-links"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>{TranslationPipe(translations, "footer.other")}</span>
            <ul class="footer-grid-item-list">
              <li style={{ listStyle: "none" }}>
                <a href="/privacy">
                  <div style={{ display: "flex" }}>
                    <PiShield />
                    <span>
                      &nbsp;{TranslationPipe(translations, "footer.privacy")}
                    </span>
                  </div>
                </a>
              </li>

              <li style={{ listStyle: "none" }}>
                <a href="/terms">
                  <div style={{ display: "flex" }}>
                    <PiFileText />
                    <span>
                      &nbsp;{TranslationPipe(translations, "footer.tos")}
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div
            class="footer-grid-item connect-links"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>{TranslationPipe(translations, "footer.connect")}</span>
            <ul class="footer-grid-item-list">
              <li style={{ listStyle: "none" }}>
                <a
                  href="https://bsky.app/profile/nergy101.bsky.social"
                  target="_blank"
                >
                  <div style={{ display: "flex" }}>
                    <PiChatText />
                    <span>
                      &nbsp;{TranslationPipe(translations, "footer.bluesky")}
                    </span>
                  </div>
                </a>
              </li>
              <li style={{ listStyle: "none" }}>
                <a
                  href="https://github.com/Nergy101/retro-ranker"
                  target="_blank"
                >
                  <div style={{ display: "flex" }}>
                    <PiGithubLogo />
                    <span>
                      &nbsp;{TranslationPipe(translations, "footer.github")}
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div
            class="footer-grid-item more-links"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>{TranslationPipe(translations, "footer.more")}</span>
            <ul class="footer-grid-item-list">
              <li style={{ listStyle: "none" }}>
                <a href="/about">
                  <div style={{ display: "flex" }}>
                    <PiInfo />
                    <span>
                      &nbsp;{TranslationPipe(translations, "footer.about")}
                    </span>
                  </div>
                </a>
              </li>
              <li style={{ listStyle: "none" }}>
                <a href="/contact">
                  <div style={{ display: "flex" }}>
                    <PiChatText />
                    <span>
                      &nbsp;{TranslationPipe(translations, "footer.contact")}
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div class="footer-grid-item rr">
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <strong style={{ color: "var(--pico-primary)" }}>
                Retro Ranker
              </strong>

              <VersionTag />
            </div>
            <small>
              © {new Date().getFullYear()}{" "}
              <a
                style={{ color: "var(--pico-primary)" }}
                href="https://retroranker.site"
                target="_blank"
              >
                Retro Ranker
              </a>. {TranslationPipe(translations, "footer.rights")}
            </small>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <small>
                {TranslationPipe(translations, "footer.madeWith")}{" "}
                <span style={{ color: "var(--pico-primary)" }}>
                  <a href="https://portfolio.nergy.space" target="_blank">
                    Nergy101
                  </a>
                </span>
              </small>
              <img
                loading="lazy"
                alt="nergy logo"
                src="/logos/nergy/nergy-square.png"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
