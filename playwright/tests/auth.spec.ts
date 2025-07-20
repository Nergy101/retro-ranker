import { expect, test } from "@playwright/test";
import { createTestHelper, SELECTORS } from "./utils/index.ts";

test.describe("Authentication Pages", () => {
  test("should load sign-in page", async ({ page }) => {
    const helper = createTestHelper(page);
    await helper.navigateTo("/auth/sign-in");

    // Check that the page has a title
    await helper.pageShouldHaveTitle(/Log in/);

    // Check that the page is accessible (basic checks)
    await helper.pageShouldBeAccessible();

    // Check for main content
    await helper.elementShouldBeVisible("main");
  });

  test("should load sign-up page", async ({ page }) => {
    const helper = createTestHelper(page);
    await helper.navigateTo("/auth/sign-up");

    // Check that the page has a title
    await helper.pageShouldHaveTitle(/Sign up/);

    // Check that the page is accessible (basic checks)
    await helper.pageShouldBeAccessible();

    // Check for main content
    await helper.elementShouldBeVisible("main");
  });

  test("should have form elements on sign-in page", async ({ page }) => {
    const helper = createTestHelper(page);
    await helper.navigateTo("/auth/sign-in");

    // Check for form elements
    await helper.elementShouldBeVisible(SELECTORS.FORM);

    // Check for input fields using constants
    await helper.elementShouldBeVisible(SELECTORS.NICKNAME_INPUT);
    await helper.elementShouldBeVisible(SELECTORS.PASSWORD_INPUT);
  });

  test("should have form elements on sign-up page", async ({ page }) => {
    const helper = createTestHelper(page);
    await helper.navigateTo("/auth/sign-up");

    // Check for form elements
    await helper.elementShouldBeVisible(SELECTORS.FORM);

    // Check for input fields using constants
    await helper.elementShouldBeVisible(SELECTORS.NICKNAME_INPUT);
    await helper.elementShouldBeVisible(SELECTORS.PASSWORD_INPUT);
    await helper.elementShouldBeVisible(SELECTORS.CONFIRM_PASSWORD_INPUT);
  });

  test("should navigate between auth pages", async ({ page }) => {
    const helper = createTestHelper(page);
    await helper.navigateTo("/auth/sign-in");

    // Look for link to sign-up page - use more specific selector
    const signUpLink = page.locator('a[href="/auth/sign-up"]').first();
    if (await signUpLink.isVisible()) {
      await helper.safeClick('a[href="/auth/sign-up"]');
      await helper.shouldBeOnUrl(/\/auth\/sign-up/);
    }

    await helper.navigateTo("/auth/sign-up");

    // Look for link to sign-in page - use more specific selector
    const signInLink = page.locator('a[href="/auth/sign-in"]').first();
    if (await signInLink.isVisible()) {
      await helper.safeClick('a[href="/auth/sign-in"]');
      await helper.shouldBeOnUrl(/\/auth\/sign-in/);
    }
  });
});
