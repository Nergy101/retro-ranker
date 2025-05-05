import SEO from "../../components/SEO.tsx";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import CollectionCreateForm from "../../islands/collections/collection-create-form.tsx";

export default async function CreateCollection() {
  const deviceService = await DeviceService.getInstance();
  const devices = await deviceService.getAllDevices();

  return (
    <div>
      <SEO
        title="Create Device Collection"
        description="Create a new device collection"
        robots="noindex, nofollow"
      />

      <h1>Create Device Collection</h1>
      <CollectionCreateForm devices={devices} />
    </div>
  );
}
