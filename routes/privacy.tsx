import { FreshContext, page } from "fresh";
import { CustomFreshState } from "@interfaces/state.ts";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

export const handler = {
  GET(ctx: FreshContext) {
    (ctx.state as CustomFreshState).seo = {
      title: "Retro Ranker - Privacy Policy",
      description:
        "Read the privacy policy for Retro Ranker. Learn how we protect your data while using our retro gaming handheld comparison platform.",
      keywords:
        "retro ranker privacy, gaming website privacy, retro gaming data protection, handheld comparison privacy",
    };
    return page(ctx);
  },
};

export default function Privacy(ctx: FreshContext) {
  const translations = (ctx.state as CustomFreshState).translations ?? {};

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-4xl font-bold mb-6">
        {TranslationPipe(translations, "privacy.title")}
      </h1>

      <div>
        <section>
          <h2 class="text-2xl font-semibold mb-3">
            {TranslationPipe(translations, "privacy.introduction")}
          </h2>
          <p class="mb-4">
            {TranslationPipe(translations, "privacy.introText")}
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">Information We Collect</h2>
          <p class="mb-2">We collect the following types of information:</p>
          <ul class="list-disc list-inside mb-4">
            <li>Usage data (pages visited, time spent on site)</li>
            <li>Device information (browser type, operating system)</li>
            <li>IP addresses</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">
            How We Use Your Information
          </h2>
          <p class="mb-2">We use the collected information to:</p>
          <ul class="list-disc list-inside mb-4">
            <li>Improve our website and services</li>
            <li>Analyze user behavior and preferences</li>
            <li>Fix technical issues</li>
            <li>Ensure website security</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">Cookies</h2>
          <p class="mb-4">
            We use cookies to enhance your browsing experience. These cookies
            help us understand how you use our website and allow us to remember
            your preferences.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">Third-Party Services</h2>
          <p class="mb-4">
            We use third-party services for analytics and functionality. These
            services may collect information as specified in their respective
            privacy policies:
          </p>
          <ul class="list-disc list-inside mb-4">
            <li>Google Analytics</li>
            <li>Fresh Analytics</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">Data Security</h2>
          <p class="mb-4">
            We implement appropriate security measures to protect your
            information against unauthorized access, alteration, disclosure, or
            destruction.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">Changes to This Policy</h2>
          <p class="mb-4">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">Contact Us</h2>
          <p class="mb-4">
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <a href="mailto:privacy@retroranker.com" class="text-primary">
              privacy@retroranker.com
            </a>
          </p>
        </section>

        <footer class="mt-8 text-sm text-gray-600">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
}
