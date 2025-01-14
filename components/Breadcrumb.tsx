import { navigationItems } from "../data/navigation.ts";

interface BreadcrumbProps {
  url: URL;
  items?: { label: string; href?: string; icon?: string }[];
}

export function Breadcrumb({ url, items }: BreadcrumbProps) {
  // Get path segments and filter out empty strings
  const pathSegments = url.pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));

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
          <span>&nbsp;Home</span>
        </a>
      </div>
      {items.slice(1).map((item, index) => (
        <div key={index}>
          <i class="ph ph-caret-right" style={{ marginRight: "0.5rem" }}></i>
          {item.href
            ? (
              <a href={item.href} target="_self">
                {item.icon && <i class={item.icon}></i>}
                <span>&nbsp;{item.label}</span>
              </a>
            )
            : (
              <span>
                {item.icon && <i class={item.icon}></i>}
                <span>&nbsp;{item.label}</span>
              </span>
            )}
        </div>
      ))}
    </div>
  );
}
