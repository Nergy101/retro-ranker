import { DeviceCollection } from "../../data/frontend/contracts/device-collection.ts";
import { CollectionCard } from "./collection-card.tsx";

interface DeviceCollectionsProps {
  collections: DeviceCollection[];
  isLoggedIn: boolean;
  likesCountMap: Record<string, number>;
  userLikedMap: Record<string, boolean>;
  userFavoritedMap: Record<string, boolean>;
}

export function DeviceCollections(
  {
    collections,
    isLoggedIn,
    likesCountMap,
    userLikedMap,
    userFavoritedMap,
  }: DeviceCollectionsProps,
) {
  return (
    <>
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          isLoggedIn={isLoggedIn}
          likesCountMap={likesCountMap}
          userLikedMap={userLikedMap}
          userFavoritedMap={userFavoritedMap}
        />
      ))}
    </>
  );
}
