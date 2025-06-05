import { FreshContext, page } from "fresh";
import { DeviceCollection } from "../../../data/frontend/contracts/device-collection.ts";
import { Device } from "../../../data/frontend/contracts/device.model.ts";
import { DeviceService } from "../../../data/frontend/services/devices/device.service.ts";
import { createLoggedInPocketBaseService } from "../../../data/pocketbase/pocketbase.service.ts";
import { CollectionUpdateForm } from "../../../islands/collections/collection-update-form.tsx";
import { CustomFreshState } from "../../../interfaces/state.ts";

export const handler = {
  GET(ctx: FreshContext) {
    (ctx.state as CustomFreshState).seo = {
      title: "Retro Ranker - Update Device Collection",
      description: "Update a new device collection",
      robots: "noindex, nofollow",
    };
    return page(ctx);
  },
};

export default async function UpdateCollection(
  ctx: FreshContext,
) {
  const pocketbaseClient = await createLoggedInPocketBaseService(
    ctx.req.headers.get("cookie") ?? "",
  );

  const deviceService = await DeviceService.getInstance();
  const devices = await deviceService.getAllDevices();

  const existingCollection = await pocketbaseClient.getOne(
    "device_collections",
    ctx.params.id,
    "devices",
  );

  if (!existingCollection) {
    return <div>Collection not found</div>;
  }

  const existingCollectionData =
    existingCollection as unknown as DeviceCollection;
  const existingCollectionDevices = existingCollection.expand
    ?.devices as Device[];

  return (
    <div>
      <h1>Update Device Collection</h1>
      <CollectionUpdateForm
        allDevices={devices}
        existingCollectionDevices={existingCollectionDevices}
        collection={existingCollectionData}
      />
    </div>
  );
}
