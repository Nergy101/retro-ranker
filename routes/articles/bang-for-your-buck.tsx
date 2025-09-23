import { Context, page } from "fresh";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import { CustomFreshState } from "../../interfaces/state.ts";
import { State } from "../../utils.ts";
import { PerformanceVsPriceScatterPlot } from "../../islands/charts/performance-vs-price-scatter.tsx";
import { PriceVsReleaseYear } from "../../islands/charts/price-vs-release-year.tsx";
import { PriceRangeTabSection } from "../../islands/tabs/price-range-tab-section.tsx";

export const handler = {
  async GET(ctx: Context<State>) {
    (ctx.state as CustomFreshState).seo = {
      title:
        "Top 10 Best Bang-for-Your-Buck Retro Gaming Handhelds Over $100 | Retro Ranker",
      description:
        "Discover the best value retro gaming handhelds over $100. Our comprehensive analysis reveals the top devices that deliver exceptional performance per dollar spent in the mid-range and premium segments.",
      keywords:
        "best value retro handhelds, bang for buck gaming devices, affordable retro gaming, value gaming handhelds, budget retro consoles, performance per dollar, retro gaming value analysis",
    };

    const deviceService = await DeviceService.getInstance();
    const devices = await deviceService.getAllDevices();

    // Calculate value scores for all devices
    const devicesWithValue = devices
      .filter((device) =>
        device.pricing.average &&
        device.pricing.average > 0 &&
        device.totalRating > 0 &&
        !device.pricing.discontinued
      )
      .map((device) => ({
        ...device,
        valueScore: device.totalRating / (device.pricing.average! / 100), // Rating per $100
        pricePerPoint: device.pricing.average! / device.totalRating, // Price per rating point
      }))
      .sort((a, b) => b.valueScore - a.valueScore);

    // Group devices by price ranges for analysis
    const budgetDevices = devicesWithValue.filter((d) =>
      d.pricing.average! <= 100
    );
    const range100to200 = devicesWithValue.filter((d) =>
      d.pricing.average! > 100 && d.pricing.average! <= 200
    );
    const range200to500 = devicesWithValue.filter((d) =>
      d.pricing.average! > 200 && d.pricing.average! <= 500
    );
    const range500plus = devicesWithValue.filter((d) =>
      d.pricing.average! > 500
    );

    (ctx.state as CustomFreshState).data = {
      devices,
      budgetDevices,
      range100to200,
      range200to500,
      range500plus,
    };

    return page(ctx);
  },
};

