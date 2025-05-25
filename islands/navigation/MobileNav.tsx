import { PiListBold, PiSignIn, PiUserPlus } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { navigationItems } from "../../data/frontend/navigation-items.ts";
import { ThemeSwitcher } from "./ThemeSwitcher.tsx";
import { User } from "../../data/frontend/contracts/user.contract.ts";
import { ProfileImage } from "../../components/auth/profile-image.tsx";
import { searchDevices } from "../../data/frontend/services/utils/search.utils.ts";

export function MobileNav(
  { pathname, allDevices, user }: {
    pathname: string;
    allDevices: Device[];
    user: User | null;
  },
) {
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
  }, []);

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
    suggestions.value = searchDevices(value, allDevices);

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
    <div>
      <nav class="mobile-nav">
        <div class="mobile-nav-header">
          <a href="/">
            <img
              loading="lazy"
              src="/rr-logo-v3.svg"
              alt="logo"
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
          </div>

          <button
            type="button"
            class="burger-menu"
            onClick={() => {
              document.querySelector(".mobile-nav-content")?.classList
                .toggle("show");
            }}
            aria-label="Toggle menu"
          >
            <PiListBold />
          </button>

          <div class="mobile-nav-theme-switcher">
            <ThemeSwitcher showTooltip={false} showNames={false} />
          </div>
        </div>
        <div
          class="mobile-nav-content"
          style={{
            paddingTop: "1em",
            borderBottom: "1px solid var(--pico-primary)",
          }}
        >
          <ul>
            {navigationItems.map((item) => (
              <li style={{ padding: "0" }}>
                <a
                  href={item.href}
                  class={item.isActive(pathname)
                    ? "mobile-active mobile-nav-button"
                    : "mobile-nav-button"}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {item.icon && item.icon({ style: { fontSize: "1.3rem" } })}
                    &nbsp;{item.label}
                  </span>
                </a>
              </li>
            ))}
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
                    <ProfileImage name={user.nickname} />
                    <span style={{ fontSize: "0.5rem", textWrap: "nowrap" }}>
                      {user.nickname}
                    </span>
                  </a>
                </li>
              )
              : (
                <li
                  class="nav-theme-item"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
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
                    <PiSignIn /> Sign in
                  </a>
                </li>
              )}
          </ul>
        </div>
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
