import { Head } from "fresh/runtime";
import { tracer } from "../data/tracing/tracer.ts";
import { State } from "../utils.ts";
import { Context, page } from "fresh";

export const handler = {
  async GET(ctx: Context<State>) {
    ctx.state.seo = {
      title: "Retro Ranker - Terms of Service",
      description:
        "Read the terms and conditions for using Retro Ranker's services and platform.",
      keywords:
        "terms of service, terms and conditions, retro ranker terms, user agreement, legal terms",
    };

    ctx.state.data = {
      // No additional data needed for terms page
    };

    return await tracer.startActiveSpan("route:terms", async (span: any) => {
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

export default function Terms(ctx: Context<State>) {
  const state = ctx.state;
  const _translations = state.translations ?? {};

  return (
    <div class="terms-page">
      <Head>
        <title>Retro Ranker - Terms of Service</title>
        <meta
          name="description"
          content="Read the terms and conditions for using Retro Ranker's services and platform."
        />
      </Head>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
        <hgroup style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--pico-muted-color)" }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </hgroup>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Agreement to Terms
          </h2>
          <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
            By accessing and using Retro Ranker ("the Service"), you accept and
            agree to be bound by the terms and provision of this agreement. If
            you do not agree to abide by the above, please do not use this
            service.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Use License
          </h2>
          <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
            Permission is granted to temporarily download one copy of Retro
            Ranker for personal, non-commercial transitory viewing only. This is
            the grant of a license, not a transfer of title, and under this
            license you may not:
          </p>
          <ul style={{ lineHeight: "1.6" }}>
            <li>Modify or copy the materials</li>
            <li>
              Use the materials for any commercial purpose or for any public
              display
            </li>
            <li>
              Attempt to reverse engineer any software contained on the website
            </li>
            <li>
              Remove any copyright or other proprietary notations from the
              materials
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            User Accounts
          </h2>
          <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
            When you create an account with us, you must provide information
            that is accurate, complete, and current at all times. You are
            responsible for safeguarding the password and for all activities
            that occur under your account.
          </p>
          <p style={{ lineHeight: "1.6" }}>
            You may not use as a username the name of another person or entity
            or that is not lawfully available for use, a name or trademark that
            is subject to any rights of another person or entity other than you
            without appropriate authorization, or a name that is otherwise
            offensive, vulgar, or obscene.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Prohibited Uses
          </h2>
          <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
            You may not use our service:
          </p>
          <ul style={{ lineHeight: "1.6" }}>
            <li>
              For any unlawful purpose or to solicit others to perform unlawful
              acts
            </li>
            <li>
              To violate any international, federal, provincial, or state
              regulations, rules, laws, or local ordinances
            </li>
            <li>
              To infringe upon or violate our intellectual property rights or
              the intellectual property rights of others
            </li>
            <li>
              To harass, abuse, insult, harm, defame, slander, disparage,
              intimidate, or discriminate
            </li>
            <li>To submit false or misleading information</li>
            <li>
              To upload or transmit viruses or any other type of malicious code
            </li>
            <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
            <li>For any obscene or immoral purpose</li>
            <li>
              To interfere with or circumvent the security features of the
              service
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Content
          </h2>
          <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
            Our service allows you to post, link, store, share and otherwise
            make available certain information, text, graphics, videos, or other
            material ("Content"). You are responsible for the Content that you
            post to the service, including its legality, reliability, and
            appropriateness.
          </p>
          <p style={{ lineHeight: "1.6" }}>
            By posting Content to the service, you grant us the right and
            license to use, modify, publicly perform, publicly display,
            reproduce, and distribute such Content on and through the service.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Intellectual Property
          </h2>
          <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
            The service and its original content, features, and functionality
            are and will remain the exclusive property of Retro Ranker and its
            licensors. The service is protected by copyright, trademark, and
            other laws. Our trademarks and trade dress may not be used in
            connection with any product or service without our prior written
            consent.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Disclaimer
          </h2>
          <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
            The information on this website is provided on an "as is" basis. To
            the fullest extent permitted by law, this Company:
          </p>
          <ul style={{ lineHeight: "1.6" }}>
            <li>
              Excludes all representations and warranties relating to this
              website and its contents
            </li>
            <li>
              Excludes all liability for damages arising out of or in connection
              with your use of this website
            </li>
          </ul>
          <p style={{ lineHeight: "1.6", marginTop: "1rem" }}>
            This includes, without limitation, direct loss, loss of business or
            profits, damage caused to your computer, computer software, systems
            and programs and the data thereon or any other direct or indirect,
            consequential and incidental damages.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Limitation of Liability
          </h2>
          <p style={{ lineHeight: "1.6" }}>
            In no event shall Retro Ranker, nor its directors, employees,
            partners, agents, suppliers, or affiliates, be liable for any
            indirect, incidental, special, consequential, or punitive damages,
            including without limitation, loss of profits, data, use, goodwill,
            or other intangible losses, resulting from your use of the service.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Termination
          </h2>
          <p style={{ lineHeight: "1.6" }}>
            We may terminate or suspend your account and bar access to the
            service immediately, without prior notice or liability, under our
            sole discretion, for any reason whatsoever and without limitation,
            including but not limited to a breach of the Terms.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Governing Law
          </h2>
          <p style={{ lineHeight: "1.6" }}>
            These Terms shall be interpreted and governed by the laws of the
            jurisdiction in which Retro Ranker operates, without regard to its
            conflict of law provisions. Our failure to enforce any right or
            provision of these Terms will not be considered a waiver of those
            rights.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Changes to Terms
          </h2>
          <p style={{ lineHeight: "1.6" }}>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material, we will provide
            at least 30 days notice prior to any new terms taking effect.
          </p>
        </section>

        <section
          style={{ textAlign: "center", padding: "2rem 0", marginTop: "2rem" }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Contact Information</h2>
          <p
            style={{ marginBottom: "1.5rem", color: "var(--pico-muted-color)" }}
          >
            If you have any questions about these Terms of Service, please
            contact us:
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a href="mailto:legal@retroranker.com" class="button">
              📧 Legal Team
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
