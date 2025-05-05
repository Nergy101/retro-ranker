import { FreshContext } from "$fresh/server.ts";
import { User } from "../data/frontend/contracts/user.contract.ts";
import Footer from "../components/shared/Footer.tsx";
import { Navbar } from "../islands/navigation/Navbar.tsx";
import { DeviceService } from "../data/frontend/services/devices/device.service.ts";

export default async function App(
  req: Request,
  ctx: FreshContext,
) {
  const url = new URL(req.url);

  const user = ctx.state.user as User | null;

  const allDevices = await (await DeviceService.getInstance()).getAllDevices();

  return (
    <html class="transition-colors" lang="en">
      <body>
        <Navbar
          pathname={url.pathname}
          allDevices={allDevices}
          user={user}
        />

        <main class="main-content">
          <ctx.Component />
        </main>

        <Footer />
      </body>
    </html>
  );
}
