import { PageProps } from "$fresh/server.ts";

import { RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  skipInheritedLayouts: true, // Skip already inherited layouts
};

export default function Layout({ Component }: PageProps) {
  // do something with state here
  return (
    <div class="container-fluid content test">
      <Component />
    </div>
  );
}
