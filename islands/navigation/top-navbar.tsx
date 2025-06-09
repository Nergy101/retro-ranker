import { useEffect, useState } from "@preact/hooks";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { User } from "@data/frontend/contracts/user.contract.ts";
import { DesktopNav } from "./desktop-nav.tsx";
import { MobileNav } from "./mobile-nav.tsx";

export function TopNavbar(
  { pathname, allDevices, user }: {
    pathname: string;
    allDevices: Device[];
    user: User | null;
  },
) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(globalThis.innerWidth <= 1250);
    };

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second timeout

    try {
      // Add resize listener
      globalThis.addEventListener("resize", handleResize);

      // Set initial mobile state
      setIsMobile(globalThis.innerWidth <= 1250);

      // Set loading to false once initial width is determined
      setIsLoading(false);
    } catch {
      // Ensure loading is set to false even if there's an error
      setIsLoading(false);
    }

    return () => {
      globalThis.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  });

  if (isLoading) {
    return <article aria-busy="true" aria-live="polite" />;
  }

  return (
    <>
      {isMobile
        ? <MobileNav pathname={pathname} allDevices={allDevices} user={user} />
        : (
          <DesktopNav
            pathname={pathname}
            allDevices={allDevices}
            user={user}
          />
        )}
    </>
  );
}
