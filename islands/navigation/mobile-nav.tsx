import { ProfileImage } from "../../components/auth/profile-image.tsx";
import { DeviceCardMedium } from "../../components/cards/device-card-medium.tsx";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { User } from "../../data/frontend/contracts/user.contract.ts";
import { getAllNavigationItems } from "../../data/frontend/navigation-items.ts";
import {
  getNewestDevices,
  searchDevices,
} from "../../data/frontend/services/utils/search.utils.ts";
import {
  PiBook,
  PiCalendar,
  PiChartLine,
  PiChatText,
  PiGitDiff,
  PiInfo,
  PiListBold,
  PiMagnifyingGlass,
  PiMoney,
  PiQuestion,
  PiRanking,
  PiScroll,
  PiSignIn,
  PiX,
} from "@preact-icons/pi";
import { useEffect, useRef, useState } from "preact/hooks";
import { ThemeSwitcher } from "./theme-switcher.tsx";

export function MobileNav({
  pathname,
  allDevices,
  user,
}: {
  pathname: string;
  allDevices: Device[];
  user: User | null;
}) {
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [suggestions, setSuggestions] = useState<Device[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [localAllDevices, setLocalAllDevices] = useState<Device[]>(
    allDevices ?? [],
  );

  const isActive = (deviceName: string) =>
    deviceName.toLowerCase() === selectedDevice?.name.raw.toLowerCase();

  const toggleExpanded = (itemHref: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemHref)) {
        newSet.delete(itemHref);
      } else {
        newSet.add(itemHref);
      }
      return newSet;
    });
  };

  // Global close handlers (ESC, outside click) and body scroll lock
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
        setIsSearchOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      // Only handle outside-click for drawer; do not clear search suggestions overlay
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
      // Ensure body scroll is reset on unmount
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    // Lock body scroll when overlays open
    if (isDrawerOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup function to ensure overflow is reset
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, isSearchOpen]);

  const ensureDevicesLoaded = async () => {
    if (localAllDevices && localAllDevices.length > 0) return;
    try {
      // Use the same API call that works for getting devices
      const res = await fetch(
        "/api/devices?pageSize=100&category=all&sort=new-arrivals&filter=all",
      );
      const data = await res.json();
      const devices: Device[] = Array.isArray(data) ? data : (data.page || []);
      setLocalAllDevices(devices);
    } catch {
      // noop
    }
  };

  const getDefaultDevices = (source: Device[]): Device[] => {
    if (!source || source.length === 0) return [];
    return getNewestDevices(source, 6);
  };

  useEffect(() => {
    if (isSearchOpen) {
      // Focus search input when search overlay opens
      setTimeout(() => searchInputRef.current?.focus(), 0);
      ensureDevicesLoaded();
      // If query empty, show defaults immediately
      if (query.trim().length === 0) {
        const source = (localAllDevices && localAllDevices.length > 0)
          ? localAllDevices
          : allDevices;
        if (source && source.length > 0) {
          setSuggestions(getDefaultDevices(source));
        } else {
          // Fetch newest devices while list isn't ready yet
          (async () => {
            try {
              const res = await fetch(
                `/api/devices?pageSize=6&category=all&sort=new-arrivals&filter=all`,
              );
              const data = await res.json();
              const page: Device[] = Array.isArray(data)
                ? data
                : (data.page || []);
              setSuggestions(page);
            } catch (_) {
              // ignore
            }
          })();
        }
      }
    } else {
      setSuggestions([]);
      setQuery("");
      setSelectedDevice(null);
    }
  }, [isSearchOpen]);

  // Recompute suggestions once devices load while user is typing
  useEffect(() => {
    if (!isSearchOpen) return;
    const source = (localAllDevices && localAllDevices.length > 0)
      ? localAllDevices
      : allDevices;
    if (query.trim().length > 0) {
      setSuggestions(searchDevices(query.trim(), source));
      setSelectedDevice(
        source.find(
          (device) => device.name.raw.toLowerCase() === query.toLowerCase(),
        ) ?? null,
      );
    } else if (
      (localAllDevices && localAllDevices.length > 0) ||
      (allDevices && allDevices.length > 0)
    ) {
      // Only switch to local defaults when we have the list; otherwise keep API-fetched defaults to avoid flicker
      setSuggestions(getDefaultDevices(source));
      setSelectedDevice(null);
    }
  }, [localAllDevices]);

  const queryChanged = (value: string) => {
    setQuery(value);
    const source = (localAllDevices && localAllDevices.length > 0)
      ? localAllDevices
      : allDevices;
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      if (
        (localAllDevices && localAllDevices.length > 0) ||
        (allDevices && allDevices.length > 0)
      ) {
        setSuggestions(getDefaultDevices(source));
      }
      setSelectedDevice(null);
      return;
    }

    // If we have local devices, use them for immediate search
    if (source && source.length > 0) {
      setSuggestions(searchDevices(trimmed, source));
      setSelectedDevice(
        source.find(
          (device) => device.name.raw.toLowerCase() === trimmed.toLowerCase(),
        ) ?? null,
      );
    } else {
      // If no local devices, clear suggestions and let the debounced API search handle it
      setSuggestions([]);
      setSelectedDevice(null);
    }
  };

  // Debounced API-backed search when local list isn't yet available
  useEffect(() => {
    if (!isSearchOpen) return;
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      if (!localAllDevices || localAllDevices.length === 0) {
        // Fallback: fetch newest devices when local list not loaded
        const controller = new AbortController();
        (async () => {
          try {
            const res = await fetch(
              `/api/devices?pageSize=6&category=all&sort=new-arrivals&filter=all`,
              { signal: controller.signal },
            );
            const data = await res.json();
            const page: Device[] = Array.isArray(data)
              ? data
              : (data.page || []);
            setSuggestions(page);
          } catch (_) {
            // ignore
          }
        })();
      } else {
        setSuggestions(getDefaultDevices(localAllDevices));
      }
      setSelectedDevice(null);
      return;
    }
    if (localAllDevices && localAllDevices.length > 0) return; // local search already active

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/devices?search=${
            encodeURIComponent(trimmed)
          }&pageSize=24&category=all&sort=all&filter=all`,
          { signal: controller.signal },
        );
        const data = await res.json();
        const page: Device[] = Array.isArray(data) ? data : (data.page || []);
        setSuggestions(page);
        setSelectedDevice(
          page.find((d) =>
            d.name.raw.toLowerCase() === trimmed.toLowerCase()
          ) ||
            null,
        );
      } catch (_) {
        // ignore aborted/failed
      }
    }, 200);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query, isSearchOpen, localAllDevices]);

  const icons = new Map<string, any>([
    ["PiScroll", <PiScroll key="PiScroll" />],
    ["PiCalendar", <PiCalendar key="PiCalendar" />],
    ["PiGitDiff", <PiGitDiff key="PiGitDiff" />],
    ["PiInfo", <PiInfo key="PiInfo" />],
    ["PiQuestion", <PiQuestion key="PiQuestion" />],
    ["PiRanking", <PiRanking key="PiRanking" />],
    ["PiChartLine", <PiChartLine key="PiChartLine" />],
    ["PiChatText", <PiChatText key="PiChatText" />],
    ["PiBook", <PiBook key="PiBook" />],
    ["PiMoney", <PiMoney key="PiMoney" />],
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
            data-placement="right"
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
            data-placement="right"
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

        {/* Search input in the middle */}
        <div
          class="mobile-search-container"
          style={{
            flex: 1,
            marginLeft: "0.5rem",
            marginRight: "0.5rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            ref={searchInputRef}
            type="search"
            name="search"
            aria-label="Search devices"
            value={query}
            onInput={(e) => queryChanged(e.currentTarget.value)}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            style={{
              width: "100%",
              borderRadius: "0.375rem",
              border: "1px solid var(--pico-muted-border-color)",
              backgroundColor: "var(--pico-background-color)",
              color: "var(--pico-color)",
              fontSize: "0.9rem",
              padding: "0",
              margin: "0",
            }}
          />
        </div>

        <div class="mobile-actions">
          <ThemeSwitcher
            showTooltip={true}
            tooltipLocation="left"
            showNames={false}
            compact={true}
          />
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
                  href="/auth/sign-in"
                  aria-label="Log In"
                  class="icon-button icon-button"
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
        </header>

        <ul class="mobile-drawer-list">
          {getAllNavigationItems().map((item) => (
            <li>
              {item.children
                ? (
                  <>
                    <button
                      class="drawer-link drawer-link-button"
                      onClick={() => toggleExpanded(item.href)}
                    >
                      <span class="drawer-link-icon">
                        ☰
                      </span>
                      <span class="drawer-link-label">
                        {item.label}
                      </span>
                    </button>
                    {expandedItems.has(item.href) && (
                      <ul class="mobile-drawer-sublist">
                        {item.children.map((child) => (
                          <li>
                            <a
                              href={child.href}
                              class={child.isActive(pathname)
                                ? "drawer-link drawer-sublink active"
                                : "drawer-link drawer-sublink"}
                              onClick={() => setIsDrawerOpen(false)}
                            >
                              <span class="drawer-link-icon">
                                {child.icon && getIcon(child.icon)}
                              </span>
                              <span class="drawer-link-label">
                                {child.label}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )
                : (
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
                      {item.label}
                    </span>
                  </a>
                )}
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
              placeholder="Name, Brand or OS..."
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
                    onClick={() => {
                      globalThis.location.href =
                        `/devices/${device.name.sanitized}`;
                    }}
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
