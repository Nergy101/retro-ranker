import { expect, test } from "@playwright/test";
import {
  createTestHelper,
  SELECTORS,
  TEST_DATA,
} from "./utils/test-helpers.ts";

test.describe("Example Tests with Helpers", () => {
  test("should use test helpers for cleaner tests", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page
    await helper.navigateTo("/");

    // Check page title and accessibility
    await helper.pageShouldHaveTitle(/Retro Ranker/);
    await helper.pageShouldBeAccessible();

    // Check navigation elements
    await helper.checkNavigationElements();

    // Test responsive design
    await helper.testResponsiveDesign();
  });

  test("should handle form interactions with helpers", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to sign-in page
    await helper.navigateTo("/auth/sign-in");

    // Check auth form elements
    await helper.elementShouldBeVisible(SELECTORS.AUTH_FORM);
    await helper.elementShouldBeVisible(SELECTORS.NICKNAME_INPUT);
    await helper.elementShouldBeVisible(SELECTORS.PASSWORD_INPUT);

    // Check OAuth buttons are present
    const oauthButtons = page.locator(SELECTORS.OAUTH_BUTTONS);
    const buttonCount = await oauthButtons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Fill form fields
    await helper.fillField(SELECTORS.NICKNAME_INPUT, "testuser");
    await helper.fillField(
      SELECTORS.PASSWORD_INPUT,
      TEST_DATA.VALID_PASSWORD,
    );

    // Check that fields have the correct values
    await expect(page.locator(SELECTORS.NICKNAME_INPUT)).toHaveValue(
      "testuser",
    );
    await expect(page.locator(SELECTORS.PASSWORD_INPUT)).toHaveValue(
      TEST_DATA.VALID_PASSWORD,
    );
  });

  test("should handle navigation with helpers", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to different pages
    await helper.navigateTo("/");
    await helper.shouldBeOnUrl(/\/$/);

    await helper.navigateTo("/leaderboard");
    await helper.shouldBeOnUrl(/\/leaderboard/);

    await helper.navigateTo("/faq");
    await helper.shouldBeOnUrl(/\/faq/);
  });

  test("should take screenshots for debugging", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page
    await helper.navigateTo("/");

    // Take a screenshot (useful for debugging)
    await helper.takeScreenshot("home-page");

    // Navigate to leaderboard and take another screenshot
    await helper.navigateTo("/leaderboard");
    await helper.takeScreenshot("leaderboard-page");
  });
});
