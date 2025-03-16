import { FreshContext } from "$fresh/server.ts";
import { RecordModel } from "npm:pocketbase";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
import SEO from "../../components/SEO.tsx";
import { DeviceCollection } from "../../data/frontend/contracts/device-collection.ts";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { createSuperUserPocketBaseService } from "../../data/pocketbase/pocketbase.service.ts";

export default async function CollectionView(req: Request, ctx: FreshContext) {
  const id = ctx.params.id;

  const pbService = await createSuperUserPocketBaseService(
    Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
    Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
    Deno.env.get("POCKETBASE_URL")!,
  );

  // Replace this with your actual data fetching logic
  const collection = await pbService.getOne(
    "device_collections",
    id,
    "devices,owner",
  ) as RecordModel & DeviceCollection;

  collection.devices =
    collection.expand?.devices.map((d: any) => d.deviceData as Device) ?? [];
  collection.owner = collection.expand?.owner.nickname as string;

  if (!collection) {
    return (
      <div>
        <h1>Error fetching device collection</h1>
      </div>
    );
  }

  const getOwnerNameText = (): string => {
    // if last character is s then use the correct possessive form
    if (collection.owner.endsWith("s")) {
      return `${collection.owner}'`;
    }
    return `${collection.owner}'s`;
  };

  return (
    <div>
      <SEO
        title={`See ${getOwnerNameText()}'s collection: ${collection.name}`}
        description={collection.description}
        url={`https://retroranker.site/collections/${id}`}
        keywords={`${collection.name}, ${collection.description}, ${collection.owner}, ${collection.deviceCount} devices`}
        image={collection.devices[0].image?.pngUrl ?? undefined}
        robots="index, follow"
      />
      <article style={{ border: "1px solid var(--pico-primary)" }}>
        <header style={{ textAlign: "center" }}>
          <hgroup>
            <h1>
              <span style={{ color: "var(--pico-primary)" }}>
                {collection.name}
              </span>{" "}
              by{" "}
              <span style={{ color: "var(--pico-primary)" }}>
                {collection.owner}
              </span>
            </h1>
            <p>{collection.description}</p>
            <p style={{ fontSize: "0.8rem" }}>
              Created: {new Date(collection.created).toLocaleDateString()}{" "}
              | Last updated:{" "}
              {new Date(collection.updated).toLocaleDateString()} |{" "}
              {collection.devices.length}{" "}
              {collection.devices.length === 1 ? "device" : "devices"}
            </p>
          </hgroup>
        </header>
        <div class="collection-devices-grid">
          {collection.devices.map((device) => (
            <DeviceCardMedium device={device} key={device.id} />
          ))}
        </div>
      </article>
    </div>
  );
}
