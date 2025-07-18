import { expect, Page } from "@playwright/test";
import process from "node:process";

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
    await this.page.waitForLoadState("networkidle");
    await expect(this.page.locator('input[name="csrf_token"]')).toHaveValue(
      /^.+$/,
    );
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
  // General navigation
  NAVIGATION: "nav",
  NAV_LINKS: "nav a",
  MAIN_CONTENT: "main",

  // Desktop navigation
  DESKTOP_NAV: ".desktop-nav",
  DESKTOP_NAV_LINKS: ".desktop-nav a[href]",
  DESKTOP_SEARCH: ".nav-search-item input",
  DESKTOP_SEARCH_BUTTON: ".search-button",

  // Mobile navigation
  MOBILE_NAV: ".mobile-nav",
  MOBILE_NAV_CONTENT: ".mobile-nav-content",
  MOBILE_NAV_LINKS: ".mobile-nav-content a[href]",
  BURGER_MENU: ".burger-menu",
  MOBILE_SEARCH_CONTAINER: ".mobile-nav-search-container",
  MOBILE_SEARCH_INPUT: ".mobile-nav-search-container input[type='search']",
  MOBILE_SEARCH_BUTTON: ".search-button-mobile",
  MOBILE_CONTROLS: ".mobile-nav-controls",

  // Form elements
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

/**
 * Authentication helper functions
 */
export class AuthHelpers {
  constructor(private page: Page) {}

  /**
   * Login with credentials from environment variables
   */
  async loginWithEnvCredentials() {
    const nickname = process.env.TEST_USER_NICKNAME;
    const password = process.env.TEST_USER_PASSWORD;

    if (!nickname || !password) {
      throw new Error(
        "TEST_USER_NICKNAME and TEST_USER_PASSWORD must be set in .env file",
      );
    }

    await this.page.goto("/auth/sign-in");
    await this.page.waitForLoadState("networkidle");

    // Verify CSRF token is present
    await expect(this.page.locator('input[name="csrf_token"]')).toHaveValue(
      /^.+$/,
    );

    // Fill in the login form
    await this.page.fill('input[name="nickname"]', nickname);
    await this.page.fill('input[name="password"]', password);

    // Submit the form and wait for navigation
    await Promise.all([
      this.page.waitForURL(/\/profile/, { timeout: 10000 }),
      this.page.click('button[type="submit"]'),
    ]);

    // Wait for the page to load
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Login with specific credentials
   */
  async loginWithCredentials(nickname: string, password: string) {
    await this.page.goto("/auth/sign-in");
    await this.page.waitForLoadState("networkidle");

    // Verify CSRF token is present
    await expect(this.page.locator('input[name="csrf_token"]')).toHaveValue(
      /^.+$/,
    );

    // Fill in the login form
    await this.page.fill('input[name="nickname"]', nickname);
    await this.page.fill('input[name="password"]', password);

    // Submit the form and wait for navigation
    await Promise.all([
      this.page.waitForURL(/\/profile/, { timeout: 10000 }),
      this.page.click('button[type="submit"]'),
    ]);

    // Wait for the page to load
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Check if user is logged in by looking for profile elements
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      // Check if we're on the profile page
      if (this.page.url().includes("/profile")) {
        return true;
      }

      // Check if we're on mobile or desktop
      const isMobile = await this.page.locator(".mobile-nav").isVisible();

      if (isMobile) {
        // On mobile, check if profile link exists in the mobile menu (even if hidden)
        const mobileProfileElements = await this.page.locator(
          '.mobile-nav-content [href="/profile"]',
        ).count();
        return mobileProfileElements > 0;
      } else {
        // On desktop, check for user-specific elements in navigation
        const userElements = await this.page.locator('[href="/profile"]')
          .count();
        return userElements > 0;
      }
    } catch {
      return false;
    }
  }

  /**
   * Logout by visiting the sign-out endpoint
   */
  async logout() {
    await this.page.goto("/api/auth/sign-out");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Get CSRF token from the sign-in page
   */
  async getCsrfToken(): Promise<string> {
    await this.page.goto("/auth/sign-in");
    await this.page.waitForLoadState("networkidle");

    // Verify CSRF token is present
    await expect(this.page.locator('input[name="csrf_token"]')).toHaveValue(
      /^.+$/,
    );

    const csrfInput = this.page.locator('input[name="csrf_token"]');
    const csrfToken = await csrfInput.getAttribute("value");

    if (!csrfToken) {
      throw new Error("CSRF token not found on sign-in page");
    }

    return csrfToken;
  }

  /**
   * Login with credentials and handle potential failures
   */
  async loginWithCredentialsAndHandleFailure(
    nickname: string,
    password: string,
  ) {
    await this.page.goto("/auth/sign-in");
    await this.page.waitForLoadState("networkidle");

    // Verify CSRF token is present
    await expect(this.page.locator('input[name="csrf_token"]')).toHaveValue(
      /^.+$/,
    );

    // Fill in the login form
    await this.page.fill('input[name="nickname"]', nickname);
    await this.page.fill('input[name="password"]', password);

    // Submit the form
    await this.page.click('button[type="submit"]');

    // Wait for either success or failure
    try {
      await this.page.waitForURL(/\/profile/, { timeout: 5000 });
      await this.page.waitForLoadState("networkidle");
      return true; // Success
    } catch (error) {
      // Check if we got an error message
      const errorElement = this.page.locator(".auth-form-error");
      if (await errorElement.isVisible()) {
        const errorText = await errorElement.textContent();
        throw new Error(`Login failed: ${errorText}`);
      }

      // Check if we're still on the sign-in page
      if (this.page.url().includes("/auth/sign-in")) {
        throw new Error("Login failed: Still on sign-in page after submission");
      }

      throw new Error(
        `Login failed: Unexpected state. Current URL: ${this.page.url()}`,
      );
    }
  }

  /**
   * Check if test environment is properly configured
   */
  async checkTestEnvironment() {
    const nickname = process.env.TEST_USER_NICKNAME;
    const password = process.env.TEST_USER_PASSWORD;

    if (!nickname || !password) {
      throw new Error(
        "TEST_USER_NICKNAME and TEST_USER_PASSWORD must be set in .env file",
      );
    }

    // Only verify that the sign-in page is accessible and has the required form elements
    // Don't actually perform a login to avoid double login issues
    await this.page.goto("/auth/sign-in");
    await this.page.waitForLoadState("networkidle");

    // Verify CSRF token is present
    await expect(this.page.locator('input[name="csrf_token"]')).toHaveValue(
      /^.+$/,
    );

    // Verify form elements are present
    await expect(this.page.locator('input[name="nickname"]')).toBeVisible();
    await expect(this.page.locator('input[name="password"]')).toBeVisible();
  }
}

/**
 * Create an auth helper instance
 */
export function createAuthHelper(page: Page): AuthHelpers {
  return new AuthHelpers(page);
}
