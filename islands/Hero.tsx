export function Hero() {
  return (
    <section
      class="hero-section"
    >
      <h1
        style={{
          fontSize: "2.8rem",
          fontWeight: 800,
          marginBottom: "0.5rem",
          letterSpacing: "-1px",
          textAlign: "center",
        }}
      >
        Welcome to{" "}
        <span style={{ color: "var(--pico-primary)" }}>Retro Ranker</span>!
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
        discuss <b>500+ handhelds</b>{" "}
        together. Your next favorite device is just a click away!
      </p>
      <a
        href="/auth/sign-in"
        class="hero-button"
      >
        Join the 👾🎮⭐ Community
      </a>
      <img
        src="/rr-welcome.png"
        alt="Retro Ranker"
        class="hero-image"
        
      />
    </section>
  );
}
