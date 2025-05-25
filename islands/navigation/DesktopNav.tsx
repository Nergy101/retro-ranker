import { ThemeSwitcher } from "./ThemeSwitcher.tsx";
import { navigationItems } from "../../data/frontend/navigation-items.ts";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { ProfileImage } from "../../components/auth/profile-image.tsx";
import { User } from "../../data/frontend/contracts/user.contract.ts";
import { PiSignIn } from "@preact-icons/pi";
import { searchDevices } from "../../data/frontend/services/utils/search.utils.ts";

export function DesktopNav(
  { pathname, allDevices, user }: {
    pathname: string;
    allDevices: Device[];
    user: User | null;
  },
) {
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const selectedDevice = useSignal<Device | null>(null);
  const suggestions = useSignal<Device[]>([]);
  const query = useSignal<string>("");
  const isActive = (deviceName: string) => {
    return deviceName.toLowerCase() ===
      selectedDevice.value?.name.raw.toLowerCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        suggestions.value = [];
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const queryChanged = (value: string) => {
    query.value = value;
    suggestions.value = searchDevices(value.trim(), allDevices);

    selectedDevice.value =
      allDevices.find((device) =>
        device.name.raw.toLowerCase() === value.toLowerCase()
      ) ?? null;
  };

  const setQuerySuggestion = (value: string) => {
    queryChanged(value);
    suggestions.value = [];

    if (selectedDevice.value) {
      globalThis.location.href =
        `/devices/${selectedDevice.value.name.sanitized}`;
    }
  };

  const handleSubmit = () => {
    if (selectedDevice.value) {
      const sanitized = selectedDevice.value.name.sanitized;
      globalThis.location.href = `/devices/${sanitized}`;
      return;
    }
    globalThis.location.href = "/devices?search=" + query.value;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <nav class="desktop-nav">
        <ul class="desktop-nav-ul">
          <li class="nav-item">
            <a href="/" class={pathname === "/" ? "nav-a active" : "nav-a"}>
              <span class="nav-item-label">
                <img
                  loading="lazy"
                  src="/rr-logo-v3.svg"
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
        {suggestions.value.length > 0 && (
          <ul class="suggestions-list" ref={suggestionsRef}>
            {suggestions.value.map((device) => (
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
