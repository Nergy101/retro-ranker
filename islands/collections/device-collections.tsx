import { DeviceCollection } from "@data/frontend/contracts/device-collection.ts";
import { CollectionCard } from "./collection-card.tsx";

interface DeviceCollectionsProps {
  collections: DeviceCollection[];
}

export function DeviceCollections(
  { collections }: DeviceCollectionsProps,
) {
  return (
    <>
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </>
  );
}
