import {
  PiChatText,
  PiFileText,
  PiGithubLogo,
  PiInfo,
  PiShield,
} from "@preact-icons/pi";
import { VersionTag } from "./shared/version-tag.tsx";
import { BatchTranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

export function Footer(
  { translations }: { translations: Record<string, string> },
) {
  // Batch load all translations needed for the footer
  const [
    footerOther,
    footerPrivacy,
    footerTos,
    footerConnect,
    footerBluesky,
    footerGithub,
    footerMore,
    footerAbout,
    footerContact,
    footerRights,
    footerMadeWith,
  ] = BatchTranslationPipe(translations, [
    "footer.other",
    "footer.privacy",
    "footer.tos",
    "footer.connect",
    "footer.bluesky",
    "footer.github",
    "footer.more",
    "footer.about",
    "footer.contact",
    "footer.rights",
    "footer.madeWith",
  ]);

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
            <span>{footerOther}</span>
            <ul class="footer-grid-item-list">
              <li style={{ listStyle: "none" }}>
                <a href="/privacy">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <PiShield />
                    <span>
                      {footerPrivacy}
                    </span>
                  </div>
                </a>
              </li>

              <li style={{ listStyle: "none" }}>
                <a href="/terms">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <PiFileText />
                    <span>
                      {footerTos}
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
            <span>{footerConnect}</span>
            <ul class="footer-grid-item-list">
              <li style={{ listStyle: "none" }}>
                <a
                  href="https://bsky.app/profile/nergy101.bsky.social"
                  target="_blank"
                >
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <PiChatText />
                    <span>
                      {footerBluesky}
                    </span>
                  </div>
                </a>
              </li>
              <li style={{ listStyle: "none" }}>
                <a
                  href="https://github.com/Nergy101/retro-ranker"
                  target="_blank"
                >
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <PiGithubLogo />
                    <span>
                      {footerGithub}
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
            <span>{footerMore}</span>
            <ul class="footer-grid-item-list">
              <li style={{ listStyle: "none" }}>
                <a href="/about">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <PiInfo />
                    <span>
                      {footerAbout}
                    </span>
                  </div>
                </a>
              </li>
              <li style={{ listStyle: "none" }}>
                <a href="/contact">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <PiChatText />
                    <span>
                      {footerContact}
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div
            class="footer-grid-item version-info"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>{footerRights}</span>
            <span>
              {footerMadeWith}{" "}
              <a href="https://github.com/Nergy101">Nergy101</a>
            </span>
            <VersionTag />
          </div>
        </div>
      </div>
    </footer>
  );
}
