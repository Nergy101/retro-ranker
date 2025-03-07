import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Device } from "../../data/device.model.ts";
import { DesktopNav } from "./DesktopNav.tsx";
import { MobileNav } from "./MobileNav.tsx";
import { User } from "../../data/contracts/user.contract.ts";

export function Navbar(
  { pathname, allDevices, user }: {
    pathname: string;
    allDevices: Device[];
    user: User | null;
  },
) {
  const isMobile = useSignal(globalThis.innerWidth <= 1024);
  const isLoading = useSignal(true);

  useEffect(() => {
    const handleResize = () => {
      isMobile.value = globalThis.innerWidth <= 1024;
    };

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      isLoading.value = false;
    }, 1000); // 1 second timeout

    try {
      // Add resize listener
      globalThis.addEventListener("resize", handleResize);

      // Set initial mobile state
      isMobile.value = globalThis.innerWidth <= 1024;

      // Set loading to false once initial width is determined
      isLoading.value = false;
    } catch {
      // Ensure loading is set to false even if there's an error
      isLoading.value = false;
    }

    return () => {
      globalThis.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  if (isLoading.value) {
    return <article aria-busy="true" aria-live="polite" />;
  }

  return (
    <>
      {isMobile.value
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
