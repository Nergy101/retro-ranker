import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { MobileNav } from "./MobileNav.tsx";
import { DesktopNav } from "./DesktopNav.tsx";
import { Device } from "../../data/device.model.ts";

export function Navbar(
  { pathname, allDevices }: { pathname: string; allDevices: Device[] },
) {
  const isMobile = useSignal(globalThis.innerWidth <= 1024);
  const isLoading = useSignal(true);

  useEffect(() => {
    const handleResize = () => {
      isMobile.value = globalThis.innerWidth <= 1024;
    };

    globalThis.addEventListener("resize", handleResize);

    // Set loading to false once the initial width is determined
    isLoading.value = false;

    return () => {
      globalThis.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isLoading.value) {
    return <article aria-busy="true" aria-live="polite" />;
  }

  return (
    <>
      {isMobile.value
        ? <MobileNav pathname={pathname} allDevices={allDevices} />
        : <DesktopNav pathname={pathname} allDevices={allDevices} />}
    </>
  );
}
