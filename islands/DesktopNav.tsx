import { ThemeSwitcher } from "./ThemeSwitcher.tsx";
import { navigationItems } from "../data/navigation.ts";

export function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav class="desktop-nav">
      <ul>
        <li>
          <a href="/">
            <img
              loading="lazy"
              src="/logo-no-background.svg"
              alt="logo"
              height="150px"
              width="150px"
            />
          </a>
        </li>
        {navigationItems.map((item) => (
          <li>
            <a
              href={item.href}
              class={item.isActive(pathname) ? "active" : ""}
            >
              <div
                style={{ display: "inline-flex" }}
              >
                <item.icon />
                &nbsp;{item.label}
              </div>
            </a>
          </li>
        ))}
        <li style={{ marginLeft: "auto" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <form
              action="/devices"
              method="get"
              role="search"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginRight: "1rem",
              }}
            >
              <input
                type="search"
                placeholder="Search..."
                name="search"
                aria-label="Search"
              />
            </form>
            <div style={{ marginRight: "1rem" }}>
              <ThemeSwitcher showNames={false} showTooltip={false} />
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
}
