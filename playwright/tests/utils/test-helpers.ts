import { expect, Page } from "@playwright/test";

/**
 * Helper class for common test operations
 */
export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to a page and wait for it to load
   */
  async navigateTo(path: string, options?: {
    waitForSelector?: string;
    timeout?: number;
    waitForLoadState?: "load" | "domcontentloaded" | "networkidle";
    waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
  }) {
    const {
      waitForSelector = "main, body",
      timeout = 10000,
      waitForLoadState = "domcontentloaded",
      waitUntil = "domcontentloaded",
    } = options || {};

    // Check if page is still open before navigation
    this.checkPageOpen();

    // Navigate with specified wait condition
    await this.page.goto(path, { waitUntil });

    // Check if page is still open after navigation
    this.checkPageOpen();

    // Wait for the specified load state
    try {
      await this.page.waitForLoadState(waitForLoadState, { timeout });
    } catch (error) {
      // If load state times out, continue anyway
      console.log(
        `Warning: Load state '${waitForLoadState}' timed out for ${path}`,
      );
    }

    // Wait for a key element to be visible (more reliable than networkidle)
    try {
      await this.page.waitForSelector(waitForSelector, {
        state: "visible",
        timeout,
      });
    } catch (error) {
      // If the specific selector fails, fall back to waiting for body
      try {
        await this.page.waitForSelector("body", {
          state: "visible",
          timeout: 5000,
        });
      } catch (fallbackError) {
        // If even body fails, just check if we're on the right URL
        const currentUrl = this.page.url();
        if (!currentUrl.includes(path.replace("/", ""))) {
          throw new Error(
            `Navigation to ${path} failed. Current URL: ${currentUrl}`,
          );
        }
      }
    }
  }

  /**
   * Wait for an element to be visible and click it
   */
  async clickElement(selector: string) {
    await this.page.waitForSelector(selector, { state: "visible" });
    await this.page.click(selector);
  }

  /**
   * Fill a form field
   */
  async fillField(selector: string, value: string) {
    await this.page.waitForSelector(selector, { state: "visible" });
    await this.page.fill(selector, value);
  }

  /**
   * Check if an element exists and is visible
   */
  async elementShouldBeVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  /**
   * Check if an element has specific text
   */
  async elementShouldHaveText(selector: string, text: string) {
    await expect(this.page.locator(selector)).toHaveText(text);
  }

  /**
   * Check if the page has a specific title
   */
  async pageShouldHaveTitle(titlePattern: RegExp) {
    await expect(this.page).toHaveTitle(titlePattern);
  }

  /**
   * Check if the page is accessible (placeholder for now)
   */
  async pageShouldBeAccessible() {
    // For now, just check that the page is visible
    await expect(this.page.locator("body")).toBeVisible();
  }

  /**
   * Wait for a specific URL
   */
  async shouldBeOnUrl(urlPattern: RegExp) {
    await expect(this.page).toHaveURL(urlPattern);
  }

  /**
   * Take a screenshot for debugging
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  /**
   * Wait for network requests to complete
   */
  async waitForNetworkIdle(timeout = 10000) {
    try {
      await this.page.waitForLoadState("networkidle", { timeout });
    } catch (error) {
      // If networkidle times out, just wait for domcontentloaded
      await this.page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    }
  }

  /**
   * Navigate to a page with more robust waiting for dynamic content
   */
  async navigateToWithRetry(path: string, options?: {
    maxRetries?: number;
    waitForSelector?: string;
    timeout?: number;
  }) {
    const {
      maxRetries = 3,
      waitForSelector = "main, body",
      timeout = 15000,
    } = options || {};

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.page.goto(path);

        // Wait for DOM content to be loaded
        await this.page.waitForLoadState("domcontentloaded", {
          timeout: 10000,
        });

        // Wait for key element to be visible
        await this.page.waitForSelector(waitForSelector, {
          state: "visible",
          timeout: 10000,
        });

        // If we get here, navigation was successful
        return;
      } catch (error) {
        if (attempt === maxRetries) {
          throw new Error(
            `Failed to navigate to ${path} after ${maxRetries} attempts: ${error}`,
          );
        }

        // Wait a bit before retrying
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Check if navigation elements are present
   */
  async checkNavigationElements() {
    await this.elementShouldBeVisible("nav");
    const navLinks = this.page.locator("nav a");
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  }

  /**
   * Test responsive design with different viewport sizes
   */
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

  /**
   * Test mobile navigation functionality
   */
  async testMobileNavigation() {
    // Set mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });

    // Check mobile nav is visible
    await this.elementShouldBeVisible(SELECTORS.MOBILE_NAV);

    // Check burger menu is present
    await this.elementShouldBeVisible(SELECTORS.BURGER_MENU);

    // Open mobile menu
    await this.clickElement(SELECTORS.BURGER_MENU);
    await expect(this.page.locator(SELECTORS.MOBILE_NAV_CONTENT)).toHaveClass(
      /show/,
    );

    // Check mobile nav links are present
    const mobileNavLinks = this.page.locator(SELECTORS.MOBILE_NAV_LINKS);
    const linkCount = await mobileNavLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // Close mobile menu by clicking outside
    await this.page.click("body");
    await expect(this.page.locator(SELECTORS.MOBILE_NAV_CONTENT)).not
      .toHaveClass(/show/);
  }

  /**
   * Test desktop navigation functionality
   */
  async testDesktopNavigation() {
    // Set desktop viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });

    // Check desktop nav is visible
    await this.elementShouldBeVisible(SELECTORS.DESKTOP_NAV);

    // Check desktop nav links are present
    const desktopNavLinks = this.page.locator(SELECTORS.DESKTOP_NAV_LINKS);
    const linkCount = await desktopNavLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  }

  /**
   * Test mobile search functionality
   */
  async testMobileSearch() {
    // Set mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });

    // Navigate to home page to ensure mobile navigation is present
    await this.navigateTo("/");

    // Check mobile search elements
    await this.elementShouldBeVisible(SELECTORS.MOBILE_SEARCH_CONTAINER);
    await this.elementShouldBeVisible(SELECTORS.MOBILE_SEARCH_INPUT);
    await this.elementShouldBeVisible(SELECTORS.MOBILE_SEARCH_BUTTON);

    // Test search functionality
    await this.fillField(SELECTORS.MOBILE_SEARCH_INPUT, "test");
    await this.clickElement(SELECTORS.MOBILE_SEARCH_BUTTON);
    await this.shouldBeOnUrl(/\/devices\?search=test/);
  }

  /**
   * Test navigation switching based on viewport
   */
  async testNavigationResponsiveness() {
    // Test desktop view
    await this.page.setViewportSize({ width: 1280, height: 720 });
    await this.elementShouldBeVisible(SELECTORS.DESKTOP_NAV);
    await expect(this.page.locator(SELECTORS.MOBILE_NAV)).not.toBeVisible();

    // Test mobile view
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.elementShouldBeVisible(SELECTORS.MOBILE_NAV);
    await expect(this.page.locator(SELECTORS.DESKTOP_NAV)).not.toBeVisible();

    // Test tablet view
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.elementShouldBeVisible(SELECTORS.MOBILE_NAV);
    await expect(this.page.locator(SELECTORS.DESKTOP_NAV)).not.toBeVisible();
  }

  /**
   * Check if profile link is visible, handling both mobile and desktop navigation
   */
  async checkProfileLinkVisibility() {
    const isMobile = await this.page.locator(".mobile-nav").isVisible();

    if (isMobile) {
      // On mobile, open the menu first
      await this.page.click(".burger-menu");
      await expect(this.page.locator(".mobile-nav-content")).toHaveClass(
        /show/,
      );
      await expect(this.page.locator('.mobile-nav-content [href="/profile"]'))
        .toBeVisible();
    } else {
      // On desktop, profile link should be directly visible
      await expect(this.page.locator('[href="/profile"]')).toBeVisible();
    }
  }

  /**
   * Check if login link is not visible, handling both mobile and desktop navigation
   */
  async checkLoginLinkNotVisible() {
    const isMobile = await this.page.locator(".mobile-nav").isVisible();

    if (isMobile) {
      // On mobile, check in the mobile menu
      await expect(
        this.page.locator('.mobile-nav-content a[href="/auth/sign-in"]'),
      ).not.toBeVisible();
    } else {
      // On desktop, check directly
      await expect(this.page.locator('a[href="/auth/sign-in"]')).not
        .toBeVisible();
    }
  }

  /**
   * Check for auth form error message
   */
  async checkAuthFormError() {
    await expect(this.page.locator(".auth-form-error")).toBeVisible();
  }

  /**
   * Check for auth form error message with specific text
   */
  async checkAuthFormErrorWithText(expectedText: string) {
    await expect(this.page.locator(".auth-form-error")).toBeVisible();
    await expect(this.page.locator(".auth-form-error")).toContainText(
      expectedText,
    );
  }

  /**
   * Wait for and verify CSRF token is present on the sign-in page
   */
  async waitForCsrfToken() {
    await this.page.waitForSelector('input[name="csrf_token"]', {
      state: "attached", // Use "attached" for hidden elements
      timeout: 10000,
    });
    await expect(this.page.locator('input[name="csrf_token"]')).toHaveValue(
      /^.+$/,
    );
  }

  /**
   * Wait for page to be fully ready with content
   */
  async waitForPageReady(
    selectors: string[] = ["main", "body"],
    timeout = 10000,
  ) {
    for (const selector of selectors) {
      try {
        await this.page.waitForSelector(selector, {
          state: "visible",
          timeout,
        });
        break; // If one selector works, we're good
      } catch (error) {
        // Continue to next selector
      }
    }
  }

  /**
   * Wait for specific content to be loaded (useful for dynamic pages)
   */
  async waitForContent(selector: string, timeout = 10000) {
    await this.page.waitForSelector(selector, {
      state: "visible",
      timeout,
    });
  }

  /**
   * Navigate to authenticated pages with longer timeouts and retry logic
   */
  async navigateToAuthenticatedPage(path: string, options?: {
    waitForSelector?: string;
    timeout?: number;
    maxRetries?: number;
  }) {
    const {
      waitForSelector = "main, .profile-container, body",
      timeout = 30000,
      maxRetries = 2,
    } = options || {};

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.page.goto(path, { waitUntil: "domcontentloaded" });

        // Wait for content with longer timeout for authenticated pages
        await this.page.waitForSelector(waitForSelector, {
          state: "visible",
          timeout,
        });

        return; // Success
      } catch (error) {
        if (attempt === maxRetries) {
          throw new Error(
            `Failed to navigate to authenticated page ${path} after ${maxRetries} attempts: ${error}`,
          );
        }

        // Wait before retry
        await this.page.waitForTimeout(2000);
      }
    }
  }

  /**
   * Safely click an element with page closure handling
   */
  async safeClick(selector: string, options?: { timeout?: number }) {
    const { timeout = 10000 } = options || {};

    try {
      // Check if page is still open
      if (this.page.isClosed()) {
        throw new Error("Page has been closed");
      }

      await this.page.click(selector, { timeout });
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      if (
        errorMessage.includes(
          "Target page, context or browser has been closed",
        )
      ) {
        throw new Error(
          `Page was closed during click on ${selector}. This usually indicates a navigation or browser issue.`,
        );
      }
      throw error;
    }
  }

  /**
   * Check if page is still open and throw descriptive error if not
   */
  checkPageOpen() {
    if (this.page.isClosed()) {
      throw new Error(
        "Page has been closed unexpectedly. This may indicate a browser crash or navigation issue.",
      );
    }
  }

  /**
   * Safely check if an element is visible with page closure handling
   */
  async safeIsVisible(selector: string): Promise<boolean> {
    try {
      this.checkPageOpen();
      return await this.page.locator(selector).isVisible();
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      if (
        errorMessage.includes("Target page, context or browser has been closed")
      ) {
        throw new Error(
          `Page was closed while checking visibility of ${selector}`,
        );
      }
      throw error;
    }
  }

  /**
   * Disable Umami tracking for the current page
   * This prevents test runs from interfering with analytics
   */
  async disableUmamiTracking() {
    await this.page.evaluate(() => {
      localStorage.setItem("umami.disabled", "1");
    });
  }

  /**
   * Enable Umami tracking for the current page
   * This allows test runs to interact with analytics
   */
  async enableUmamiTracking() {
    await this.page.evaluate(() => {
      localStorage.removeItem("umami.disabled");
    });
  }
}

/**
 * Create a test helper instance
 */
export function createTestHelper(page: Page): TestHelpers {
  return new TestHelpers(page);
}

// Import SELECTORS from the constants file
import { SELECTORS } from "./constants.ts";
