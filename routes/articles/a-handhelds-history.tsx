import { Context, page } from "fresh";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import { CustomFreshState } from "../../interfaces/state.ts";
import { DevicesPerReleaseYearLineChart } from "../../islands/charts/devices-per-release-year-line-chart.tsx";
import { State } from "../../utils.ts";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { DeviceCardMedium } from "../../components/cards/device-card-medium.tsx";
import { PiCalendar, PiChartLine, PiGitDiff, PiScroll } from "@preact-icons/pi";

export const handler = {
  async GET(ctx: Context<State>) {
    (ctx.state as CustomFreshState).seo = {
      title:
        "The Evolution of Handheld Gaming: A Journey Through Innovation | Retro Ranker",
      description:
        "Explore the fascinating evolution of handheld gaming devices from the early 2000s to today. Discover the game-changing devices that revolutionized portable gaming, from early emulation boxes to modern Steam Deck and beyond.",
      keywords:
        "handheld gaming evolution, portable gaming history, retro gaming devices, gaming handheld timeline, portable console development, handheld gaming milestones, emulation device history, retro gaming innovation, portable gaming evolution, handheld gaming timeline",
      url: `https://retroranker.site${ctx.url.pathname}`,
    };
    const deviceService = await DeviceService.getInstance();
    const devices = await deviceService.getAllDevices();

    (ctx.state as CustomFreshState).data.devices = devices;

    return page(ctx);
  },
};

