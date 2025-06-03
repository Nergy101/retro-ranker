export function Hero() {
  return (
    <div class="hero-container">
      <section class="hero-section">
        <h1
          style={{
            marginBottom: "0.5rem",
            letterSpacing: "-1px",
            textAlign: "center",
            color: "#F0F1F3",
          }}
        >
          <span>Welcome to</span>
          <br />
          <span
            style={{
              color: "var(--pico-primary-background)",
              fontSize: "2.8rem",
              fontWeight: 800,
            }}
          >
            RETRO RANKER
          </span>
        </h1>
        <p
          style={{
            fontSize: "1.35rem",
            marginBottom: "1.5rem",
            textAlign: "center",
            maxWidth: "600px",
            color: "#e0e6f0",
          }}
        >
          Join a vibrant community of retro gaming fans. Discover, rank, and
          discuss <b>400+ handhelds</b>{" "}
          together. Your next favorite device is only a click away!
        </p>
        <a
          href="/auth/sign-in"
          class="hero-button"
        >
          Join the 👾🎮⭐ Community
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
