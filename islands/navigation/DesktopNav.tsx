import { ThemeSwitcher } from "./ThemeSwitcher.tsx";
import { navigationItems } from "../../data/navigation-items.ts";

export function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav class="desktop-nav">
      <ul class="desktop-nav-ul">
        <li class="logo-nav-item">
          <a href="/">
            <img
              loading="lazy"
              src="/logo-no-background.svg"
              alt="logo"
              width="120"
            />
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
          <form
            action="/devices"
            method="get"
          >
            <input
              type="search"
              placeholder="Search"
              name="search"
              aria-label="Search"
            />
          </form>
        </li>
        <li class="nav-theme-item">
          <ThemeSwitcher showNames={false} showTooltip={false} />
        </li>
      </ul>
    </nav>
  );
}