export default async function HandheldsHistory(ctx: Context<State>) {
  const devices = (ctx.state as CustomFreshState).data.devices as Device[];

  const devices2020Names = [
    "retroid-pocket-2",
    "rg-350m",
    "powkiddy-v90",
    "gpd-win-max",
  ];

  const devices2021To2023Names = [
    "steam-deck-oled",
    "retroid-pocket-2s",
    "analogue-pocket",
    "miyoo-mini-plus",
    "rg-405m",
    "ayaneo-pocket-air",
    "rog-ally",
    "loki-zero",
  ];

  const devices2024ToPresentNames = [
    "retroid-pocket-flip-2",
    "flip-1s-ds",
    "thor",
    "miyoo-flip",
    "retroid-pocket-classic",
    "gkd-pixel-2",
    "retroid-pocket-mini-v2",
    "rg-477m",
    "ayaneo-3",
    "switch-2",
    "rg-476h",
    "pocket-s2",
  ];

  const devices2020 = devices
    .filter((device) => devices2020Names.includes(device.name.sanitized))
    .sort((a, b) => {
      const indexA = devices2020Names.indexOf(a.name.sanitized);
      const indexB = devices2020Names.indexOf(b.name.sanitized);
      return indexA - indexB;
    });

  const devices2021To2023 = devices
    .filter((device) => devices2021To2023Names.includes(device.name.sanitized))
    .sort((a, b) => {
      const indexA = devices2021To2023Names.indexOf(a.name.sanitized);
      const indexB = devices2021To2023Names.indexOf(b.name.sanitized);
      return indexA - indexB;
    });

  const devices2024ToPresent = devices
    .filter((device) =>
      devices2024ToPresentNames.includes(device.name.sanitized)
    )
    .sort((a, b) => {
      const indexA = devices2024ToPresentNames.indexOf(a.name.sanitized);
      const indexB = devices2024ToPresentNames.indexOf(b.name.sanitized);
      return indexA - indexB;
    });

  return (
    <div class="article-page">
      <article>
        <header>
          <h1>
            The Evolution of Handheld Gaming: A Journey Through Innovation
          </h1>
          <p>
            Looking for a literal <a href="/release-timeline">timeline</a>?
          </p>
          <hr />
          <p class="lead">
            Handhelds have sprinted from scrappy little emulation boxes to
            pocket PCs that chew through modern games.
            <br />This is a tour of the devices that pushed things forward, and
            why they mattered.
          </p>
        </header>

        <section>
          <h2>The Dawn of Portable Gaming (2000-2010)</h2>
          <p>
            In the early 2000s, portable gaming was split in two worlds. On one
            side: dedicated icons like Game Boy. On the other: early emulation
            devices - chunky, short-lived, and charmingly rough - testing what
            was possible in your pocket.
          </p>

          <p>
            Momentum clicked when hardware could reliably emulate classics like
            Game Boy, NES, and SNES. Suddenly, your commute could hold three
            decades of game history. These weren't just gadgets; they were tiny
            time machines.
          </p>

          <h3>Device Releases Over Time</h3>
          <p>
            Below is the release curve for handhelds since 2004. You can spot
            the quiet years, the sudden spikes, and the eras where a single
            brand set the pace.
          </p>
          <div style={{ margin: "2rem 0" }}>
            <DevicesPerReleaseYearLineChart devices={devices} minYear={2004} />
          </div>
          <div class="container">
            {/* Mobile disclaimer */}
            <div
              class="mobile-disclaimer"
              style={{
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <p>
                <strong>⚠️ Mobile Notice</strong>
                <br />
                This article contains an interactive chart that is best viewed
                on a desktop or tablet for the optimal experience. You can try
                rotating your device to view the chart.
              </p>
            </div>
          </div>
        </section>

        <section>
          <p>
            From 2004 through the mid-2010s, Nintendo set a steady rhythm while
            today's indie-leaning brands were barely on the map. Then the
            post-2018 boom hit: Anbernic, PowKiddy, AYANEO, Retroid, and friends
            started shipping at a wild clip. Peaks from 2021–2024 mark a frenzy
            of experimentation - Anbernic's bumper year in 2024, others surging
            nearby. What used to be a Nintendo-only stage is now a lively
            ecosystem where retro specialists and PC-class handhelds compete for
            your thumbs.
          </p>
        </section>

        <section>
          <h2>The Market Explosion</h2>
          <p>
            The lockdown era in 2019-2022 poured rocket fuel on the scene. With
            people at home and looking for joy, new handhelds landed fast and
            often. From 2020 onward, the release cadence turned from
            “occasionally interesting” to “try keeping up.”
          </p>
          <h3>The First Wave of devices (2018-2020)</h3>
          <p>
            The first wave was wide but uneven. Plenty of quirky form factors,
            not a ton of horsepower. Emulation topped out early, and battery
            life or controls could be hit-or-miss. Still, these devices cracked
            the door open for what came next.
          </p>
          <div class="similar-devices-grid">
            {devices2020.map((device) => (
              <a
                key={device.name.sanitized}
                href={`/devices/${device.name.sanitized}`}
                style={{ textDecoration: "none" }}
              >
                <DeviceCardMedium
                  device={device}
                  isActive={false}
                  showLikeButton={false}
                />
              </a>
            ))}
          </div>
        </section>
        <section>
          <h3>The Second Wave of devices (2021-2023)</h3>
          <p>
            Then the dam broke. Performance jumped and so did ambitions:
            GameCube and PS2 emulation became realistic, and even PS3 or Switch
            tinkering showed up on the horizon. Distinct families emerged -
            Steam Deck, Anbernic's RG line, AYN's Loki/Odin, Retroid Pocket,
            AYANEO's growing roster - each with its own vibe and audience. Not
            to speak of all the more indie brands like Miyoo, Analogue,
            PowKiddy, Game Console, the list goes on. Our database alone has
            over 100 brands.
          </p>
          <div class="similar-devices-grid">
            {devices2021To2023.map((device) => (
              <a
                key={device.name.sanitized}
                href={`/devices/${device.name.sanitized}`}
                style={{ textDecoration: "none" }}
              >
                <DeviceCardMedium
                  device={device}
                  isActive={false}
                  showLikeButton={false}
                />
              </a>
            ))}
          </div>
        </section>
        <section>
          <h2>The Third Wave of devices (2024-present)</h2>
          <p>
            The newest wave is less about raw novelty and more about refinement.
            Build quality is up, thermals are saner, software is friendlier, and
            Android/Linux gaming feels genuinely polished. For Linux, Valve's
            groundwork - proton - helped raise the floor for everyone.
          </p>
          <div class="similar-devices-grid">
            {devices2024ToPresent.map((device) => (
              <a
                key={device.name.sanitized}
                href={`/devices/${device.name.sanitized}`}
                style={{ textDecoration: "none" }}
              >
                <DeviceCardMedium
                  device={device}
                  isActive={false}
                  showLikeButton={false}
                />
              </a>
            ))}
          </div>
        </section>
        <section>
          <h2>Conclusion</h2>
          <p>
            Handheld gaming has gone from scrappy experiments to a thriving
            ecosystem of polished little powerhouses.
            <br />Whether you're chasing nostalgia or looking for a pocket-sized
            PC, there's never been more choice or more innovation.
          </p>
          <p>
            Curious which handheld might be your next companion?
            <br />
            <br />
            Browse our full <a href="/devices">device library</a>,
            <br />
            <a href="/compare">compare specs</a> between devices,
            <br />
            or dive into every <a href="/release-timeline">release</a>{" "}
            we've tracked so far.
          </p>
          <p>
            Or take a shortcut to our{" "}
            <a href="/articles/bang-for-your-buck">best value</a> article.
          </p>
        </section>
        <article class="site-introduction-content">
          <div class="site-introduction-text">
            <hgroup>
              <h2
                style={{
                  fontSize: "1.5rem",
                  color: "var(--pico-contrast)",
                  textAlign: "center",
                }}
              >
                A Handheld Database
              </h2>
              <p style={{ textAlign: "center" }}>
                Powered by the Retro Handhelds community
              </p>
            </hgroup>

            <p
              style={{
                marginBottom: "1rem",
                lineHeight: "1.6",
                textAlign: "center",
              }}
            >
              <strong style={{ color: "var(--pico-primary)" }}>
                Retro Ranker {" "}
              </strong>
              is a comprehensive database of retro gaming handhelds, designed to
              help you find the perfect device for your gaming needs. Whether
              you're a seasoned collector or just getting started, our platform
              provides detailed specifications, performance ratings, and user
              reviews to guide your decision.
            </p>
            <div class="index-buttons">
              <a
                role="button"
                class="button outline"
                href="/devices"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  color: "var(--pico-contrast)",
                }}
              >
                <PiScroll /> Devices
              </a>
              <a
                href="/compare"
                role="button"
                class="button outline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  color: "var(--pico-contrast)",
                }}
              >
                <PiGitDiff /> Compare
              </a>

              <a
                href="/release-timeline"
                role="button"
                class="button outline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  color: "var(--pico-contrast)",
                }}
              >
                <PiCalendar /> Releases
              </a>

              <a
                href="/charts"
                role="button"
                class="button outline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  color: "var(--pico-contrast)",
                }}
              >
                <PiChartLine /> Charts
              </a>
            </div>
          </div>
        </article>
      </article>
    </div>
  );
}
