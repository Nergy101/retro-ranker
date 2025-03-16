import SEO from "../../components/SEO.tsx";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import CollectionCreateForm from "../../islands/collections/collection-create-form.tsx";

export default function CreateCollection() {
  const devices = DeviceService.getInstance().getAllDevices();

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
