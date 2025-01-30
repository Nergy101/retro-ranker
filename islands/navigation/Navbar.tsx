import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { MobileNav } from "./MobileNav.tsx";
import { DesktopNav } from "./DesktopNav.tsx";

export function Navbar({ pathname }: { pathname: string }) {
  const isMobile = useSignal(globalThis.innerWidth <= 768);
  const isLoading = useSignal(true);

  useEffect(() => {
    const handleResize = () => {
      isMobile.value = globalThis.innerWidth <= 768;
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
        ? <MobileNav pathname={pathname} />
        : <DesktopNav pathname={pathname} />}
    </>
  );
}
