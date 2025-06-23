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
import { ProfileImage } from "@components/auth/profile-image.tsx";
import { DeviceCardMedium } from "@components/cards/device-card-medium.tsx";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { User } from "@data/frontend/contracts/user.contract.ts";
import { navigationItems } from "@data/frontend/navigation-items.ts";
import { searchDevices } from "@data/frontend/services/utils/search.utils.ts";
import { ThemeSwitcher } from "./theme-switcher.tsx";

export function DesktopNav({
  pathname,
  allDevices,
  user,
}: {
  pathname: string;
  allDevices: Device[];
  user: User | null;
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
                aria-label={item.label}
              >
                <span class="nav-item-label">
                  <span
                    class="nav-item-label-icon"
                    style={{ minWidth: "1rem" }}
                  >
                    {item.icon && getIcon(item.icon)}
                  </span>
                  {item.label}
                </span>
              </a>
            </li>
          ))}
          <li class="nav-search-item">
            <input
              style={{
                width: "3em",
                transition: "width 0.3s ease-in-out",
              }}
              onFocus={(e) => {
                e.currentTarget.style.width = "12em";
              }}
              onBlur={(e) => {
                e.currentTarget.style.width = "3em";
              }}
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
            <button
              type="button"
              aria-label="Search"
              class="outline search-button"
              onClick={handleSubmit}
            >
              <PiMagnifyingGlass />
              <span style={{ marginLeft: "0.25rem" }}>Go</span>
            </button>
          </li>
          <li class="nav-theme-item">
            <ThemeSwitcher showNames={false} showTooltip={true} />
          </li>

          {user
            ? (
              <li class="nav-theme-item">
                <a
                  href="/profile"
                  aria-label="Profile"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    data-tooltip={user.nickname}
                    data-placement="left"
                    style={{
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <ProfileImage name={user.nickname} />
                  </div>
                </a>
              </li>
            )
            : (
              <>
                <li
                  class="nav-theme-item"
                  data-tooltip="Sign Up"
                  data-placement="bottom"
                >
                  <a
                    href="/auth/sign-up"
                    aria-label="Sign Up"
                    style={{
                      fontSize: "1.5rem",
                    }}
                  >
                    <PiUserPlus />
                  </a>
                </li>
                <li
                  class="nav-theme-item"
                  data-tooltip="Log In"
                  data-placement="bottom"
                >
                  <a
                    href="/auth/sign-in"
                    aria-label="Log In"
                    style={{
                      fontSize: "1.5rem",
                    }}
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
