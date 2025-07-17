import { expect, Page } from "@playwright/test";

/**
 * Helper class for common test operations
 */
export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to a page and wait for it to load
   */
  async navigateTo(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState("networkidle");
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
  async waitForNetworkIdle() {
    await this.page.waitForLoadState("networkidle");
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
}

/**
 * Create a test helper instance
 */
export function createTestHelper(page: Page): TestHelpers {
  return new TestHelpers(page);
}

/**
 * Common selectors for the application
 */
export const SELECTORS = {
  NAVIGATION: "nav",
  NAV_LINKS: "nav a",
  MAIN_CONTENT: "main",
  FORM: "form",
  EMAIL_INPUT: 'input[type="email"], input[name="email"]',
  NICKNAME_INPUT: 'input[name="nickname"], input[type="text"]',
  PASSWORD_INPUT: 'input[type="password"], input[name="password"]',
  SUBMIT_BUTTON: 'button[type="submit"], input[type="submit"]',
  ERROR_MESSAGE: '.error, [data-testid="error"]',
  SUCCESS_MESSAGE: '.success, [data-testid="success"]',
  AUTH_FORM: ".auth-form",
  OAUTH_BUTTONS: ".auth-signin-btn",
} as const;

/**
 * Common test data
 */
export const TEST_DATA = {
  VALID_EMAIL: "test@example.com",
  VALID_PASSWORD: "password123",
  INVALID_EMAIL: "invalid-email",
  INVALID_PASSWORD: "123",
} as const;
