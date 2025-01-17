import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { navigationItems } from "../data/navigation.ts";

interface BreadcrumbProps {
  items?: { label: string; href?: string; icon?: string }[];
  showNames?: boolean;
}

export function Breadcrumb({ items, showNames }: BreadcrumbProps) {
  const viewportWidth = signal(globalThis.innerWidth);

  const replaceTokens = (sanitizedDeviceName: string) => {
    return sanitizedDeviceName
      .replaceAll("-", " ")
      .replaceAll(" Question Mark ", "?")
      .replaceAll("Exclamation Mark", "!")
      .replaceAll("Apostrophe", "'")
      .replaceAll("Open Parenthesis ", "(")
      .replaceAll(" Close Parenthesis", ")")
      .replaceAll("Ampersand", "&")
      .replaceAll("Colon", ":")
      .replaceAll("Semicolon", ";")
      .replaceAll("Slash", "/")
      .replaceAll("Backslash", "\\");
  };

  if (!showNames) {
    showNames = viewportWidth.value > 500;
  }

  useEffect(() => {
    const handleResize = () => {
      viewportWidth.value = globalThis.innerWidth;
    };

    // Add event listener
    globalThis.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      globalThis.removeEventListener("resize", handleResize);
    };
  }, []);

  const pathSegments = globalThis.location?.pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment)) ??
    [];

  // Don't render anything if we're on the home page or only one level deep
  if (pathSegments.length <= 1) {
    return null;
  }

  // If no items provided, generate from path
  if (!items) {
    items = [
      { label: "Home", href: "/" },
      ...pathSegments.map((segment: string, index: number) => {
        // Create the href for all segments except the last one
        const href = index < pathSegments.length - 1
          ? `/${
            pathSegments.slice(0, index + 1).map((segment) =>
              encodeURIComponent(segment)
            ).join("/")
          }`
          : undefined;

        // Capitalize the segment for display
        const label = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        const icon = navigationItems.find((item) => item.href === href)?.icon;

        return { label, href, icon };
      }),
    ];
  }

  return (
    <div class="bread-crumb">
      <div>
        <a href="/" target="_self">
          <i class="ph ph-game-controller"></i>
          {showNames && <span>&nbsp;Home</span>}
        </a>
      </div>
      {items.slice(1).map((item, index) => (
        <div
          key={index}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <i class="ph ph-caret-right" style={{ marginRight: "0.5rem" }}></i>
          {item.href
            ? (
              <a href={item.href} target="_self">
                {item.icon && <i class={item.icon}></i>}
                {showNames && <span>&nbsp;{item.label}</span>}
              </a>
            )
            : (
              <span>
                {item.icon && <i class={item.icon}></i>}
                <span>&nbsp;{replaceTokens(item.label)}</span>
              </span>
            )}
        </div>
      ))}
    </div>
  );
}
