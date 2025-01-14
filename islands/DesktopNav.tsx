import { ThemeSwitcher } from "./ThemeSwitcher.tsx";

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
        <li>
          <a href="/" class={pathname === "/" ? "active" : ""}>
            <i class="ph ph-house"></i>
            &nbsp;Home
          </a>
        </li>
        <li>
          <a
            href="/devices"
            class={pathname.startsWith("/devices") ? "active" : ""}
          >
            <i class="ph ph-devices"></i>
            &nbsp;Devices
          </a>
        </li>
        <li>
          <a
            href="/about"
            class={pathname === "/about" ? "active" : ""}
          >
            <i class="ph ph-info"></i>
            &nbsp;About
          </a>
        </li>
        <li>
          <a
            href="/contact"
            class={pathname === "/contact" ? "active" : ""}
          >
            <i class="ph ph-user"></i>
            &nbsp;Contact
          </a>
        </li>
        <div style={{ marginLeft: "auto", marginRight: "2em" }}>
          <li>
            <form action="/devices" method="get">
              <input
                type="search"
                placeholder="Search..."
                name="q"
                aria-label="Search"
              />
            </form>
          </li>
          <li>
            <ThemeSwitcher showNames={false} />
          </li>
        </div>
      </ul>
    </nav>
  );
} 