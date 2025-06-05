export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  isActive: (pathname: string) => boolean;
  priority?: number;
}

export const navigationItems: NavigationItem[] = [
  {
    href: "/devices",
    label: "Devices",
    icon: "PiScroll",
    isActive: (pathname) => pathname.startsWith("/devices"),
    priority: 0.9,
  },
  {
    href: "/release-timeline",
    label: "Releases",
    icon: "PiCalendar",
    isActive: (pathname) => pathname.startsWith("/release-timeline"),
    priority: 0.8,
  },
  {
    href: "/compare",
    label: "Compare",
    icon: "PiGitDiff",
    isActive: (pathname) => pathname.startsWith("/compare"),
    priority: 0.9,
  },
  {
    href: "/leaderboard",
    label: "Leaderboard",
    icon: "PiRanking",
    isActive: (pathname) => pathname.startsWith("/leaderboard"),
    priority: 0.7,
  },
  {
    href: "/charts",
    label: "Charts",
    icon: "PiChartLine",
    isActive: (pathname) => pathname.startsWith("/charts"),
    priority: 0.7,
  },
  {
    href: "/about",
    label: "About",
    icon: "PiInfo",
    isActive: (pathname) => pathname === "/about",
    priority: 0.8,
  },
  {
    href: "/faq",
    label: "FAQ",
    icon: "PiQuestion",
    isActive: (pathname) => pathname === "/faq",
    priority: 0.8,
  },
  {
    href: "/contact",
    label: "Contact",
    icon: "PiChatText",
    isActive: (pathname) => pathname === "/contact",
    priority: 0.6,
  },
];
