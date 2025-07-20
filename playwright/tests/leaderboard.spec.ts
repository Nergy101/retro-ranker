import { expect, test } from "@playwright/test";
import { createTestHelper } from "./utils/index.ts";

test.describe("Leaderboard Page", () => {
  test("should load the leaderboard page", async ({ page }) => {
    const helper = createTestHelper(page);

    await helper.navigateTo("/leaderboard", {
      waitForLoadState: "networkidle",
    });

    // Check that the page has a title
    await helper.pageShouldHaveTitle(/Leaderboard/);

    // Check that the page content is visible
    await helper.elementShouldBeVisible("main");
  });

  test("should display leaderboard content", async ({ page }) => {
    const helper = createTestHelper(page);

    await helper.navigateTo("/leaderboard", {
      waitForLoadState: "networkidle",
    });

    // Check for leaderboard content
    await helper.elementShouldBeVisible("main");

    // Check for leaderboard page container
    await helper.elementShouldBeVisible(".leaderboard-page");

    // Check for leaderboard title
    await helper.elementShouldBeVisible("h1");

    // Check for top 3 section
    await helper.elementShouldBeVisible(".leaderboard-top3-row");

    // Check for ranking elements (either top 3 items or rest of rankings)
    const rankingElements = page.locator(
      '.leaderboard-top3-item, .leaderboard-rank, [style*="text-align: center"]',
    );
    const rankingCount = await rankingElements.count();
    expect(rankingCount).toBeGreaterThan(0);
  });

  test("should handle empty leaderboard gracefully", async ({ page }) => {
    const helper = createTestHelper(page);

    await helper.navigateTo("/leaderboard", {
      waitForLoadState: "networkidle",
    });

    // Even if empty, the page should still be accessible and show some content
    await helper.pageShouldBeAccessible();
  });
});
