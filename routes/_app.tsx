import { type PageProps } from "$fresh/server.ts";
import Footer from "../components/shared/Footer.tsx";
import { Navbar } from "../islands/navigation/Navbar.tsx";
import { DeviceService } from "../services/devices/device.service.ts";

export default function App({ Component, url, state }: PageProps) {
  const remoteAddr = (state.serverConnection as any)?.remoteAddr;
  console.info("App loaded from IP:", remoteAddr ?? "unknown");

  const allDevices = DeviceService.getInstance().getAllDevices()
    .sort((a, b) => a.name.raw.localeCompare(b.name.raw));

  return (
    <html class="transition-colors" lang="en">
      <body>
        <Navbar pathname={url.pathname} allDevices={allDevices} />

        <main class="main-content">
          <Component />
        </main>

        <Footer />
      </body>
    </html>
  );
}
