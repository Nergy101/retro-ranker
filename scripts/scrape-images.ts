import { Device } from "../data/device.model.ts";

async function downloadImage(url: string, deviceName: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
    
    const imageData = new Uint8Array(await response.arrayBuffer());
    const sanitizedName = deviceName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filePath = `static/devices/${sanitizedName}.png`;
    
    await Deno.mkdir('static/devices', { recursive: true });
    await Deno.writeFile(filePath, imageData);
    
    console.info(`✅ ${deviceName}`);
  } catch (error) {
    console.error(`❌ ${deviceName}: ${error.message}`);
  }
}

export async function downloadDeviceImages(devices: Device[]) {
  console.info(`Starting download of ${devices.length} device images...`);
  
  const downloads = devices.map(device => 
    downloadImage(device.imageUrl, device.name)
  );
  
  await Promise.all(downloads);
  
  console.info('Finished downloading all images!');
}

// Example usage:.
import { getAllDevices } from "../data/device.service.ts";
const devices = await getAllDevices();
await downloadDeviceImages(devices);
