import { PiEye, PiPencil, PiTrash } from "@preact-icons/pi";
import { DeviceCardSmall } from "../../components/cards/DeviceCardSmall.tsx";
import { DeviceCollection } from "../../data/contracts/device-collection.ts";
import { ShareButton } from "../buttons/ShareButton.tsx";

interface DeviceCollectionsProps {
  collections: DeviceCollection[];
}

export default function DeviceCollections(
  { collections }: DeviceCollectionsProps,
) {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}

function CollectionCard({ collection }: { collection: DeviceCollection }) {
  return (
    <article
      style={{ backgroundColor: "var(--pico-card-background-color-darker)" }}
    >
      <header>
        <hgroup>
          <h3 class="text-xl font-semibold mb-2">{collection.name}</h3>
          <p class="text-sm text-gray-500">
            Created: {collection.createdAt.toLocaleDateString()} | Last updated:{" "}
            {collection.updatedAt.toLocaleDateString()} |{" "}
            {collection.deviceCount}{" "}
            {collection.deviceCount === 1 ? "device" : "devices"}
          </p>
        </hgroup>
      </header>

      <div class="grid">
        {collection.devices.slice(0, 4).map((device) => (
          <DeviceCardSmall device={device} key={device.id} />
        ))}

        {collection.devices.length === 0 && (
          <div class="col-span-2 text-gray-500 text-center py-4">
            No devices in this collection
          </div>
        )}
      </div>
      <footer style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="button"
          class="button outline secondary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          data-tooltip="Delete permanently"
          data-placement="bottom"
        >
          <PiTrash /> Delete
        </button>

        <button
          type="button"
          class="button outline contrast"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginLeft: "auto",
          }}
          data-tooltip="Edit collection"
          data-placement="bottom"
        >
          <PiPencil /> Edit
        </button>

        <ShareButton
          appearance="outline contrast"
          title="Share"
          tooltip="Share collection"
          shareTitle="Check out my handheld collection:"
          url={`https://retroranker.site/collection/${collection.id}`}
        />

        <a
          href={`/collections/${collection.id}`}
          style={{
            textDecoration: "none",
          }}
          data-tooltip="View collection"
          data-placement="bottom"
        >
          <button
            type="button"
            class="button outline contrast"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <PiEye /> View
          </button>
        </a>
      </footer>
    </article>
  );
}
