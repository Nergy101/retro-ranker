import { PageProps } from "fresh";

import { RouteConfig } from "fresh";

export const config: RouteConfig = {
  skipInheritedLayouts: true, // Skip already inherited layouts
};

export default function Layout({ Component }: PageProps) {
  // do something with state here
  return (
    <div class="container content">
      <Component />
    </div>
  );
}

