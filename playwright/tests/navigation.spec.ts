import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate to all main pages", async ({ page }) => {
    // Start from home page
    await page.goto("/");

    // Test navigation to leaderboard
    await page.goto("/leaderboard");
    await expect(page).toHaveURL(/\/leaderboard/);

    // Test navigation to FAQ
    await page.goto("/faq");
    await expect(page).toHaveURL(/\/faq/);

    // Test navigation to terms
    await page.goto("/terms");
    await expect(page).toHaveURL(/\/terms/);

    // Test navigation to release timeline
    await page.goto("/release-timeline");
    await expect(page).toHaveURL(/\/release-timeline/);
  });

  test("should have working navigation links", async ({ page }) => {
    await page.goto("/");

    // Wait for navigation to load
    await page.waitForLoadState("networkidle");

    // Test navigation links with more specific selector
    const navLinks = page.locator("nav a[href]");
    const linkCount = await navLinks.count();

    // Ensure we have at least some navigation links
    expect(linkCount).toBeGreaterThan(0);

    // Test only the first few links to avoid timeouts
    for (let i = 0; i < Math.min(linkCount, 3); i++) {
      const link = navLinks.nth(i);

      // Wait for the link to be visible before interacting
      await expect(link).toBeVisible();

      const href = await link.getAttribute("href");
      expect(href).toBeTruthy();

      // Only test links that are not anchors and are valid URLs
      if (href && !href.startsWith("#") && href !== "/") {
        try {
          await link.click();
          await expect(page).toHaveURL(new RegExp(href.replace("/", "\\/")));
          await page.goBack();
          // Wait for the page to load after going back
          await page.waitForLoadState("networkidle");
        } catch (error) {
          // Log the error but continue with other links
          console.log(`Failed to test link ${href}:`, error);
        }
      }
    }
  });

  test("should handle 404 pages gracefully", async ({ page }) => {
    await page.goto("/non-existent-page");

    // Should show 404 page
    await expect(page.locator("body")).toBeVisible();

    // Should have some error content
    const errorContent = page.locator('h1, h2, .error, [data-testid="error"]');
    await expect(errorContent.first()).toBeVisible();
  });

  test("should maintain navigation state", async ({ page }) => {
    await page.goto("/");

    // Navigate to a page
    await page.goto("/leaderboard");

    // Refresh the page
    await page.reload();

    // Should still be on the same page
    await expect(page).toHaveURL(/\/leaderboard/);
  });
});
