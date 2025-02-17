import { Head } from "$fresh/runtime.ts";

export default function PrivacyPolicyPage() {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <Head>
        <title>Retro Ranker - Privacy Policy</title>
        <meta
          name="description"
          content="Learn about how we collect, use, and protect your personal information when you use our website."
        />
      </Head>

      <h1 class="text-4xl font-bold mb-6">Privacy Policy</h1>

      <div>
        <section>
          <h2 class="text-2xl font-semibold mb-3">Introduction</h2>
          <p class="mb-4">
            At Retro Ranker, we take your privacy seriously. This Privacy Policy
            explains how we collect, use, and protect your personal information
            when you use our website.
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
