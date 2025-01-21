import {
  PiChatText,
  PiGameController,
  PiInfo,
  PiScroll,
} from "@preact-icons/pi";
import { JSX, VNode } from "preact";

export type NavigationItem = {
  href: string;
  label: string;
  icon: () => VNode<JSX.SVGAttributes>;
  isActive: (pathname: string) => boolean;
};

export const navigationItems: NavigationItem[] = [
  {
    href: "/",
    label: "Home",
    icon: () => PiGameController({}),
    isActive: (pathname) => pathname === "/",
  },
  {
    href: "/devices",
    label: "Devices",
    icon: () => PiScroll({}),
    isActive: (pathname) => pathname.startsWith("/devices"),
  },
  {
    href: "/about",
    label: "About",
    icon: () => PiInfo({}),
    isActive: (pathname) => pathname === "/about",
  },
  {
    href: "/contact",
    label: "Contact",
    icon: () => PiChatText({}),
    isActive: (pathname) => pathname === "/contact",
  },
];
