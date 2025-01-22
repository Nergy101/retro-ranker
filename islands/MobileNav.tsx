import { PiDotsThreeVertical } from "@preact-icons/pi";
import { useEffect } from "preact/hooks";
import { navigationItems } from "../data/navigation.ts";
import { ThemeSwitcher } from "./ThemeSwitcher.tsx";

export function MobileNav({ pathname }: { pathname: string }) {
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

  return (
    <nav class="mobile-nav">
      <div class="mobile-nav-header">
        <a href="/">
          <img
            loading="lazy"
            src="/logo-no-background.svg"
            alt="logo"
            width="120"
          />
        </a>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "0.5rem",
          }}
        >
          <button
            class="burger-menu"
            onClick={() => {
              document.querySelector(".mobile-nav-content")?.classList
                .toggle("show");
            }}
            aria-label="Toggle menu"
          >
            <PiDotsThreeVertical />
          </button>

          <div>
            <ThemeSwitcher showTooltip={false} showNames={false} />
          </div>
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
          <li style={{ padding: "0" }}>
            <form action="/devices" method="get" role="search">
              <input
                type="search"
                placeholder="Name, Brand, or OS"
                name="search"
                aria-label="Search"
              />
              <input type="submit" value="Search" />
            </form>
          </li>
          {navigationItems.map((item) => (
            <li style={{ padding: "0" }}>
              <a
                href={item.href}
                class={item.isActive(pathname)
                  ? "active mobile-nav-button"
                  : "mobile-nav-button"}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {item.icon()}
                  &nbsp;{item.label}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
