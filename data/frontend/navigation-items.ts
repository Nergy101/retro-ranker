export interface NavigationItem {
  label: string;
  i18nKey?: string;
  href: string;
  icon?: string;
  isActive: (pathname: string) => boolean;
  priority?: number;
}

export const navigationItems: NavigationItem[] = [
  {
    href: "/devices",
    label: "Devices",
    i18nKey: "nav.devices",
    icon: "PiScroll",
    isActive: (pathname) => pathname.startsWith("/devices"),
    priority: 0.9,
  },
  {
    href: "/release-timeline",
    label: "Releases",
    i18nKey: "nav.releases",
    icon: "PiCalendar",
    isActive: (pathname) => pathname.startsWith("/release-timeline"),
    priority: 0.8,
  },
  {
    href: "/compare",
    label: "Compare",
    i18nKey: "nav.compare",
    icon: "PiGitDiff",
    isActive: (pathname) => pathname.startsWith("/compare"),
    priority: 0.9,
  },
  {
    href: "/leaderboard",
    label: "Leaderboard",
    i18nKey: "nav.leaderboard",
    icon: "PiRanking",
    isActive: (pathname) => pathname.startsWith("/leaderboard"),
    priority: 0.7,
  },
  {
    href: "/charts",
    label: "Charts",
    i18nKey: "nav.charts",
    icon: "PiChartLine",
    isActive: (pathname) => pathname.startsWith("/charts"),
    priority: 0.7,
  },
  {
    href: "/faq",
    label: "FAQ",
    i18nKey: "nav.faq",
    icon: "PiQuestion",
    isActive: (pathname) => pathname === "/faq",
    priority: 0.6,
  },
];

// Helper function to get all navigation items (flattened, for backward compatibility)
export function getAllNavigationItems(): NavigationItem[] {
  return navigationItems;
}

// Helper function to check if an element is a NavigationItem (and not a NavigationGroup)
export function isNavigationItem(element: any): element is NavigationItem {
  return "href" in element;
}
