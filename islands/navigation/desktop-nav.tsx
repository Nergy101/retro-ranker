import { ProfileImage } from "../../components/auth/profile-image.tsx";
import { DeviceCardMedium } from "../../components/cards/device-card-medium.tsx";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { User } from "../../data/frontend/contracts/user.contract.ts";
import { navigationItems } from "../../data/frontend/navigation-items.ts";
import {
  getNewestDevices,
  searchDevices,
} from "../../data/frontend/services/utils/search.utils.ts";
import {
  PiBook,
  PiCalendar,
  PiChartLine,
  PiChatText,
  PiClockCounterClockwise,
  PiDotsThree,
  PiGitDiff,
  PiInfo,
  PiMagnifyingGlass,
  PiMoney,
  PiQuestion,
  PiRanking,
  PiScroll,
  PiSignIn,
  PiUserPlus as _PiUserPlus,
  PiX,
} from "@preact-icons/pi";
import { useEffect, useRef, useState } from "preact/hooks";
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
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [suggestions, setSuggestions] = useState<Device[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [localAllDevices, setLocalAllDevices] = useState<Device[]>(
    allDevices ?? [],
  );
  const isActive = (deviceName: string) => {
    return deviceName.toLowerCase() === selectedDevice?.name.raw.toLowerCase();
  };

  useEffect(() => {
    // Disable outside-click clearing while overlay is open to prevent flicker
    if (isSearchOpen) return;

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
  }, [isSearchOpen]);

  // Global ESC handler to close search overlay
  useEffect(() => {
    if (!isSearchOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen]);

  const ensureDevicesLoaded = async () => {
    if (localAllDevices && localAllDevices.length > 0) return;
    try {
      // Use the same API call that works for getting devices
      const res = await fetch(
        "/api/devices?pageSize=1000&category=all&sort=new-arrivals&filter=all",
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
      document.body.style.overflow = "hidden";
      setTimeout(() => overlayInputRef.current?.focus(), 0);
      ensureDevicesLoaded();
      // If query empty, try to show defaults immediately
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
      document.body.style.overflow = "";
      setSuggestions([]);
      setQuery("");
      setSelectedDevice(null);
    }

    // Cleanup function to ensure overflow is reset
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  // Ensure body scroll is reset on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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
      // Only update defaults if we actually have a source list; otherwise keep existing (API-fetched) defaults to avoid flicker
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
    ["PiThreeDots", <PiDotsThree key="PiThreeDots" />],
    ["PiBook", <PiBook key="PiBook" />],
    ["PiMoney", <PiMoney key="PiMoney" />],
    [
      "PiClockCounterClockwise",
      <PiClockCounterClockwise key="PiClockCounterClockwise" />,
    ],
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
            <li
              class="nav-item"
              onMouseEnter={() => item.children && setOpenDropdown(item.href)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
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
                    {item.children ? "☰" : (item.icon && getIcon(item.icon))}
                  </span>
                  {item.label}
                </span>
              </a>
              {item.children && openDropdown === item.href && (
                <ul class="nav-dropdown">
                  {item.children.map((child) => (
                    <li>
                      <a
                        href={child.href}
                        class={child.isActive(pathname)
                          ? "nav-dropdown-link active"
                          : "nav-dropdown-link"}
                        aria-label={child.label}
                      >
                        <span class="nav-dropdown-link-icon">
                          {child.icon && getIcon(child.icon)}
                        </span>
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
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
              placeholder="Name, Brand or OS..."
              type="search"
              name="search"
              aria-label="Search"
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setIsSearchOpen(true);
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
                setIsSearchOpen(true);
              }}
              data-tooltip="Search"
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

          <ThemeSwitcher
            showNames={false}
            showTooltip={true}
            tooltipLocation="left"
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

      {isSearchOpen && (
        <div
          class="desktop-search-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div class="desktop-search-bar">
            <input
              ref={overlayInputRef}
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
                style={{ color: "var(--pico-contrast)", fontSize: "1rem" }}
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
                style={{ color: "var(--pico-contrast)", fontSize: "1rem" }}
              >
                <PiX />
              </span>
            </button>
          </div>
          <div class="desktop-search-results">
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
      )}
    </div>
  );
}
