import { tracer } from "../data/tracing/tracer.ts";
import { State } from "../utils.ts";
import { Context, page } from "fresh";

export const handler = {
  async GET(ctx: Context<State>) {
    ctx.state.seo = {
      title: "Privacy Policy | Retro Ranker",
      description:
        "Learn how Retro Ranker collects, uses, and protects your personal information. Our comprehensive privacy policy covers data collection, usage, and your rights as a user of our retro gaming handheld platform.",
      keywords:
        "privacy policy, data protection, retro ranker privacy, user data, privacy rights, retro gaming privacy, handheld device privacy, emulation platform privacy, user data protection, privacy compliance",
      url: `https://retroranker.site${ctx.url.pathname}`,
    };

    ctx.state.data = {
      // No additional data needed for privacy page
    };

    return await tracer.startActiveSpan("route:privacy", async (span: any) => {
      try {
        const user = ctx.state?.user;
        span.setAttribute("user.authenticated", !!user);
        if (user && "email" in user) {
          span.setAttribute("user.email", user.email);
        }

        const result = page(ctx);
        span.setStatus({ code: 0 }); // OK
        return result;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error";
        span.setStatus({ code: 2, message: errorMessage }); // ERROR
        throw error;
      } finally {
        span.end();
      }
    });
  },
};

export default function Privacy(ctx: Context<State>) {
  const state = ctx.state;
  const _translations = state.translations ?? {};

  return (
    <div class="privacy-page">
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
        <hgroup style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--pico-muted-color)" }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </hgroup>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Introduction
          </h2>
          <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
            At Retro Ranker, we are committed to protecting your privacy and
            ensuring the security of your personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website.
          </p>
          <p style={{ lineHeight: "1.6" }}>
            By using our website, you consent to the data practices described in
            this policy.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Information We Collect
          </h2>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div
              style={{
                padding: "1rem",
                background: "var(--pico-background-color)",
                borderRadius: "0.5rem",
                border: "1px solid var(--pico-muted-border-color)",
              }}
            >
              <h3
                style={{ margin: "0 0 0.5rem 0", color: "var(--pico-primary)" }}
              >
                Personal Information
              </h3>
              <p style={{ margin: 0, lineHeight: "1.5" }}>
                We may collect personal information such as your name, email
                address, and preferences when you:
              </p>
              <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1.5rem" }}>
                <li>Create an account</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us for support</li>
                <li>Participate in surveys or feedback</li>
              </ul>
            </div>
            <div
              style={{
                padding: "1rem",
                background: "var(--pico-background-color)",
                borderRadius: "0.5rem",
                border: "1px solid var(--pico-muted-border-color)",
              }}
            >
              <h3
                style={{ margin: "0 0 0.5rem 0", color: "var(--pico-primary)" }}
              >
                Usage Information
              </h3>
              <p style={{ margin: 0, lineHeight: "1.5" }}>
                We automatically collect certain information about your device
                and how you interact with our website:
              </p>
              <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1.5rem" }}>
                <li>IP address and browser information</li>
                <li>Pages visited and time spent on site</li>
                <li>Device type and operating system</li>
                <li>Referring website information</li>
              </ul>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            How We Use Your Information
          </h2>
          <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
            We use the information we collect to:
          </p>
          <ul style={{ lineHeight: "1.6" }}>
            <li>Provide and maintain our services</li>
            <li>Improve user experience and website functionality</li>
            <li>
              Send you updates, newsletters, and promotional materials (with
              your consent)
            </li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Analyze usage patterns to improve our content and services</li>
            <li>Ensure the security and integrity of our platform</li>
          </ul>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Information Sharing
          </h2>
          <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
            We do not sell, trade, or otherwise transfer your personal
            information to third parties without your consent, except in the
            following circumstances:
          </p>
          <ul style={{ lineHeight: "1.6" }}>
            <li>
              <strong>Service Providers:</strong>{" "}
              We may share information with trusted third-party service
              providers who assist us in operating our website and conducting
              our business.
            </li>
            <li>
              <strong>Legal Requirements:</strong>{" "}
              We may disclose information when required by law or to protect our
              rights, property, or safety.
            </li>
            <li>
              <strong>Business Transfers:</strong>{" "}
              In the event of a merger, acquisition, or sale of assets, user
              information may be transferred as part of the transaction.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Data Security
          </h2>
          <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
            We implement appropriate security measures to protect your personal
            information against unauthorized access, alteration, disclosure, or
            destruction. However, no method of transmission over the internet or
            electronic storage is 100% secure, and we cannot guarantee absolute
            security.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Cookies and Tracking
          </h2>
          <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
            We use cookies and similar tracking technologies to enhance your
            experience on our website. Cookies are small files that are stored
            on your device and help us:
          </p>
          <ul style={{ lineHeight: "1.6" }}>
            <li>Remember your preferences and settings</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Provide personalized content and recommendations</li>
            <li>Improve website performance and functionality</li>
          </ul>
          <p style={{ lineHeight: "1.6", marginTop: "1rem" }}>
            You can control cookie settings through your browser preferences,
            but disabling cookies may affect the functionality of our website.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Your Rights
          </h2>
          <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
            Depending on your location, you may have certain rights regarding
            your personal information:
          </p>
          <ul style={{ lineHeight: "1.6" }}>
            <li>
              <strong>Access:</strong>{" "}
              Request access to your personal information
            </li>
            <li>
              <strong>Correction:</strong>{" "}
              Request correction of inaccurate information
            </li>
            <li>
              <strong>Deletion:</strong>{" "}
              Request deletion of your personal information
            </li>
            <li>
              <strong>Portability:</strong>{" "}
              Request a copy of your data in a portable format
            </li>
            <li>
              <strong>Opt-out:</strong>{" "}
              Unsubscribe from marketing communications
            </li>
          </ul>
          <p style={{ lineHeight: "1.6", marginTop: "1rem" }}>
            To exercise these rights, please contact us at{" "}
            <a href="mailto:privacy@retroranker.com">
              privacy@retroranker.com
            </a>.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Children's Privacy
          </h2>
          <p style={{ lineHeight: "1.6" }}>
            Our website is not intended for children under 13 years of age. We
            do not knowingly collect personal information from children under
            13. If you are a parent or guardian and believe your child has
            provided us with personal information, please contact us
            immediately.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Changes to This Policy
          </h2>
          <p style={{ lineHeight: "1.6" }}>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date. We encourage you to review
            this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section
          style={{ textAlign: "center", padding: "2rem 0", marginTop: "2rem" }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Contact Us</h2>
          <p
            style={{ marginBottom: "1.5rem", color: "var(--pico-muted-color)" }}
          >
            If you have any questions about this Privacy Policy, please contact
            us:
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a href="mailto:privacy@retroranker.com" class="button">
              📧 Privacy Team
            </a>
            <a href="/contact" class="button outline">
              📞 Contact Us
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
