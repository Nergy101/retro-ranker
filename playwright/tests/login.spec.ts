import { expect, test } from "@playwright/test";
import process from "node:process";
import {
  createAuthHelper,
  createTestHelper,
  SELECTORS,
  TEST_DATA,
} from "./utils/index.ts";

test.describe("Login Functionality", () => {
  test("should login successfully with valid credentials from .env", async ({ page }) => {
    const authHelper = createAuthHelper(page);

    // Check if credentials are available
    const nickname = process.env.TEST_USER_NICKNAME;
    const password = process.env.TEST_USER_PASSWORD;

    if (!nickname || !password) {
      test.skip();
      return;
    }

    // Perform login
    await authHelper.loginWithEnvCredentials();

    // Verify we're logged in
    expect(await authHelper.isLoggedIn()).toBe(true);

    // Check we're on the profile page
    await expect(page).toHaveURL(/\/profile/);

    // Verify user-specific elements are visible
    await expect(page.locator("main")).toBeVisible();
  });

  test("should login successfully with specific credentials", async ({ page }) => {
    const authHelper = createAuthHelper(page);

    // Check if credentials are available
    const nickname = process.env.TEST_USER_NICKNAME;
    const password = process.env.TEST_USER_PASSWORD;

    if (!nickname || !password) {
      test.skip();
      return;
    }

    // Perform login with specific credentials
    await authHelper.loginWithCredentials(nickname, password);

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

    // Fill in invalid credentials using helper methods
    await helper.fillField(SELECTORS.NICKNAME_INPUT, "invalid_user");
    await helper.fillField(SELECTORS.PASSWORD_INPUT, "invalid_password");

    // Submit the form and wait for the redirect
    await Promise.all([
      page.waitForURL(/\/auth\/sign-in\?error=invalid-credentials/),
      helper.clickElement(SELECTORS.SUBMIT_BUTTON),
    ]);

    // Wait for the page to load after redirect
    await helper.waitForNetworkIdle();

    // Check for error message
    await helper.checkAuthFormError();
  });

  test("should fail login with empty credentials", async ({ page }) => {
    const helper = createTestHelper(page);

    await helper.navigateTo("/auth/sign-in");

    // Wait for and verify CSRF token is present
    await helper.waitForCsrfToken();

    // Try to submit form without filling credentials
    await helper.clickElement(SELECTORS.SUBMIT_BUTTON);

    // Should stay on sign-in page (form validation should prevent submission)
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });

  test("should handle login with missing nickname", async ({ page }) => {
    const helper = createTestHelper(page);

    await helper.navigateTo("/auth/sign-in");

    // Wait for and verify CSRF token is present
    await helper.waitForCsrfToken();

    // Fill only password
    await helper.fillField(SELECTORS.PASSWORD_INPUT, "some_password");

    // Submit the form
    await helper.clickElement(SELECTORS.SUBMIT_BUTTON);

    // Should stay on sign-in page
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });

  test("should handle login with missing password", async ({ page }) => {
    const helper = createTestHelper(page);

    await helper.navigateTo("/auth/sign-in");

    // Wait for and verify CSRF token is present
    await helper.waitForCsrfToken();

    // Fill only nickname
    await helper.fillField(SELECTORS.NICKNAME_INPUT, "some_user");

    // Submit the form
    await helper.clickElement(SELECTORS.SUBMIT_BUTTON);

    // Should stay on sign-in page
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });

  test("should logout successfully", async ({ page }) => {
    const authHelper = createAuthHelper(page);

    // Check if credentials are available
    const nickname = process.env.TEST_USER_NICKNAME;
    const password = process.env.TEST_USER_PASSWORD;

    if (!nickname || !password) {
      test.skip();
      return;
    }

    // First login
    await authHelper.loginWithEnvCredentials();
    expect(await authHelper.isLoggedIn()).toBe(true);

    // Then logout
    await authHelper.logout();

    // Verify we're logged out
    expect(await authHelper.isLoggedIn()).toBe(false);

    // Should be redirected to home page or sign-in page
    const currentUrl = page.url();
    expect(currentUrl.includes("/profile")).toBe(false);
  });

  test("should maintain login state across page navigation", async ({ page }) => {
    const helper = createTestHelper(page);
    const authHelper = createAuthHelper(page);

    // Check if credentials are available
    const nickname = process.env.TEST_USER_NICKNAME;
    const password = process.env.TEST_USER_PASSWORD;

    if (!nickname || !password) {
      test.skip();
      return;
    }

    // Login
    await authHelper.loginWithEnvCredentials();
    expect(await authHelper.isLoggedIn()).toBe(true);

    // Navigate to different pages
    await helper.navigateTo("/");
    expect(await authHelper.isLoggedIn()).toBe(true);

    await helper.navigateTo("/devices");
    expect(await authHelper.isLoggedIn()).toBe(true);

    await helper.navigateTo("/leaderboard");
    expect(await authHelper.isLoggedIn()).toBe(true);

    // Navigate back to profile with longer timeout for authenticated page
    await helper.navigateToAuthenticatedPage("/profile");
    expect(await authHelper.isLoggedIn()).toBe(true);
  });

  test("should show user-specific navigation elements when logged in", async ({ page }) => {
    const helper = createTestHelper(page);
    const authHelper = createAuthHelper(page);

    // Check if credentials are available
    const nickname = process.env.TEST_USER_NICKNAME;
    const password = process.env.TEST_USER_PASSWORD;

    if (!nickname || !password) {
      test.skip();
      return;
    }

    // Login
    await authHelper.loginWithEnvCredentials();

    // Check for user-specific navigation elements (handles both mobile and desktop)
    await helper.checkProfileLinkVisibility();
    await helper.checkLoginLinkNotVisible();
  });

  test("should handle CSRF token correctly", async ({ page }) => {
    const authHelper = createAuthHelper(page);

    // Check if credentials are available
    const nickname = process.env.TEST_USER_NICKNAME;
    const password = process.env.TEST_USER_PASSWORD;

    if (!nickname || !password) {
      test.skip();
      return;
    }

    // Get CSRF token
    const csrfToken = await authHelper.getCsrfToken();
    expect(csrfToken).toBeTruthy();
    expect(csrfToken.length).toBeGreaterThan(0);

    // Verify CSRF token is in the form
    await expect(page.locator('input[name="csrf_token"]')).toHaveValue(
      csrfToken,
    );
  });

  test("should work with multiple test users if configured", async ({ page }) => {
    const authHelper = createAuthHelper(page);

    // Check if second user credentials are available
    const nickname2 = process.env.TEST_USER_2_NICKNAME;
    const password2 = process.env.TEST_USER_2_PASSWORD;

    if (!nickname2 || !password2) {
      test.skip();
      return;
    }

    // Login with second user
    await authHelper.loginWithCredentials(nickname2, password2);

    // Verify we're logged in
    expect(await authHelper.isLoggedIn()).toBe(true);

    // Check we're on the profile page
    await expect(page).toHaveURL(/\/profile/);
  });
});
