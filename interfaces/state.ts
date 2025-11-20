export interface User {
  id: string;
  nickname: string;
  email?: string;
  created: string;
  updated: string;
}

export interface SeoData {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  keywords?: string;
  robots?: string;
  jsonLd?: string;
}

export interface CustomFreshState {
  user?: User | null;
  seo?: SeoData | null;
  csrfToken?: string | null;
  data?: any | null;
  language?: string;
  translations?: Record<string, string>;
}
