import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import process from "node:process";
import { config } from "dotenv";

// Load environment variables from .env file
config({ path: path.join(__dirname, ".env"), quiet: true });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  // Retry tests 4 times in CI, 0 times locally
  retries: process.env.CI ? 4 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results.json" }],
    ["junit", { outputFile: "test-results.xml" }],
  ],
  /* Global timeout for each test */
  timeout: 10000,
  /* Timeout for expect operations */
  expect: {
    timeout: 10000,
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.CI
      ? "https://retroranker.site"
      : "http://localhost:8000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    /* Timeout for navigation */
    navigationTimeout: 10000,

    /* Timeout for action operations */
    actionTimeout: 10000,

    /* Disable Umami tracking for tests */
    storageState: {
      cookies: [],
      origins: [
        {
          origin: process.env.CI
            ? "https://retroranker.site"
            : "http://localhost:8000",
          localStorage: [
            {
              name: "umami.disabled",
              value: "1",
            },
          ],
        },
      ],
    },
  },

  /* Configure projects for major browsers */
  projects: process.env.CI
    ? [
      /* In CI, run both desktop and mobile Chrome for comprehensive testing */
      {
        name: "chromium",
        use: { ...devices["Desktop Chrome"] },
      },
      {
        name: "Mobile Chrome",
        use: { ...devices["Pixel 5"] },
      },
      {
        name: "firefox",
        use: { ...devices["Desktop Firefox"] },
      },

      /* Safari/WebKit projects for matrix testing */
      {
        name: "webkit",
        use: { ...devices["Desktop Safari"] },
      },
      {
        name: "webkit-mobile",
        use: { ...devices["iPhone 12"] },
      },
    ]
    : [
      /* Local development - test all browsers */
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
        name: "Google Chrome",
        use: { ...devices["Desktop Chrome"], channel: "chrome" },
      },
    ],

  /* Run your local dev server before starting the tests (only for local development) */
  ...(process.env.CI ? {} : {
    webServer: {
      command: "deno task start",
      cwd: path.join(__dirname, ".."),
      url: "http://localhost:8000",
      reuseExistingServer: true,
    },
  }),
});
