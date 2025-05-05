import SEO from "../../../components/SEO.tsx";
import { DeviceCollection } from "../../../data/frontend/contracts/device-collection.ts";
import { Device } from "../../../data/frontend/contracts/device.model.ts";
import { DeviceService } from "../../../data/frontend/services/devices/device.service.ts";
import { createLoggedInPocketBaseService } from "../../../data/pocketbase/pocketbase.service.ts";
import CollectionUpdateForm from "../../../islands/collections/collection-update-form.tsx";

export default async function UpdateCollection(
  request: Request,
  { params }: { params: { id: string } },
) {
  const pocketbaseClient = await createLoggedInPocketBaseService(
    request.headers.get("cookie") ?? "",
  );

  const deviceService = await DeviceService.getInstance();
  const devices = await deviceService.getAllDevices();

  const existingCollection = await pocketbaseClient.getOne(
    "device_collections",
    params.id,
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
      <SEO
        title="Create Device Collection"
        description="Create a new device collection"
        robots="noindex, nofollow"
      />

      <h1>Update Device Collection</h1>
      <CollectionUpdateForm
        allDevices={devices}
        existingCollectionDevices={existingCollectionDevices}
        collection={existingCollectionData}
      />
    </div>
  );
}
