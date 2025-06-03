import { PiSignIn } from "@preact-icons/pi";
// import { effect, signal } from "@preact/signals";
import { useEffect, useRef, useState } from "preact/hooks";
import ProfileImage from "../../components/auth/profile-image.tsx";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { User } from "../../data/frontend/contracts/user.contract.ts";
import { navigationItems } from "../../data/frontend/navigation-items.ts";
import { searchDevices } from "../../data/frontend/services/utils/search.utils.ts";
import DeviceCardMedium from "../../components/cards/device-card-medium.tsx";
import ThemeSwitcher from "./theme-switcher.tsx";

export default function DesktopNav(
  { pathname, allDevices, user }: {
    pathname: string;
    allDevices: Device[];
    user: User | null;
  },
) {
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [suggestions, setSuggestions] = useState<Device[]>([]);
  const [query, setQuery] = useState<string>("");
  const isActive = (deviceName: string) => {
    return deviceName.toLowerCase() ===
      selectedDevice?.name.raw.toLowerCase();
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
      allDevices.find((device) =>
        device.name.raw.toLowerCase() === value.toLowerCase()
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
                  alt="logo"
                  width="100"
                  style={{
                    height: "2.5em",
                    width: "2.5em",
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
                  {item.icon && item.icon({ style: { minWidth: "1rem" } })}
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
          </li>
          <li class="nav-theme-item">
            <ThemeSwitcher showNames={false} showTooltip={false} />
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
              <li class="nav-theme-item">
                <a
                  href="/auth/sign-in"
                  aria-label="Sign In"
                  style={{
                    fontSize: "1.5rem",
                  }}
                >
                  <PiSignIn />
                </a>
              </li>
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
