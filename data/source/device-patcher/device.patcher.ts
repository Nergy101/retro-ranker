import { Device } from "../../device.model.ts";

// Read the existing devices
const filePath = "../results/handhelds.json";
const devices = JSON.parse(
  new TextDecoder().decode(
    await Deno.readFile(filePath),
  ),
) as Device[];

console.info(`Loaded ${devices.length} devices`);

// Example: Update release dates for specific devices
const devicesToUpdate: Partial<Device>[] = [
  {
    id: "rg-35xx-sp",
    released: {
      raw: "2024-06-01T00:00:00Z",
      mentionedDate: new Date("2024-06-01T00:00:00Z"),
    },
  },
  {
    id: "rg-35xx-h",
    released: {
      raw: "2024-01-05T00:00:00Z", // jan 2024
      mentionedDate: new Date("2024-01-05T00:00:00Z"),
    },
  },
];

// Update the devices
for (const deviceToUpdate of devicesToUpdate) {
  let device = devices.find((d) => d.id === deviceToUpdate.id);

  if (device) {
    device = {
      ...device,
      ...deviceToUpdate,
    };
    console.info(
      `Updated ${deviceToUpdate.id}`,
    );
  } else {
    console.warn(`Device not found: ${deviceToUpdate.id}`);
  }
}

// Save the updated devices back to file
const updatedJson = JSON.stringify(devices, null, 2);
console.log(filePath);
await Deno.writeFile(filePath, new TextEncoder().encode(updatedJson));

console.info("Devices updated and saved successfully!");
