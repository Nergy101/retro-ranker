import { ThemeSwitcher } from "./ThemeSwitcher.tsx";
export function MobileNav({ pathname }: { pathname: string }) {
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
      <div class="mobile-nav-content">
        <ul>
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
            <a href="/" class={pathname === "/" ? "active" : ""}>
              <i class="ph ph-house"></i>
              &nbsp;Home
            </a>
          </li>
          <li>
            <a href="/devices" class={pathname.startsWith("/devices") ? "active" : ""}>
              <i class="ph ph-devices"></i>
              &nbsp;Devices
            </a>
          </li>
          <li>
            <a href="/about" class={pathname === "/about" ? "active" : ""}>
              <i class="ph ph-info"></i>
              &nbsp;About
            </a>
          </li>
          <li>
            <a href="/contact" class={pathname === "/contact" ? "active" : ""}>
              <i class="ph ph-user"></i>
              &nbsp;Contact
            </a>
          </li>
          <li>
            <ThemeSwitcher />
          </li>
        </ul>
      </div>
    </nav>
  );
} 