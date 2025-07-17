import { expect, test } from "@playwright/test";
import { createTestHelper, SELECTORS } from "./utils/test-helpers.ts";

test.describe("Authentication Pages", () => {
  test("should load sign-in page", async ({ page }) => {
    const helper = createTestHelper(page);
    await helper.navigateTo("/auth/sign-in");

    // Check that the page has a title
    await expect(page).toHaveTitle(/Log in/);

    // Check that the page is accessible (basic checks)
    await helper.pageShouldBeAccessible();

    // Check for main content
    await expect(page.locator("main")).toBeVisible();
  });

  test("should load sign-up page", async ({ page }) => {
    const helper = createTestHelper(page);
    await helper.navigateTo("/auth/sign-up");

    // Check that the page has a title
    await expect(page).toHaveTitle(/Sign up/);

    // Check that the page is accessible (basic checks)
    await helper.pageShouldBeAccessible();

    // Check for main content
    await expect(page.locator("main")).toBeVisible();
  });

  test("should have form elements on sign-in page", async ({ page }) => {
    const helper = createTestHelper(page);
    await helper.navigateTo("/auth/sign-in");

    // Check for form elements
    await expect(page.locator("form")).toBeVisible();

    // Check for input fields (using correct field names)
    const nicknameInput = page.locator('input[name="nickname"]');
    const passwordInput = page.locator('input[name="password"]');

    await expect(nicknameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test("should have form elements on sign-up page", async ({ page }) => {
    const helper = createTestHelper(page);
    await helper.navigateTo("/auth/sign-up");

    // Check for form elements
    await expect(page.locator("form")).toBeVisible();

    // Check for input fields (using correct field names)
    const nicknameInput = page.locator('input[name="nickname"]');
    const passwordInput = page.locator('input[name="password"]');
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]');

    await expect(nicknameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(confirmPasswordInput).toBeVisible();
  });

  test("should navigate between auth pages", async ({ page }) => {
    const helper = createTestHelper(page);
    await helper.navigateTo("/auth/sign-in");

    // Look for link to sign-up page - use more specific selector
    const signUpLink = page.locator('a[href="/auth/sign-up"]').first();
    if (await signUpLink.isVisible()) {
      await signUpLink.click();
      await expect(page).toHaveURL(/\/auth\/sign-up/);
    }

    await helper.navigateTo("/auth/sign-up");

    // Look for link to sign-in page - use more specific selector
    const signInLink = page.locator('a[href="/auth/sign-in"]').first();
    if (await signInLink.isVisible()) {
      await signInLink.click();
      await expect(page).toHaveURL(/\/auth\/sign-in/);
    }
  });
});
