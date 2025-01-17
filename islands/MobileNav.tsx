import { useEffect } from "preact/hooks";
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
            style={{ height: "3em" }}
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
          <a href="/devices">
            <i class="ph-bold ph-scroll"></i>
          </a>
          <a href="/about">
            <i class="ph-bold ph-info"></i>
          </a>
          <a href="/contact">
            <i class="ph-bold ph-chat-text"></i>
          </a>

          <button
            class="burger-menu"
            onClick={() => {
              document.querySelector(".mobile-nav-content")?.classList
                .toggle("show");
            }}
            aria-label="Toggle menu"
          >
            <i class="ph ph-magnifying-glass"></i>
          </button>

          <div style={{ padding: "0 0 0.5rem 0" }}>
            <ThemeSwitcher showTooltip={false} showNames={true} />
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
                placeholder="Search..."
                name="search"
                aria-label="Search"
              />
              <input type="submit" value="Search" />
            </form>
          </li>
          {/* {navigationItems.map((item) => (
            <li style={{ padding: "0" }}>
              <a
                href={item.href}
                class={item.isActive(pathname)
                  ? "active mobile-nav-button"
                  : "mobile-nav-button"}
              >
                <i class={item.icon}></i>
                &nbsp;{item.label}
              </a>
            </li>
          ))} */}
        </ul>
      </div>
    </nav>
  );
}
