import { FreshContext, page } from "fresh";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import { CollectionCreateForm } from "../../islands/collections/collection-create-form.tsx";
import { CustomFreshState } from "../../interfaces/state.ts";

export const handler = {
  GET(ctx: FreshContext) {
    (ctx.state as CustomFreshState).seo = {
      title: "Retro Ranker - Create Device Collection",
      description: "Create a new device collection",
      robots: "noindex, nofollow",
    };
    return page(ctx);
  },
};

export default async function CreateCollection() {
  const deviceService = await DeviceService.getInstance();
  const devices = await deviceService.getAllDevices();

  return (
    <div>
      <h1>Create Device Collection</h1>
      <CollectionCreateForm devices={devices} />
    </div>
  );
}
