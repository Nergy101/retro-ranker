interface BreadcrumbProps {
  url: URL;
  items?: { label: string; href?: string }[];
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

        return { label, href };
      }),
    ];
  }

  return (
    <nav aria-label="breadcrumb">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? <a href={item.href}>{item.label}</a> : item.label}
          </li>
        ))}
      </ul>
    </nav>
  );
}
