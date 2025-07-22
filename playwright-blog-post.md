---
title: Playwright Testing
date: 2024-12-21
author: Christian / Nergy101
tags: [Testing, Playwright, TypeScript, Deno, Fresh]
---

# Playwright Testing Setup for Retro Ranker

Testing web applications can be a daunting task, especially when you need to ensure your app works across different browsers, devices, and user interactions. Manual testing becomes unsustainable as your application grows, and that's where [Playwright](https://playwright.dev) comes in as a powerful end-to-end testing solution.

In this post, I'll walk through how I set up a comprehensive Playwright testing suite for [Retro Ranker](https://retroranker.site), a Fresh/Deno-based web application for comparing retro gaming handhelds. This setup includes multi-browser testing, CI/CD integration, helper utilities, and robust test patterns.

## Table of Contents

- [Playwright Testing Setup for Retro Ranker](#playwright-testing-setup-for-retro-ranker)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Project Structure](#project-structure)
  - [Configuration Setup](#configuration-setup)
  - [Test Helper Architecture](#test-helper-architecture)
    - [TestHelpers Class](#testhelpers-class)
    - [AuthHelpers Class](#authhelpers-class)
    - [Constants Management](#constants-management)
  - [Writing Effective Tests](#writing-effective-tests)
    - [Home Page Tests](#home-page-tests)
    - [Authentication Tests](#authentication-tests)
    - [Using Helper Functions](#using-helper-functions)
  - [CI/CD Integration](#cicd-integration)
  - [Best Practices and Patterns](#best-practices-and-patterns)
    - [1. Environment Configuration](#1-environment-configuration)
    - [2. Robust Waiting Strategies](#2-robust-waiting-strategies)
    - [3. Test Data Management](#3-test-data-management)
    - [4. Error Handling and Recovery](#4-error-handling-and-recovery)
    - [5. Responsive Testing](#5-responsive-testing)
  - [Conclusion](#conclusion)

---

## Introduction

Playwright is a modern end-to-end testing framework that supports multiple browsers (Chromium, Firefox, Safari) and provides excellent developer experience. For Retro Ranker, I needed a testing solution that could:

- Test across multiple browsers and devices
- Handle authentication flows
- Test responsive design
- Integrate with my Fresh/Deno stack
- Provide reliable CI/CD feedback

Let's dive into how I achieved this.

## Project Structure

My Playwright setup is organized in a dedicated `playwright/` directory within the project:

```
playwright/
├── tests/
│   ├── home.spec.ts
│   ├── navigation.spec.ts
│   ├── auth.spec.ts
│   ├── login.spec.ts
│   ├── leaderboard.spec.ts
│   └── utils/
│       ├── test-helpers.ts
│       ├── auth-helpers.ts
│       ├── constants.ts
│       └── index.ts
├── playwright.config.ts
├── package.json
├── install.sh
└── test-workflow.sh
```

This structure separates concerns and makes the test suite maintainable and scalable.

## Configuration Setup

The heart of my Playwright setup is the `playwright.config.ts` file. Here's how I configured it for optimal performance and reliability:

```typescript
import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import process from "node:process";
import { config } from "dotenv";

// Load environment variables from .env file
config({ path: path.join(__dirname, ".env"), quiet: true });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 1, // Single worker for CI stability
  timeout: 10000,

  reporter: [
    ["html"],
    ["json", { outputFile: "test-results.json" }],
    ["junit", { outputFile: "test-results.xml" }],
  ],

  use: {
    baseURL: process.env.CI
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
          origin: process.env.CI
            ? "https://retroranker.site"
            : "http://localhost:8000",
          localStorage: [{ name: "umami.disabled", value: "1" }],
        },
      ],
    },
  },

  projects: process.env.CI
    ? [
        // CI: Test Chrome desktop and mobile for speed
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "Mobile Chrome", use: { ...devices["Pixel 5"] } },
      ]
    : [
        // Local: Test all browsers for comprehensive coverage
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
        { name: "Mobile Chrome", use: { ...devices["Pixel 5"] } },
        { name: "Mobile Safari", use: { ...devices["iPhone 12"] } },
      ],

  // Auto-start dev server for local development
  ...(process.env.CI
    ? {}
    : {
        webServer: {
          command: "deno task start",
          cwd: path.join(__dirname, ".."),
          url: "http://localhost:8000",
          reuseExistingServer: true,
        },
      }),
});
```

Key configuration highlights:

- **Environment-aware base URL**: Uses localhost for development, production URL for CI
- **Analytics disabling**: Prevents test runs from polluting analytics data
- **Conditional browser testing**: Full browser suite locally, optimized set for CI
- **Auto-server startup**: Automatically starts the Deno dev server for local testing

## Test Helper Architecture

One of the most powerful aspects of my setup is the comprehensive helper utilities that make tests more readable and maintainable. The architecture is built around three core components:

### TestHelpers Class

The `TestHelpers` class provides robust navigation and interaction methods:

```typescript
export class TestHelpers {
  constructor(private page: Page) {}

  async navigateTo(
    path: string,
    options?: {
      waitForSelector?: string;
      timeout?: number;
      waitForLoadState?: "load" | "domcontentloaded" | "networkidle";
      waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
    }
  ) {
    const {
      waitForSelector = "main, body",
      timeout = 10000,
      waitForLoadState = "domcontentloaded",
      waitUntil = "domcontentloaded",
    } = options || {};

    // Check if page is still open before navigation
    this.checkPageOpen();

    await this.page.goto(path, { waitUntil });

    // Wait for the specified load state
    try {
      await this.page.waitForLoadState(waitForLoadState, { timeout });
    } catch (error) {
      console.log(
        `Warning: Load state '${waitForLoadState}' timed out for ${path}`
      );
    }

    // Wait for key element to be visible
    try {
      await this.page.waitForSelector(waitForSelector, {
        state: "visible",
        timeout,
      });
    } catch (error) {
      // Fallback to body if specific selector fails
      await this.page.waitForSelector("body", {
        state: "visible",
        timeout: 5000,
      });
    }
  }

  async testResponsiveDesign() {
    // Desktop
    await this.page.setViewportSize({ width: 1280, height: 720 });
    await expect(this.page.locator("body")).toBeVisible();

    // Tablet
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await expect(this.page.locator("body")).toBeVisible();

    // Mobile
    await this.page.setViewportSize({ width: 375, height: 667 });
    await expect(this.page.locator("body")).toBeVisible();
  }

  async clickElement(selector: string) {
    await this.page.waitForSelector(selector, { state: "visible" });
    await this.page.click(selector);
  }

  async fillField(selector: string, value: string) {
    await this.page.waitForSelector(selector, { state: "visible" });
    await this.page.fill(selector, value);
  }

  async elementShouldBeVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }
}
```

The helper utilities provide:

- **Robust navigation**: Handles timeouts and fallbacks gracefully
- **Responsive testing**: Easy viewport switching for mobile/desktop testing
- **Element interactions**: Safe clicking and form filling with proper waits
- **Error handling**: Comprehensive error checking and recovery

### AuthHelpers Class

For authentication flows, we have a specialized `AuthHelpers` class:

```typescript
export class AuthHelpers {
  constructor(private page: Page) {}

  async loginWithEnvCredentials() {
    const nickname = process.env.TEST_USER_NICKNAME;
    const password = process.env.TEST_USER_PASSWORD;

    if (!nickname || !password) {
      throw new Error(
        "TEST_USER_NICKNAME and TEST_USER_PASSWORD must be set in .env file"
      );
    }

    await this.page.goto("/auth/sign-in");
    await this.page.waitForLoadState("networkidle");

    // Verify CSRF token is present
    await expect(this.page.locator('input[name="csrf_token"]')).toHaveValue(
      /^.+$/
    );

    // Fill in the login form
    await this.page.fill('input[name="nickname"]', nickname);
    await this.page.fill('input[name="password"]', password);

    // Submit the form and wait for navigation
    await Promise.all([
      this.page.waitForURL(/\/profile/, { timeout: 10000 }),
      this.page.click('button[type="submit"]'),
    ]);

    await this.page.waitForLoadState("networkidle");
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      // Check if we're on the profile page
      if (this.page.url().includes("/profile")) {
        return true;
      }

      // Check if we're on mobile or desktop
      const isMobile = await this.page.locator(".mobile-nav").isVisible();

      if (isMobile) {
        // On mobile, check if profile link exists in the mobile menu
        const mobileProfileElements = await this.page
          .locator('.mobile-nav-content [href="/profile"]')
          .count();
        return mobileProfileElements > 0;
      } else {
        // On desktop, check for user-specific elements in navigation
        const userElements = await this.page
          .locator('[href="/profile"]')
          .count();
        return userElements > 0;
      }
    } catch {
      return false;
    }
  }

  async logout() {
    await this.page.goto("/api/auth/sign-out", {
      waitUntil: "domcontentloaded",
    });
  }
}
```

The `AuthHelpers` class provides:

- **Environment-based login**: Uses credentials from environment variables
- **Session state detection**: Intelligently detects login state across mobile/desktop
- **CSRF token handling**: Manages CSRF tokens for secure form submissions
- **Logout functionality**: Handles logout flows consistently

### Constants Management

I use a centralized constants file to maintain consistent selectors across all tests:

```typescript
export const SELECTORS = {
  // Form elements
  FORM: "form",
  NICKNAME_INPUT: 'input[name="nickname"], input[type="text"]',
  PASSWORD_INPUT: 'input[name="password"]',
  SUBMIT_BUTTON: 'button[type="submit"], input[type="submit"]',
  ERROR_MESSAGE: '.error, [data-testid="error"]',
  AUTH_FORM: ".auth-form",

  // Navigation
  MOBILE_NAV: ".mobile-nav",
  DESKTOP_NAV: ".desktop-nav",
  BURGER_MENU: ".burger-menu",
} as const;

export const TEST_DATA = {
  VALID_PASSWORD: "password123",
  INVALID_PASSWORD: "123",
} as const;
```

This allows me to write tests using consistent selectors and makes maintenance much easier.

## Writing Effective Tests

With our helper utilities in place, writing tests becomes much cleaner and more maintainable. Let's look at examples from different types of tests.

### Home Page Tests

Here's an example from our home page tests:

```typescript
import { expect, test } from "@playwright/test";
import { createTestHelper } from "./utils/index.ts";

test.describe("Home Page", () => {
  test("should load the home page with correct title and meta", async ({
    page,
  }) => {
    const helper = createTestHelper(page);
    await helper.navigateTo("/", {
      waitForLoadState: "networkidle",
      waitForSelector: "main.main-content",
    });

    // Check that the page has the correct title
    await helper.pageShouldHaveTitle(/Retro Ranker - Home/);

    // Check for meta description
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Retro Ranker - Home to browse and compare retro gaming handhelds/
    );
  });

  test("should display hero section with main content", async ({ page }) => {
    const helper = createTestHelper(page);
    await helper.navigateTo("/");

    // Check for hero container
    await helper.elementShouldBeVisible(".hero-container");

    // Check for main heading with "Retro Ranker"
    await expect(page.locator("h1")).toContainText("Retro Ranker");

    // Check for hero description
    await helper.elementShouldBeVisible(".hero-section p");

    // Check for join community button
    await helper.elementShouldBeVisible(
      '.hero-section a[href="/auth/sign-in"]'
    );
  });

  test("should be responsive across different viewport sizes", async ({
    page,
  }) => {
    const helper = createTestHelper(page);
    await helper.navigateTo("/");

    // Test responsive design with helper
    await helper.testResponsiveDesign();
  });
});
```

### Authentication Tests

For authentication flows, I use specialized `AuthHelpers`:

```typescript
import { expect, test } from "@playwright/test";
import process from "node:process";
import { createAuthHelper, createTestHelper } from "./utils/index.ts";

test.describe("Login Functionality", () => {
  test("should login successfully with valid credentials from .env", async ({
    page,
  }) => {
    const authHelper = createAuthHelper(page);

    // Check if credentials are available
    const nickname = process.env.TEST_USER_NICKNAME;
    const password = process.env.TEST_USER_PASSWORD;

    if (!nickname || !password) {
      test.skip(); // Skip test if credentials not available
      return;
    }

    // Perform login using helper
    await authHelper.loginWithEnvCredentials();

    // Verify we're logged in
    expect(await authHelper.isLoggedIn()).toBe(true);

    // Check we're on the profile page
    await expect(page).toHaveURL(/\/profile/);
  });

  test("should fail login with invalid credentials", async ({ page }) => {
    const helper = createTestHelper(page);

    await helper.navigateTo("/auth/sign-in");

    // Wait for and verify CSRF token is present
    await helper.waitForCsrfToken();

    // Fill in invalid credentials
    await helper.fillField(SELECTORS.NICKNAME_INPUT, "invalid_user");
    await helper.fillField(SELECTORS.PASSWORD_INPUT, "invalid_password");

    // Submit the form and wait for the redirect
    await Promise.all([
      page.waitForURL(/\/auth\/sign-in\?error=invalid-credentials/),
      helper.clickElement(SELECTORS.SUBMIT_BUTTON),
    ]);

    // Check for error message using helper
    await helper.checkAuthFormError();
  });
});
```

### Using Helper Functions

The helper functions make tests much more readable and maintainable:

```typescript
import { SELECTORS, TEST_DATA } from "./utils/constants.ts";

test("should handle form validation", async ({ page }) => {
  const helper = createTestHelper(page);
  await helper.navigateTo("/auth/sign-in");

  // Use constants for selectors
  await helper.elementShouldBeVisible(SELECTORS.AUTH_FORM);
  await helper.elementShouldBeVisible(SELECTORS.NICKNAME_INPUT);
  await helper.elementShouldBeVisible(SELECTORS.PASSWORD_INPUT);

  // Fill form using constants
  await helper.fillField(SELECTORS.NICKNAME_INPUT, "testuser");
  await helper.fillField(SELECTORS.PASSWORD_INPUT, TEST_DATA.VALID_PASSWORD);

  // Submit form
  await helper.clickElement(SELECTORS.SUBMIT_BUTTON);
});
```

Key testing patterns I follow:

- **Use helper functions**: Encapsulate common operations
- **Test user workflows**: Focus on real user interactions
- **Responsive testing**: Ensure mobile and desktop compatibility
- **Accessibility checks**: Verify page structure and content
- **Error scenarios**: Test edge cases and error handling
- **Environment-aware testing**: Skip tests when dependencies aren't available
- **Session management**: Handle login/logout flows consistently

## CI/CD Integration

My Playwright setup integrates seamlessly with GitHub Actions for automated testing. The configuration automatically adapts to the CI environment:

```yaml
# .github/workflows/playwright-tests.yml
name: 🧪 Playwright Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
          cache-dependency-path: playwright/package-lock.json

      - name: Install dependencies
        run: |
          cd playwright
          npm ci

      - name: Install Playwright browsers
        run: |
          cd playwright
          npx playwright install --with-deps

      - name: Run Playwright tests
        run: |
          cd playwright
          npm test

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright/playwright-report/
          retention-days: 30
```

The CI setup provides:

- **Automated testing**: Runs on every PR and push
- **Artifact storage**: Preserves test reports and screenshots
- **Caching**: Speeds up builds with dependency caching
- **Multi-browser testing**: Ensures cross-browser compatibility

## Best Practices and Patterns

Throughout my Playwright implementation, I've established several best practices:

### 1. Environment Configuration

```typescript
// Use environment variables for different contexts
baseURL: process.env.CI
  ? "https://retroranker.site"
  : "http://localhost:8000",
```

### 2. Robust Waiting Strategies

```typescript
// Wait for content with fallbacks
async navigateTo(path: string, options?: {
  waitForSelector?: string;
  timeout?: number;
}) {
  // Primary wait strategy
  try {
    await this.page.waitForSelector(waitForSelector, { timeout });
  } catch (error) {
    // Fallback to body
    await this.page.waitForSelector("body", { timeout: 5000 });
  }
}
```

### 3. Test Data Management

```typescript
// Use environment variables for test credentials
const nickname = process.env.TEST_USER_NICKNAME;
const password = process.env.TEST_USER_PASSWORD;

if (!nickname || !password) {
  test.skip(); // Skip test if credentials not available
  return;
}
```

### 4. Error Handling and Recovery

```typescript
// Safe element interactions
async safeClick(selector: string, options?: { timeout?: number }) {
  try {
    if (this.page.isClosed()) {
      throw new Error("Page has been closed");
    }
    await this.page.click(selector, { timeout });
  } catch (error) {
    // Handle page closure errors gracefully
    if (error.message.includes("Target page, context or browser has been closed")) {
      throw new Error(`Page was closed during click on ${selector}`);
    }
    throw error;
  }
}
```

### 5. Responsive Testing

```typescript
// Test across different viewport sizes
async testResponsiveDesign() {
  // Desktop
  await this.page.setViewportSize({ width: 1280, height: 720 });
  await expect(this.page.locator("body")).toBeVisible();

  // Tablet
  await this.page.setViewportSize({ width: 768, height: 1024 });
  await expect(this.page.locator("body")).toBeVisible();

  // Mobile
  await this.page.setViewportSize({ width: 375, height: 667 });
  await expect(this.page.locator("body")).toBeVisible();
}
```

## Conclusion

Setting up Playwright for Retro Ranker has provided me with a robust, maintainable testing solution that scales with my application. The key benefits I've achieved include:

- **Comprehensive coverage**: Multi-browser testing across desktop and mobile
- **Developer experience**: Clean, readable tests with helpful utilities
- **CI/CD integration**: Automated testing with detailed reporting
- **Maintainability**: Well-structured code with clear separation of concerns
- **Reliability**: Robust error handling and recovery mechanisms

The combination of thoughtful configuration, comprehensive helper utilities, and established testing patterns has created a testing suite that not only catches bugs but also serves as living documentation of my application's expected behavior.

Whether you're building a Fresh/Deno application like Retro Ranker or working with any modern web framework, Playwright provides the tools you need to build confidence in your application's quality and reliability.

For more details about my specific implementation, check out the [Retro Ranker repository](https://github.com/nergy101/retro-ranker) and explore the `playwright/` directory to see how these patterns work in practice.
