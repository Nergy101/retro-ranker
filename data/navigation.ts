export type NavigationItem = {
  href: string;
  label: string;
  icon: string;
  isActive: (pathname: string) => boolean;
};

export const navigationItems: NavigationItem[] = [
  {
    href: "/",
    label: "Home",
    icon: "ph ph-game-controller",
    isActive: (pathname) => pathname === "/",
  },
  {
    href: "/devices",
    label: "Devices",
    icon: "ph ph-scroll",
    isActive: (pathname) => pathname.startsWith("/devices"),
  },
  {
    href: "/about",
    label: "About",
    icon: "ph ph-info",
    isActive: (pathname) => pathname === "/about",
  },
  {
    href: "/contact",
    label: "Contact",
    icon: "ph ph-chat-text",
    isActive: (pathname) => pathname === "/contact",
  },
]; 