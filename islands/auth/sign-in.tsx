import { useSignal } from "@preact/signals";

export default function SignIn() {
  const error = useSignal<string | null>(null);

  return (
    <div
      style={{ maxWidth: "25rem", margin: "2.5rem auto", padding: "1.25rem" }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1.25rem" }}>Sign In</h1>

      {error.value && (
        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "0.5rem",
            marginBottom: "1.25rem",
            borderRadius: "0.25rem",
          }}
        >
          {error}
        </div>
      )}

      <form
        method="POST"
        action="/api/auth/sign-in"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div>
          <label
            for="email"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div>
          <label
            for="password"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Sign In
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <a
          href="/auth/sign-up"
          style={{ textDecoration: "none" }}
        >
          Don't have an account? Sign up
        </a>
      </div>
    </div>
  );
}
