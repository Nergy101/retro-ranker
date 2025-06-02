import { FreshContext, PageProps } from "fresh";
import { PiChartLine, PiInfo } from "@preact-icons/pi";
import { DeviceComparisonResult } from "../../components/comparisons/DeviceComparisonResult.tsx";
import { DeviceComparisonText } from "../../components/comparisons/DeviceComparisonText.tsx";
import { getSEOData } from "../../components/SEO.tsx";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import { RatingsService } from "../../data/frontend/services/devices/ratings.service.ts";
import { DevicesRadarChart } from "../../islands/charts/devices-radar-chart.tsx";
import { DeviceComparisonForm } from "../../islands/forms/DeviceComparisonForm.tsx";
import { Device } from "../../data/frontend/contracts/device.model.ts";

export const handler = {
  GET(ctx: FreshContext) {
    ctx.state.seo = {
      title: "Compare Retro Gaming Handhelds",
      description: "Compare retro handhelds side-by-side with detailed specs.",
      url: "https://retroranker.site/compare",
      keywords: "compare retro handhelds, side-by-side comparison, retro gaming specs, emulation device comparison, handheld performance comparison, retro console features, gaming device specs, retro gaming hardware",
    };
    return page();
  }
};

export default function Compare() {
  return (
    <div class="compare-page">
      <header>
        <hgroup style={{ textAlign: "center" }}>
          <h1>Compare Devices</h1>
          {/* ... existing code ... */}
        </hgroup>
      </header>
      {/* ... existing code ... */}
    </div>
  );
}
