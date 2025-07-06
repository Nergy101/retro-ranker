import { FreshContext, page } from "fresh";
import { DeviceCollection } from "@data/frontend/contracts/device-collection.ts";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { DeviceService } from "@data/frontend/services/devices/device.service.ts";
import { createLoggedInPocketBaseService } from "@data/pocketbase/pocketbase.service.ts";
import { CollectionUpdateForm } from "@islands/collections/collection-update-form.tsx";
import { CustomFreshState } from "@interfaces/state.ts";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

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
  const translations = (ctx.state as CustomFreshState).translations ?? {};
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
    return (
      <div>{TranslationPipe(translations, "collections.error.notFound")}</div>
    );
  }

  const existingCollectionData =
    existingCollection as unknown as DeviceCollection;
  const existingCollectionDevices = existingCollection.expand
    ?.devices as Device[];

  return (
    <div>
      <h1>{TranslationPipe(translations, "collections.update.title")}</h1>
      <CollectionUpdateForm
        allDevices={devices}
        existingCollectionDevices={existingCollectionDevices}
        collection={existingCollectionData}
      />
    </div>
  );
}
