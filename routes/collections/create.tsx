import { FreshContext, page } from "fresh";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import { CollectionCreateForm } from "../../islands/collections/collection-create-form.tsx";
import { CustomFreshState } from "../../interfaces/state.ts";

export const handler = {
  GET(ctx: FreshContext) {
    (ctx.state as CustomFreshState).seo = {
      title: "Create Device Collection | Retro Ranker",
      description:
        "Create a personalized collection of your favorite retro gaming handhelds. Organize and share your curated list of portable emulation devices.",
      robots: "noindex, nofollow",
      url: `https://retroranker.site${ctx.url.pathname}`,
    };
    return page(ctx);
  },
};

export default async function CreateCollection(_ctx: FreshContext) {
  const deviceService = await DeviceService.getInstance();
  const devices = await deviceService.getAllDevices();

  return (
    <div>
      <h1>Create Collection</h1>
      <CollectionCreateForm devices={devices} />
    </div>
  );
}
