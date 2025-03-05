import { PiArticle } from "@preact-icons/pi";
import { Device } from "../../data/device.model.ts";

interface DeviceComparisonTextProps {
  devices: Device[];
}

export function DeviceComparisonText({ devices }: DeviceComparisonTextProps) {
  // Only show for exactly 2 devices
  if (devices.length !== 2) {
    return null;
  }

  const [device1, device2] = devices;

  // Get price difference
  const price1 = device1.pricing?.average || 0;
  const price2 = device2.pricing?.average || 0;
  const priceDiff = Math.abs(price1 - price2);
  const cheaperDevice = price1 < price2 ? device1 : device2;
  const expensiveDevice = price1 < price2 ? device2 : device1;

  // Get performance difference
  const performance1 = device1.totalRating || 0;
  const performance2 = device2.totalRating || 0;
  const perfDiff = Math.abs(performance1 - performance2).toFixed(1);
  const betterDevice = performance1 > performance2 ? device1 : device2;
  const worseDevice = performance1 > performance2 ? device2 : device1;

  // Get screen size difference
  const screen1 = device1.screen?.size || 0;
  const screen2 = device2.screen?.size || 0;
  const screenDiff = Math.abs(screen1 - screen2).toFixed(1);
  const biggerScreen = screen1 > screen2 ? device1 : device2;

  // Get battery difference
  const battery1 = device1.battery?.capacity || 0;
  const battery2 = device2.battery?.capacity || 0;
  const batteryDiff = Math.abs(battery1 - battery2);
  const betterBattery = battery1 > battery2 ? device1 : device2;

  // Get RAM difference
  const ram1 = device1.ram?.sizes?.[0] || 0;
  const ram2 = device2.ram?.sizes?.[0] || 0;
  const ramDiff = Math.abs(ram1 - ram2);
  const moreRam = ram1 > ram2 ? device1 : device2;

  // Format values safely
  const formatScreenSize = (size: number | null) =>
    size ? `${size}-inch` : "N/A";
  const formatRam = (device: Device) =>
    device.ram?.sizes?.[0]
      ? `${device.ram.sizes[0]} ${device.ram.unit}`
      : "N/A";
  const formatBattery = (device: Device) =>
    device.battery?.capacity
      ? `${device.battery.capacity}${device.battery.unit}`
      : "N/A";
  const formatOS = (device: Device) =>
    device.os?.list?.length ? device.os.list.join(", ") : "Unknown OS";
  const formatPrice = (device: Device) =>
    device.pricing?.average
      ? `${device.pricing.average} ${device.pricing.currency}`
      : "N/A";
  const formatRating = (rating: number) => rating ? rating.toFixed(1) : "N/A";

  return (
    <details class="device-comparison-details">
      <summary
        style={{ display: "flex", alignItems: "center" }}
      >
        <span
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <PiArticle />
          Textual comparison
        </span>
      </summary>

      <article class="device-comparison-text" style={{ marginTop: "1rem" }}>
        <p>
          The <strong>{device1.brand.raw} {device1.name.raw}</strong> and{" "}
          <strong>{device2.brand.raw} {device2.name.raw}</strong>{" "}
          are both retro gaming handhelds with different specifications and
          performance characteristics. This comparison highlights the key
          differences to help you choose the right device for your gaming needs.
        </p>

        <h3>Price Comparison</h3>
        <p>
          The{" "}
          <strong>{cheaperDevice.brand.raw} {cheaperDevice.name.raw}</strong>
          {" "}
          is priced at approximately{" "}
          <strong>{formatPrice(cheaperDevice)}</strong>, while the{" "}
          <strong>
            {expensiveDevice.brand.raw} {expensiveDevice.name.raw}
          </strong>{" "}
          costs around <strong>{formatPrice(expensiveDevice)}</strong>.
          {priceDiff > 0
            ? (
              <>
                This represents a price difference of{" "}
                <strong>
                  {priceDiff} {device1.pricing?.currency || "units"}
                </strong>, making the {cheaperDevice.name.raw}{" "}
                the more budget-friendly option.
              </>
            )
            : <>Both devices are priced similarly.</>}
        </p>

        <h3>Performance Rating</h3>
        <p>
          In terms of overall performance, the{" "}
          <strong>{betterDevice.brand.raw} {betterDevice.name.raw}</strong>
          scores <strong>{formatRating(betterDevice.totalRating)}/10</strong>
          {" "}
          in our rating system, compared to the{" "}
          <strong>{worseDevice.brand.raw} {worseDevice.name.raw}</strong>'s
          score of <strong>{formatRating(worseDevice.totalRating)}/10</strong>.
          {Number(perfDiff) > 0
            ? (
              <>
                This{" "}
                {perfDiff}-point difference reflects variations in processing
                power, emulation capabilities, and overall user experience.
              </>
            )
            : <>Both devices have similar performance ratings.</>}
        </p>

        <h3>Hardware Specifications</h3>
        <p>
          The <strong>{device1.brand.raw} {device1.name.raw}</strong> features a
          {" "}
          <strong>{formatScreenSize(device1.screen?.size)}</strong> display,
          <strong>{formatRam(device1)}</strong> of RAM, and a{" "}
          <strong>{formatBattery(device1)}</strong> battery. In comparison, the
          {" "}
          <strong>{device2.brand.raw} {device2.name.raw}</strong> offers a{" "}
          <strong>{formatScreenSize(device2.screen?.size)}</strong> display,
          <strong>{formatRam(device2)}</strong> of RAM, and a{" "}
          <strong>{formatBattery(device2)}</strong> battery.
        </p>

        {(Number(screenDiff) > 0 || batteryDiff > 0 || ramDiff > 0) && (
          <p>
            {Number(screenDiff) > 0 && (
              <>
                The <strong>{biggerScreen.name.raw}</strong> has a{" "}
                {screenDiff}-inch larger screen.
              </>
            )}
            {batteryDiff > 0 && (
              <>
                The <strong>{betterBattery.name.raw}</strong> offers{" "}
                {batteryDiff}
                {device1.battery?.unit || "mAh"} more battery capacity.
              </>
            )}
            {ramDiff > 0 && (
              <>
                For memory, the <strong>{moreRam.name.raw}</strong> provides
                {" "}
                {ramDiff} {device1.ram?.unit || "GB"}{" "}
                more RAM, which can impact performance when running demanding
                emulators.
              </>
            )}
          </p>
        )}

        <h3>Operating System and Compatibility</h3>
        <p>
          The <strong>{device1.brand.raw} {device1.name.raw}</strong> runs on
          {" "}
          {formatOS(device1)}, while the{" "}
          <strong>{device2.brand.raw} {device2.name.raw}</strong> uses{" "}
          {formatOS(device2)}. This affects the user interface experience and
          available software options on each device.
        </p>

        <p>
          Both devices are capable of emulating retro gaming systems, but their
          performance varies across different platforms. Review the detailed
          emulation performance specifications below to see how each device
          handles specific gaming systems.
        </p>
      </article>
    </details>
  );
}
