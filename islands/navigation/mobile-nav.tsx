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
  PiUserPlus,
  PiX,
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
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [suggestions, setSuggestions] = useState<Device[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const isActive = (deviceName: string) =>
    deviceName.toLowerCase() === selectedDevice?.name.raw.toLowerCase();

  // Global close handlers (ESC, outside click) and body scroll lock
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
        setIsSearchOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        isDrawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node)
      ) {
        setIsDrawerOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClick);
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    // Lock body scroll when overlays open
    if (isDrawerOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isDrawerOpen, isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      // Focus search input when search overlay opens
      setTimeout(() => searchInputRef.current?.focus(), 0);
    } else {
      setSuggestions([]);
      setQuery("");
      setSelectedDevice(null);
    }
  }, [isSearchOpen]);

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
      {/* Top bar: single row */}
      <nav class="mobile-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <a
            href="/"
            aria-label="Home"
            class="mobile-nav-logo"
            data-tooltip="Retro Ranker"
            data-placement="bottom"
          >
            <img
              loading="lazy"
              src="/logos/retro-ranker/rr-logo.svg"
              alt="retro ranker logo"
              width="100"
              style={{ height: "2.2em", width: "2.2em", objectFit: "contain" }}
            />
          </a>
          <button
            data-tooltip="Menu"
            data-placement="bottom"
            type="button"
            class="burger-menu"
            style={{
              marginBottom: 0,
            }}
            aria-label="Open menu"
            onClick={() => setIsDrawerOpen(true)}
          >
            <span
              style={{
                color: "var(--pico-primary-inverse)",
                fontSize: "1.2rem",
              }}
            >
              <PiListBold />
            </span>
          </button>
        </div>
        <div class="mobile-actions">
          <ThemeSwitcher
            showTooltip={true}
            tooltipLocation="left"
            showNames={false}
            compact={true}
          />
          <a
            href="#"
            aria-label="Search"
            class="icon-button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--pico-contrast)",
            }}
            onClick={(e) => {
              e.preventDefault();
              setIsSearchOpen(true);
            }}
            data-tooltip="Search"
            data-placement="bottom"
            role="button"
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
          {user
            ? (
              <a
                href="/profile"
                aria-label="Profile"
                class="icon-button"
                data-tooltip={user.nickname}
                data-placement="bottom"
              >
                <ProfileImage name={user.nickname} size={24} />
              </a>
            )
            : (
              <>
                <a
                  href="/auth/sign-up"
                  aria-label="Sign Up"
                  class="icon-button"
                  data-tooltip="Sign Up"
                  data-placement="bottom"
                >
                  <PiUserPlus />
                </a>
                <a
                  href="/auth/sign-in"
                  aria-label="Log In"
                  class="icon-button icon-button--primary"
                  data-tooltip="Log In"
                  data-placement="bottom"
                >
                  <PiSignIn />
                </a>
              </>
            )}
        </div>
      </nav>

      {/* Drawer overlay */}
      {isDrawerOpen && (
        <div
          class="mobile-drawer-overlay"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Side drawer */}
      <aside
        class={isDrawerOpen ? "mobile-drawer open" : "mobile-drawer"}
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        ref={drawerRef}
      >
        <header class="mobile-drawer-header">
          <span class="drawer-title">Menu</span>
          <LanguageSwitcher translations={translations} />
        </header>

        <ul class="mobile-drawer-list">
          {getAllNavigationItems().map((item) => (
            <li>
              <a
                href={item.href}
                class={item.isActive(pathname)
                  ? "drawer-link active"
                  : "drawer-link"}
                onClick={() => setIsDrawerOpen(false)}
              >
                <span class="drawer-link-icon">
                  {item.icon && getIcon(item.icon)}
                </span>
                <span class="drawer-link-label">
                  {TranslationPipe(translations, item.i18nKey ?? item.label)}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <footer class="mobile-drawer-footer">
          {user
            ? (
              <a
                href="/profile"
                class="profile-link"
                onClick={() => setIsDrawerOpen(false)}
              >
                <ProfileImage name={user.nickname} />
                <span class="profile-name">{user.nickname}</span>
              </a>
            )
            : (
              <>
                <a
                  href="/auth/sign-up"
                  class="signin-link"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <PiUserPlus />
                  <span>Sign Up</span>
                </a>
                <a
                  href="/auth/sign-in"
                  class="signin-link"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <PiSignIn />
                  <span>Log In</span>
                </a>
              </>
            )}
        </footer>
      </aside>

      {/* Search overlay */}
      {isSearchOpen && (
        <div
          class="mobile-search-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div class="mobile-search-bar">
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search devices..."
              name="search"
              aria-label="Search"
              value={query}
              onInput={(e) => queryChanged(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") setIsSearchOpen(false);
              }}
            />
            <button
              type="button"
              class="icon-button"
              onClick={handleSubmit}
              aria-label="Go"
            >
              <span
                style={{
                  color: "var(--pico-contrast)",
                  fontSize: "1rem",
                }}
              >
                <PiMagnifyingGlass />
              </span>
            </button>
            <button
              type="button"
              class="icon-button"
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
            >
              <span
                style={{
                  color: "var(--pico-contrast)",
                  fontSize: "1rem",
                }}
              >
                <PiX />
              </span>
            </button>
          </div>
          <div class="mobile-search-results">
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
      )}
    </div>
  );
}
