import { ThemeSwitcher } from "./ThemeSwitcher.tsx";
import { navigationItems } from "../data/navigation.ts";

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