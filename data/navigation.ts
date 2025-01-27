import {
  PiChatText,
  PiGameController,
  PiGitDiff,
  PiInfo,
  PiScroll
} from "@preact-icons/pi";
import { JSX, VNode } from "preact";

export type NavigationItem = {
  href: string;
  label: string;
  icon: (props: {style?: JSX.CSSProperties}) => VNode<JSX.SVGAttributes>;
  isActive: (pathname: string) => boolean;
};

export const navigationItems: NavigationItem[] = [
  {
    href: "/",
    label: "Home",
    icon: (props) => PiGameController({...props}),
    isActive: (pathname) => pathname === "/",
  },
  {
    href: "/devices",
    label: "Devices",
    icon: (props) => PiScroll({...props}),
    isActive: (pathname) => pathname.startsWith("/devices"),
  },
  {
    href: "/compare",
    label: "Compare",
    icon: (props) => PiGitDiff({...props}),
    isActive: (pathname) => pathname.startsWith("/compare"),
  },
  {
    href: "/about",
    label: "About",
    icon: (props) => PiInfo({...props}),
    isActive: (pathname) => pathname === "/about",
  },
  {
    href: "/contact",
    label: "Contact",
    icon: (props) => PiChatText({...props}),
    isActive: (pathname) => pathname === "/contact",
  },
];
