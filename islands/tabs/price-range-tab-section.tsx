import { DeviceCardMedium } from "../../components/cards/device-card-medium.tsx";
import { useEffect, useState } from "preact/hooks";

interface PriceRangeTabSectionProps {
  budgetDevices: any[];
  range100to200: any[];
  range200to500: any[];
  range500plus: any[];
}

export function PriceRangeTabSection(
  { budgetDevices, range100to200, range200to500, range500plus }:
    PriceRangeTabSectionProps,
) {
  const [deviceCount, setDeviceCount] = useState(6); // Default to mobile count

  useEffect(() => {
    const updateDeviceCount = () => {
      // Check if screen width is desktop size (768px and above)
      if (globalThis.innerWidth >= 768) {
        setDeviceCount(8);
      } else {
        setDeviceCount(6);
      }
    };

    // Set initial count
    updateDeviceCount();

    // Listen for resize events
    globalThis.addEventListener("resize", updateDeviceCount);

    // Cleanup
    return () => globalThis.removeEventListener("resize", updateDeviceCount);
  }, []);

  const showTab = (tabId: string, event?: Event) => {
    // Hide all tab contents
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach((content) => {
      content.classList.remove("active");
    });

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach((button) => {
      button.classList.remove("active");
    });

    // Show selected tab content
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
      selectedTab.classList.add("active");
    }

    // Add active class to clicked button
    const clickedButton = event?.target as HTMLElement;
    if (clickedButton) {
      clickedButton.classList.add("active");
    }
  };

  return (
    <div class="tab-container">
      <div class="tab-buttons">
        <button
          type="button"
          class="tab-button active"
          onClick={(e) => showTab("tab-budget", e)}
        >
          $0 - $100
        </button>
        <button
          type="button"
          class="tab-button"
          onClick={(e) => showTab("tab-100-200", e)}
        >
          $100 - $200
        </button>
        <button
          type="button"
          class="tab-button"
          onClick={(e) => showTab("tab-200-500", e)}
        >
          $200 - $500
        </button>
        <button
          type="button"
          class="tab-button"
          onClick={(e) => showTab("tab-500-plus", e)}
        >
          $500+
        </button>
      </div>

      <div id="tab-budget" class="tab-content active">
        <h3>Budget Champions ($0-$100)</h3>
        <p>
          The budget segment is where you'll find some of the most impressive
          value propositions. These devices prove that you don't need to spend a
          fortune to enjoy retro gaming. Our top budget picks deliver solid
          performance for classic 8-bit and 16-bit systems.
        </p>

        <div class="best-value-devices-grid">
          {budgetDevices.slice(0, deviceCount).map((
            device: any,
            _index: number,
          ) => (
            <a
              key={device.id}
              href={`/devices/${device.name.sanitized}`}
              style="text-decoration: none;"
            >
              <DeviceCardMedium
                device={device}
              />
            </a>
          ))}
        </div>
      </div>

      <div id="tab-100-200" class="tab-content">
        <h3>Mid-Range Sweet Spot ($100-$200)</h3>
        <p>
          This is where most gamers find their sweet spot. Mid-range devices
          typically offer the best balance of performance, build quality, and
          features. You'll find devices capable of emulating more demanding
          systems like PlayStation 1 and some PSP games.
        </p>

        <div class="best-value-devices-grid">
          {range100to200.slice(0, deviceCount).map((
            device: any,
            _index: number,
          ) => (
            <a
              key={device.id}
              href={`/devices/${device.name.sanitized}`}
              style="text-decoration: none;"
            >
              <DeviceCardMedium
                device={device}
              />
            </a>
          ))}
        </div>
      </div>

      <div id="tab-200-500" class="tab-content">
        <h3>High-End Performance ($200-$500)</h3>
        <p>
          High-end devices offer enhanced performance and premium features,
          targeting enthusiasts who want more power and better build quality.
          These devices can handle more demanding emulation and often feature
          premium materials and advanced features.
        </p>

        <div class="best-value-devices-grid">
          {range200to500.slice(0, deviceCount).map((
            device: any,
            _index: number,
          ) => (
            <a
              key={device.id}
              href={`/devices/${device.name.sanitized}`}
              style="text-decoration: none;"
            >
              <DeviceCardMedium
                device={device}
              />
            </a>
          ))}
        </div>
      </div>

      <div id="tab-500-plus" class="tab-content">
        <h3>Premium Performance ($500+)</h3>
        <p>
          Premium devices offer cutting-edge performance and features, but value
          becomes more subjective. These devices are for enthusiasts who want
          the best possible emulation performance and don't mind paying for
          premium build quality and features.
        </p>

        <div class="best-value-devices-grid">
          {range500plus.slice(0, deviceCount).map((
            device: any,
            _index: number,
          ) => (
            <a
              key={device.id}
              href={`/devices/${device.name.sanitized}`}
              style="text-decoration: none;"
            >
              <DeviceCardMedium
                device={device}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
