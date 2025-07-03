import type { User } from "@data/frontend/contracts/user.contract.ts";

export interface SeoData {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  keywords?: string;
  robots?: string;
  jsonLd?: string;
  // children?: ComponentChildren;
}

export interface CustomFreshState {
  user?: User | null;
  seo?: SeoData | null;
  csrfToken?: string | null;
  data?: any | null;
}
