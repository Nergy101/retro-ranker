import { ProfileImage } from "@components/auth/profile-image.tsx";
import { DeviceCardMedium } from "@components/cards/device-card-medium.tsx";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { User } from "@data/frontend/contracts/user.contract.ts";
import { getAllNavigationItems } from "@data/frontend/navigation-items.ts";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";
import { searchDevices } from "@data/frontend/services/utils/search.utils.ts";
import {
  PiCalendar,
  PiChartLine,
  PiChatText,
  PiGitDiff,
  PiInfo,
  PiListBold,
  PiMagnifyingGlass,
  PiQuestion,
  PiRanking,
  PiScroll,
  PiSignIn,
} from "@preact-icons/pi";
import { useEffect, useRef, useState } from "preact/hooks";
import { LanguageSwitcher } from "./language-switcher.tsx";
import { ThemeSwitcher } from "./theme-switcher.tsx";

export function MobileNav({
  pathname,
  allDevices,
  user,
  translations,
}: {
  pathname: string;
  allDevices: Device[];
  user: User | null;
  translations: Record<string, string>;
}) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileNavContent = document.querySelector(".mobile-nav-content");
      const burgerMenu = document.querySelector(".burger-menu");

      if (!mobileNavContent || !burgerMenu) return;

      // Check if click is outside both the menu content and burger button
      if (
        !mobileNavContent.contains(event.target as Node) &&
        !burgerMenu.contains(event.target as Node) &&
        mobileNavContent.classList.contains("show")
      ) {
        mobileNavContent.classList.remove("show");
      }
    };

    // Add event listener
    document.addEventListener("click", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  const suggestionsRef = useRef<HTMLUListElement>(null);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [suggestions, setSuggestions] = useState<Device[]>([]);
  const [query, setQuery] = useState<string>("");
  const isActive = (deviceName: string) => {
    return deviceName.toLowerCase() === selectedDevice?.name.raw.toLowerCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  const queryChanged = (value: string) => {
    setQuery(value);
    setSuggestions(searchDevices(value, allDevices));

    setSelectedDevice(
      allDevices.find(
        (device) => device.name.raw.toLowerCase() === value.toLowerCase(),
      ) ?? null,
    );
  };

  const setQuerySuggestion = (value: string) => {
    queryChanged(value);
    setSuggestions([]);

    if (selectedDevice) {
      globalThis.location.href = `/devices/${selectedDevice.name.sanitized}`;
    }
  };

  const icons = new Map<string, any>([
    ["PiScroll", <PiScroll key="PiScroll" />],
    ["PiCalendar", <PiCalendar key="PiCalendar" />],
    ["PiGitDiff", <PiGitDiff key="PiGitDiff" />],
    ["PiInfo", <PiInfo key="PiInfo" />],
    ["PiQuestion", <PiQuestion key="PiQuestion" />],
    ["PiRanking", <PiRanking key="PiRanking" />],
    ["PiChartLine", <PiChartLine key="PiChartLine" />],
    ["PiChatText", <PiChatText key="PiChatText" />],
  ]);

  const getIcon = (icon: string): any => {
    return icons.get(icon);
  };

  const handleSubmit = () => {
    if (selectedDevice) {
      const sanitized = selectedDevice.name.sanitized;
      globalThis.location.href = `/devices/${sanitized}`;
      return;
    }
    globalThis.location.href = "/devices?search=" + query;
  };

  return (
    <div>
      <nav class="mobile-nav">
        <div class="mobile-nav-header">
          <a href="/" aria-label="Home">
            <img
              loading="lazy"
              src="/logos/retro-ranker/rr-logo.svg"
              alt="retro ranker logo"
              width="100"
              style={{
                height: "3em",
                width: "3em",
                objectFit: "contain",
                padding: "0.5rem 0",
              }}
            />
          </a>

          <div class="mobile-nav-search-item">
            <input
              type="search"
              placeholder="Search"
              name="search"
              aria-label="Search"
              style={{ margin: 0 }}
              onInput={(e) => queryChanged(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <button
              type="button"
              aria-label="Search"
              class="outline search-button-mobile"
              onClick={handleSubmit}
            >
              <PiMagnifyingGlass />
              <span style={{ marginLeft: "0.25rem" }}>
                {TranslationPipe(translations, "nav.go")}
              </span>
            </button>
          </div>

          <button
            type="button"
            class="burger-menu"
            onClick={() => {
              document
                .querySelector(".mobile-nav-content")
                ?.classList.toggle("show");
            }}
            aria-label="Toggle menu"
          >
            <PiListBold />
          </button>

          <div class="mobile-nav-theme-switcher">
            <ThemeSwitcher showTooltip={false} showNames={false} />
            <LanguageSwitcher translations={translations} />
          </div>
        </div>
        <div
          class="mobile-nav-content"
          style={{
            borderBottom: "3px solid var(--pico-primary)",
          }}
        >
          <ul>
            {getAllNavigationItems().map((item) => (
              <li style={{ padding: "0" }}>
                <a
                  href={item.href}
                  class={item.isActive(pathname)
                    ? "mobile-active mobile-nav-button"
                    : "mobile-nav-button"}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "1.3rem",
                    }}
                  >
                    {item.icon && getIcon(item.icon)}
                    &nbsp;{TranslationPipe(
                      translations,
                      item.i18nKey ?? item.label,
                    )}
                  </span>
                </a>
              </li>
            ))}
            {user
              ? (
                <li class="nav-theme-item last">
                  <a
                    href="/profile"
                    aria-label="Profile"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                      width: "100%",
                    }}
                  >
                    <ProfileImage name={user.nickname} />
                    <span style={{ fontSize: "0.5rem", textWrap: "nowrap" }}>
                      {user.nickname}
                    </span>
                  </a>
                </li>
              )
              : (
                <li
                  class="nav-theme-item last"
                  style={{
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <a
                    href="/auth/sign-in"
                    style={{
                      fontSize: "1.5rem",
                      display: "flex",
                      justifyContent: "center",
                      gap: "0.5rem",
                      width: "50%",
                    }}
                  >
                    <PiSignIn /> Log In
                  </a>
                </li>
              )}
          </ul>
        </div>
      </nav>

      <div id="suggestions-container">
        {suggestions.length > 0 && (
          <ul class="suggestions-list" ref={suggestionsRef}>
            {suggestions.map((device) => (
              <li
                key={device.name.sanitized}
                onClick={() => setQuerySuggestion(device.name.raw)}
                class="suggestions-list-item"
              >
                <DeviceCardMedium
                  device={device}
                  isActive={isActive(device.name.raw)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
