import { ProfileImage } from "@components/auth/profile-image.tsx";
import { DeviceCardMedium } from "@components/cards/device-card-medium.tsx";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { User } from "@data/frontend/contracts/user.contract.ts";
import { navigationItems } from "@data/frontend/navigation-items.ts";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";
import { searchDevices } from "@data/frontend/services/utils/search.utils.ts";
import {
  PiCalendar,
  PiChartLine,
  PiChatText,
  PiDotsThree,
  PiGitDiff,
  PiInfo,
  PiMagnifyingGlass,
  PiQuestion,
  PiRanking,
  PiScroll,
  PiSignIn,
  PiUserPlus,
} from "@preact-icons/pi";
import { useEffect, useRef, useState } from "preact/hooks";
import { LanguageSwitcher } from "./language-switcher.tsx";
import { ThemeSwitcher } from "./theme-switcher.tsx";

export function DesktopNav({
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
    setSuggestions(searchDevices(value.trim(), allDevices));

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
    ["PiThreeDots", <PiDotsThree key="PiThreeDots" />],
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
    <div style={{ display: "flex", flexDirection: "column" }}>
      <nav class="desktop-nav">
        <ul class="desktop-nav-ul">
          <li class="nav-item">
            <a
              href="/"
              class={pathname === "/" ? "nav-a active" : "nav-a"}
              aria-label="Home"
            >
              <span class="nav-item-label">
                <img
                  loading="lazy"
                  src="/logos/retro-ranker/rr-logo.svg"
                  alt="retro ranker logo"
                  width="48"
                  style={{
                    height: "2.5em",
                    minWidth: "2.5em",
                    objectFit: "contain",
                  }}
                />
              </span>
            </a>
          </li>
          {navigationItems.map((item) => (
            <li class="nav-item">
              <a
                href={item.href}
                class={item.isActive(pathname) ? "nav-a active" : "nav-a"}
                aria-label={TranslationPipe(
                  translations,
                  item.i18nKey ?? item.label,
                )}
              >
                <span class="nav-item-label">
                  <span
                    class="nav-item-label-icon"
                    style={{ minWidth: "1rem" }}
                  >
                    {item.icon && getIcon(item.icon)}
                  </span>
                  {TranslationPipe(translations, item.i18nKey ?? item.label)}
                </span>
              </a>
            </li>
          ))}
          <li class="nav-search-item">
            <input
              style={{
                width: "15em",
                transition: "width 0.3s ease-in-out",
                height: "2.5rem",
                border: "1px solid var(--pico-primary)",
                borderRadius: "0.5rem",
                background: "var(--pico-card-background-color)",
                color: "var(--pico-contrast)",
                padding: "0 0.75rem",
              }}
              placeholder={TranslationPipe(translations, "search.placeholder")}
              type="search"
              name="search"
              aria-label="Search"
              onInput={(e) => queryChanged(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <a
              href="#"
              type="button"
              aria-label="Search"
              class="icon-button magnifying-glass"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              data-tooltip={TranslationPipe(translations, "search.button")}
              data-placement="bottom"
            >
              <span
                style={{
                  color: "var(--pico-contrast)",
                  fontSize: "1.2rem",
                }}
              >
                <PiMagnifyingGlass />
              </span>
            </a>
          </li>

          <div style={{ maxWidth: "5em", width: "5em" }}>
            <LanguageSwitcher translations={translations} compact={false} />
          </div>

          <ThemeSwitcher
            showNames={false}
            showTooltip={true}
            compact={true}
          />

          {user
            ? (
              <li class="nav-theme-item">
                <a
                  href="/profile"
                  aria-label="Profile"
                  class="icon-button"
                  data-tooltip={user.nickname}
                  data-placement="bottom"
                >
                  <ProfileImage
                    name={user.nickname}
                    size={24}
                    showBorder={false}
                  />
                </a>
              </li>
            )
            : (
              <>
                <li
                  class="nav-theme-item"
                  data-tooltip="Log In"
                  data-placement="bottom"
                >
                  <a
                    href="/auth/sign-in"
                    aria-label="Log In"
                    class="icon-button"
                  >
                    <PiSignIn />
                  </a>
                </li>
              </>
            )}
        </ul>
      </nav>

      <div id="suggestions-container">
        {suggestions.length > 0 && (
          <ul class="suggestions-list" ref={suggestionsRef}>
            {suggestions.map((device) => (
              <li
                key={device.name.sanitized}
                onClick={() => setQuerySuggestion(device.name.raw)}
                class="suggestions-list-item"
                aria-label={device.name.raw}
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
