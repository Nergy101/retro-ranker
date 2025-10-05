import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./testing",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!Deno.env.get("CI"),
  /* Retry on CI only */
  retries: Deno.env.get("CI") ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: Deno.env.get("CI") ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results.json" }],
    ["junit", { outputFile: "test-results.xml" }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: Deno.env.get("CI")
      ? "https://retroranker.site"
      : "http://localhost:8000",

    trace: "on-first-retry",
    navigationTimeout: 10000,
    actionTimeout: 10000,

    // Disable analytics tracking during tests
    storageState: {
      cookies: [],
      origins: [
        {
          origin: Deno.env.get("CI")
            ? "https://retroranker.site"
            : "http://localhost:8000",
          localStorage: [{ name: "umami.disabled", value: "1" }],
        },
      ],
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
    {
      name: "Mobile Chrome Small",
      use: { ...devices["Pixel 4"] },
    },
    {
      name: "Mobile Safari Small",
      use: { ...devices["iPhone SE"] },
    },
    {
      name: "Mobile Chrome Large",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "Mobile Safari Large",
      use: { ...devices["iPhone 14 Pro Max"] },
    },
    {
      name: "Tablet Chrome",
      use: { ...devices["Galaxy Tab S4"] },
    },
    {
      name: "Tablet Safari",
      use: { ...devices["iPad Pro"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: Deno.env.get("CI") ? undefined : {
    command: "deno task build && deno task start",
    url: "http://localhost:8000",
    reuseExistingServer: !Deno.env.get("CI"),
  },
});
