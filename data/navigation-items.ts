import {
  PiCalendar,
  PiChartLine,
  PiChatText,
  PiGameController,
  PiGitDiff,
  PiInfo,
  PiScroll,
} from "@preact-icons/pi";
import { JSX, VNode } from "preact";

export interface NavigationItem {
  label: string;
  href: string;
  icon?: (props: { style?: JSX.CSSProperties }) => VNode<JSX.SVGAttributes>;
  isActive: (pathname: string) => boolean;
  priority?: number;
}

export const navigationItems: NavigationItem[] = [
  {
    href: "/",
    label: "Home",
    icon: (props) => PiGameController({ ...props }),
    isActive: (pathname) => pathname === "/",
    priority: 1,
  },
  // {
  //   href: "/devices",
  //   label: "Devices",
  //   icon: (props) => PiScroll({ ...props }),
  //   isActive: (pathname) => pathname.startsWith("/devices"),
  //   priority: 0.9,
  // },
  {
    href: "/compare",
    label: "Compare",
    icon: (props) => PiGitDiff({ ...props }),
    isActive: (pathname) => pathname.startsWith("/compare"),
    priority: 0.9,
  },
  {
    href: "/release-timeline",
    label: "Releases",
    icon: (props) => PiCalendar({ ...props }),
    isActive: (pathname) => pathname.startsWith("/release-timeline"),
    priority: 0.9,
  },
  {
    href: "/charts",
    label: "Charts",
    icon: (props) => PiChartLine({ ...props }),
    isActive: (pathname) => pathname.startsWith("/charts"),
    priority: 0.9,
  },
  {
    href: "/about",
    label: "About",
    icon: (props) => PiInfo({ ...props }),
    isActive: (pathname) => pathname === "/about",
    priority: 0.5,
  },
  {
    href: "/contact",
    label: "Contact",
    icon: (props) => PiChatText({ ...props }),
    isActive: (pathname) => pathname === "/contact",
    priority: 0.5,
  },
];
