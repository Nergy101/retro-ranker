import { PiEye, PiPencil, PiTrash, PiX } from "@preact-icons/pi";
import { signal } from "@preact/signals-core";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
import { DeviceCollection } from "../../data/frontend/contracts/device-collection.ts";
import { ShareButton } from "../buttons/ShareButton.tsx";
export default function CollectionCard(
  { collection }: { collection: DeviceCollection },
) {
  const isDeleteDialogOpen = signal(false);

  const handleDelete = async () => {
    isDeleteDialogOpen.value = false;
    // do delete call from frontend code
    await fetch(`/api/collections/${collection.id}`, {
      method: "DELETE",
    });
    globalThis.location.reload();
  };

  return (
    <article
      style={{ backgroundColor: "var(--pico-card-background-color-darker)" }}
    >
      <dialog open={isDeleteDialogOpen}>
        <article>
          <header>
            <button type="button" role="button" aria-label="Close" rel="prev">
            </button>
            <p>
              <strong>⚠️ Confirm Deletion</strong>
            </p>
          </header>
          <p>
            Are you sure you want to delete this collection? This action cannot
            be undone.
          </p>
          <footer
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "space-between",
            }}
          >
            <button
              type="button"
              role="button"
              class="outline secondary"
              onClick={() => isDeleteDialogOpen.value = false}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <PiX /> Cancel
            </button>
            <button
              type="button"
              role="button"
              class="outline primary"
              onClick={handleDelete}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <PiTrash />
              Delete Collection
            </button>
          </footer>
        </article>
      </dialog>

      <header>
        <hgroup>
          <h3 style={{ fontSize: "1.5rem" }}>{collection.name}</h3>
          <h4 style={{ fontSize: "1rem" }}>
            {collection.description === "" ? <br /> : collection.description}
          </h4>
          <p style={{ fontSize: "0.8rem" }}>
            Created: {new Date(collection.created).toLocaleDateString()}{" "}
            | Last updated: {new Date(collection.updated).toLocaleDateString()}
            {" "}
            | {collection.devices.length}{" "}
            {collection.devices.length === 1 ? "device" : "devices"}
          </p>
        </hgroup>
      </header>

      <div class="grid">
        {collection.devices.slice(0, 4).map((device) => (
          <DeviceCardMedium device={device} key={device.id} />
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
          onClick={() => isDeleteDialogOpen.value = true}
        >
          <PiTrash /> Delete
        </button>

        <button
          type="button"
          role="button"
          class="button outline secondary"
          href={`/collections/${collection.id}/edit`}
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          data-tooltip="Edit collection (coming soon)"
          data-placement="bottom"
        >
          <PiPencil /> Edit
        </button>

        <ShareButton
          appearance="outline secondary"
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
            class="button outline secondary"
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