export default function BangForYourBuckPage(ctx: Context<State>) {
  const data = (ctx.state as CustomFreshState).data;
  const {
    devices,
    budgetDevices,
    range100to200,
    range200to500,
    range500plus,
  } = data;

  return (
    <div class="container">
      {/* Mobile disclaimer */}
      <div class="mobile-disclaimer">
        <p>
          📱 <strong>Mobile Notice:</strong>{" "}
          This article contains interactive charts and detailed analysis that
          are best viewed on a desktop or tablet for the optimal experience.
        </p>
      </div>

      <article>
        <header>
          <h1>
            Bang for your buck: Finding the Best Value Retro Gaming Handhelds
          </h1>
          <p class="lead">
            Discover which retro gaming handhelds deliver the most performance
            for your dollar. Our interactive scatter plot reveals the
            relationship between device ratings and pricing, while our value
            champion tabs highlight the top performers in each price
            bracket—from budget-friendly options under $100 to premium devices
            over $500.
          </p>
          <div class="grid" style="margin-top: 2rem;">
            <div>
              <strong>Analysis Method:</strong>{" "}
              Performance Rating ÷ (Price ÷ $100)<br />
              <strong>Data Source:</strong> {devices.length}{" "}
              devices analyzed<br />
              <strong>Last Updated:</strong> 23-sept-2025
            </div>
          </div>
        </header>

        <section>
          <h2>Value Champions by Price Bracket</h2>
          <p>
            Below are the top 5 value champions in each price bracket, ranked by
            their value score (performance rating per $100 spent). These devices
            offer the best bang for your buck within their respective price
            ranges:
          </p>
          <ul>
            <li>
              <strong>Budget Champions ($0-$100):</strong>{" "}
              {budgetDevices.length}{" "}
              devices analyzed - perfect for casual retro gaming
            </li>
            <li>
              <strong>Mid-Range Sweet Spot ($100-$200):</strong>{" "}
              {range100to200.length}{" "}
              devices analyzed - the optimal balance of performance and price
            </li>
            <li>
              <strong>High-End Performance ($200-$500):</strong>{" "}
              {range200to500.length}{" "}
              devices analyzed - enhanced features for enthusiasts
            </li>
            <li>
              <strong>Premium Tier ($500+):</strong> {range500plus.length}{" "}
              devices analyzed - cutting-edge performance and premium build
              quality
            </li>
          </ul>

          <PriceRangeTabSection
            budgetDevices={budgetDevices}
            range100to200={range100to200}
            range200to500={range200to500}
            range500plus={range500plus}
          />
        </section>

        <section>
          <h2>What Makes a Device a Value Champion?</h2>
          <p>
            Our value analysis considers several key factors beyond just price
            and performance:
          </p>

          <div class="grid">
            <div>
              <h3>Performance per Dollar</h3>
              <p>
                The core metric: how much gaming performance you get for every
                $100 spent. Higher scores indicate better value.
              </p>
            </div>
            <div>
              <h3>Build Quality</h3>
              <p>
                Devices with solid construction, good buttons, and durable
                materials provide better long-term value.
              </p>
            </div>
            <div>
              <h3>Feature Completeness</h3>
              <p>
                Essential features like good screens, comfortable controls, and
                adequate battery life contribute to overall value.
              </p>
            </div>
            <div>
              <h3>Emulation Capability</h3>
              <p>
                The range of systems a device can emulate effectively determines
                its versatility and long-term usefulness.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>Interactive Performance vs Price Analysis</h2>
          <p>
            The scatter plot below shows every device in our database plotted by
            its performance rating (vertical axis) against its average price
            (horizontal axis). Each dot represents a device, with different
            colors indicating different brands. This visualization helps you
            identify:
          </p>
          <ul>
            <li>
              <strong>Value Champions:</strong>{" "}
              Devices that sit high on the performance scale relative to their
              price (upper-left area)
            </li>
            <li>
              <strong>Premium Options:</strong>{" "}
              High-performance devices that command premium prices (upper-right
              area)
            </li>
            <li>
              <strong>Budget Performers:</strong>{" "}
              Affordable devices that punch above their weight (lower-left area)
            </li>
            <li>
              <strong>Brand Positioning:</strong>{" "}
              How different manufacturers position their devices in the market
            </li>
          </ul>
          <p>
            Use the interactive controls to filter by brand, minimum rating, and
            price range. Click on any device dot to view its detailed page.
          </p>
        </section>

        <section>
          <div style="margin: 2rem 0;">
            <PerformanceVsPriceScatterPlot devices={devices} />
          </div>
        </section>

        <section>
          <div style="margin: 2rem 0;">
            <PriceVsReleaseYear devices={devices} />
          </div>
          <p>
            This chart shows how device pricing has evolved over time.{" "}
            <br />As you can see, prices have generally increased over time, but
            there have been some fluctuations.
          </p>
          <h2>Market Trends and Insights</h2>
          <p>
            Our analysis reveals several interesting trends in the retro gaming
            handheld market:
          </p>

          <ul>
            <li>
              <strong>Sweet Spot Pricing:</strong>{" "}
              The $100-$200 range consistently offers the best value, with
              devices providing excellent performance-to-price ratios.
            </li>
            <li>
              <strong>Diminishing Returns:</strong>{" "}
              Above $300, the value proposition becomes more about specific
              features and use cases rather than raw performance per dollar.
            </li>
            <li>
              <strong>Brand Competition:</strong>{" "}
              Multiple manufacturers are competing in the value segment, driving
              innovation and better pricing.
            </li>
            <li>
              <strong>Feature Evolution:</strong>{" "}
              Even budget devices now include features that were premium-only
              just a few years ago, like OLED screens and improved controls.
            </li>
          </ul>
        </section>

        <section>
          <h2>How to Choose Your Perfect Value Device</h2>
          <p>
            When selecting a retro gaming handheld based on value, consider
            these factors:
          </p>

          <div class="grid">
            <div>
              <h3>Your Budget</h3>
              <p>
                Set a realistic budget and focus on devices within that range.
                Remember that accessories and games can add to the total cost.
              </p>
            </div>
            <div>
              <h3>Gaming Preferences</h3>
              <p>
                What systems do you want to emulate? 8-bit and 16-bit systems
                can run on budget devices, while PS1 and PSP need more power.
              </p>
            </div>
            <div>
              <h3>Form Factor</h3>
              <p>
                Consider whether you prefer vertical (Game Boy style) or
                horizontal (PSP style) layouts, and screen size preferences.
              </p>
            </div>
            <div>
              <h3>Future-Proofing</h3>
              <p>
                Consider how long you plan to use the device and whether you
                want room to grow into more demanding emulation.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>Key Insights from Our Analysis</h2>
          <p>
            Our performance vs price analysis reveals several important patterns
            in the retro gaming handheld market:
          </p>
          <ul>
            <li>
              <strong>Value Distribution:</strong>{" "}
              The scatter plot shows that value champions can be found across
              all price ranges, not just in the budget segment
            </li>
            <li>
              <strong>Brand Positioning:</strong>{" "}
              Different manufacturers target different market segments, with
              some focusing on value while others emphasize premium features
            </li>
            <li>
              <strong>Performance Scaling:</strong>{" "}
              Higher prices generally correlate with better performance, but the
              relationship isn't linear—some mid-range devices offer exceptional
              value
            </li>
            <li>
              <strong>Market Segmentation:</strong>{" "}
              Each price bracket serves different needs, from casual retro
              gaming to enthusiast-level emulation
            </li>
          </ul>

          <p>
            The value champions in each price bracket represent the best
            performance-per-dollar ratios within their respective segments.
            Whether you're looking for an affordable entry point or a premium
            device with cutting-edge features, there's a value champion that
            fits your budget and gaming needs.
          </p>

          <div style="margin-top: 2rem; padding: 1rem; background: var(--pico-background-color); border-left: 4px solid var(--pico-primary);">
            <p style="margin: 0;">
              <strong>Ready to explore more devices?</strong>
              Check out our <a href="/devices">complete device database</a>{" "}
              or use our <a href="/compare">comparison tool</a>{" "}
              to find the perfect device for your needs.
            </p>
          </div>
        </section>
      </article>
    </div>
  );
}
