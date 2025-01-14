import { ThemeSwitcher } from "./ThemeSwitcher.tsx";
import { navigationItems } from "../data/navigation.ts";

export function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav class="desktop-nav">
      <ul>
        <li>
          <a href="/">
            <img
              src="/logo-no-background.svg"
              alt="logo"
              style={{ height: "5em" }}
            />
          </a>
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
        <div style={{ marginLeft: "auto", marginRight: "2em" }}>
          <li>
            <form
              action="/devices"
              method="get"
              role="search"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <input
                type="search"
                placeholder="Search..."
                name="search"
                aria-label="Search"
              />
            </form>
          </li>
          <li>
            <ThemeSwitcher showNames={false} tooltipLocation="left" />
          </li>
        </div>
      </ul>
    </nav>
  );
}
