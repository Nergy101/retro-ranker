import { ThemeSwitcher } from "./ThemeSwitcher.tsx";
import { navigationItems } from "../data/navigation.ts";
import { useEffect } from "preact/hooks";

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
            src="/logo-no-background.svg"
            alt="logo"
            style={{ height: "3em" }}
          />
        </a>
        <button
          class="burger-menu"
          style={{ marginRight: "2rem" }}
          onClick={() => {
            document.querySelector(".mobile-nav-content")?.classList
              .toggle("show");
          }}
          aria-label="Toggle menu"
        >
          <i class="ph ph-list"></i>
        </button>
      </div>
      <div
        class="mobile-nav-content"
        style={{
          borderBottom: "1px solid var(--pico-primary)"
        }}
      >
        <ul>
          <li>
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
          {navigationItems.map((item) => (
            <li>
              <a
                href={item.href}
                class={item.isActive(pathname) ? "active" : ""}
              >
                <i class={item.icon}></i>
                &nbsp;{item.label}
              </a>
            </li>
          ))}
          <li>
            <ThemeSwitcher />
          </li>
        </ul>
      </div>
    </nav>
  );
} 