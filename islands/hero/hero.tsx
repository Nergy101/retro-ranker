import {
  PiBaseballCap,
  PiBatteryCharging,
  PiBatteryFull,
  PiBlueprint,
  PiBomb,
  PiBowlSteam,
  PiBoxingGlove,
  PiBrandy,
  PiBugBeetle,
  PiCactus,
  PiCampfire,
  PiCastleTurret,
  PiCat,
  PiCodeSimple,
  PiCoffee,
  PiCoins,
  PiCompass,
  PiConfetti,
  PiCow,
  PiCrownSimple,
  PiCube,
  PiDeviceMobile,
  PiDiceSix,
  PiDog,
  PiEggCrack,
  PiFalloutShelter,
  PiFlyingSaucer,
  PiGameController,
  PiGearFine,
  PiHandPeace,
  PiHeartHalf,
  PiHeartStraight,
  PiJoystick,
  PiLego,
  PiLegoSmiley,
  PiLightning,
  PiLinuxLogo,
  PiMedal,
  PiMeteor,
  PiOnigiri,
  PiPiggyBank,
  PiRanking,
  PiRobot,
  PiScroll,
  PiShovel,
  PiSignpost,
  PiStar,
  PiSword,
  PiTreasureChest,
  PiTrophy,
  PiWine,
  PiWrench,
  PiYarn,
} from "@preact-icons/pi";

const iconComponents = [
  PiGameController,
  PiJoystick,
  PiSword,
  PiHeartStraight,
  PiLego,
  PiMedal,
  PiRanking,
  PiHeartHalf,
  PiLegoSmiley,
  PiTreasureChest,
  PiTrophy,
  PiScroll,
  PiFlyingSaucer,
  PiDiceSix,
  PiCube,
  PiCrownSimple,
  PiCastleTurret,
  PiBomb,
  PiBaseballCap,
  PiBatteryFull,
  PiBatteryCharging,
  PiBlueprint,
  PiBowlSteam,
  PiBoxingGlove,
  PiBrandy,
  PiWine,
  PiWrench,
  PiBugBeetle,
  PiCactus,
  PiCampfire,
  PiCodeSimple,
  PiCoffee,
  PiCoins,
  PiConfetti,
  PiCompass,
  PiCow,
  PiDeviceMobile,
  PiCat,
  PiDog,
  PiEggCrack,
  PiFalloutShelter,
  PiGearFine,
  PiHandPeace,
  PiLightning,
  PiLinuxLogo,
  PiMeteor,
  PiOnigiri,
  PiPiggyBank,
  PiRobot,
  PiShovel,
  PiSignpost,
  PiStar,
  PiYarn,
];

// 1. Define your tooltip mapping
const iconTooltips = new Map([
  [PiEggCrack, "Konami Code"],
]);

export function Hero() {
  const getRandomIcons = () => {
    const shuffled = iconComponents
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    return (
      <span style={{ display: "flex", gap: "0.5rem" }}>
        {shuffled.map((Icon, idx) => {
          const tooltip = iconTooltips.get(Icon);
          const iconElement = <Icon key={idx} />;
          return tooltip
            ? (
              <span
                key={idx}
                data-tooltip={tooltip}
                style={{ cursor: "help", borderBottom: "none" }}
              >
                {iconElement}
              </span>
            )
            : iconElement;
        })}
      </span>
    );
  };

  return (
    <div class="hero-container">
      <section class="hero-section">
        <h1
          style={{
            marginBottom: "0.25rem",
            letterSpacing: "-1px",
            textAlign: "center",
            color: "#F0F1F3",
            textShadow: "0 0 1rem #23272a",
          }}
        >
          <span>Welcome to</span>
          <br />
          <span
            style={{
              color: "var(--pico-primary-background)",
              fontSize: "2.2rem",
              fontWeight: 800,
              textShadow: "0 0 1rem #23272a",
            }}
          >
            Retro Ranker
          </span>
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            marginBottom: "1rem",
            textAlign: "center",
            maxWidth: "600px",
            color: "#e0e6f0",
            textShadow: "0 0 1rem #23272a",
          }}
        >
          Discover, rank, and discuss 400+ devices. Your next favorite is only a
          click away!
        </p>
        <a
          href="/auth/sign-in"
          class="hero-button"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          Join the Community {getRandomIcons()}
        </a>
      </section>
      <img
        src="/images/rr-star.png"
        alt="Retro Ranker"
        class="hero-image"
      />
    </div>
  );
}
