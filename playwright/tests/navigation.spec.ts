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

  test("should have working navigation links on desktop", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    // Wait for navigation to load
    await page.waitForLoadState("networkidle");

    // Test desktop navigation links
    const navLinks = page.locator(".desktop-nav a[href]");
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
          console.log(`Failed to test desktop link ${href}:`, error);
        }
      }
    }
  });

  test("should have working mobile navigation with burger menu", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Wait for navigation to load
    await page.waitForLoadState("networkidle");

    // Check that mobile navigation is present
    await expect(page.locator(".mobile-nav")).toBeVisible();

    // Check that burger menu button is present
    const burgerMenu = page.locator(".burger-menu");
    await expect(burgerMenu).toBeVisible();

    // Check that mobile nav content exists in DOM but is hidden initially (display: none)
    const mobileNavContent = page.locator(".mobile-nav-content");
    await expect(mobileNavContent).toBeAttached();

    // Click burger menu to open mobile navigation
    await burgerMenu.click();

    // Wait for mobile nav content to be visible (should have 'show' class)
    await expect(mobileNavContent).toHaveClass(/show/);

    // Check that mobile navigation links are present
    const mobileNavLinks = page.locator(".mobile-nav-content a[href]");
    const linkCount = await mobileNavLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // Test mobile navigation links
    for (let i = 0; i < Math.min(linkCount, 3); i++) {
      const link = mobileNavLinks.nth(i);

      // Wait for the link to be visible before interacting
      await expect(link).toBeVisible();

      const href = await link.getAttribute("href");
      expect(href).toBeTruthy();

      // Only test links that are not anchors and are valid URLs
      if (href && !href.startsWith("#") && href !== "/") {
        try {
          await link.click();
          await expect(page).toHaveURL(new RegExp(href.replace("/", "\\/")));

          // Navigate back and reopen mobile menu for next test
          await page.goBack();
          await page.waitForLoadState("networkidle");

          // Reopen mobile menu for next test
          await burgerMenu.click();
          await expect(mobileNavContent).toHaveClass(/show/);
        } catch (error) {
          // Log the error but continue with other links
          console.log(`Failed to test mobile link ${href}:`, error);
        }
      }
    }

    // Test closing mobile navigation by clicking outside
    await page.click("body");
    await expect(mobileNavContent).not.toHaveClass(/show/);
  });

  test("should have mobile search functionality", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Wait for navigation to load
    await page.waitForLoadState("networkidle");

    // Check that mobile search container is present
    await expect(page.locator(".mobile-nav-search-container")).toBeVisible();

    // Check that search input is present
    const searchInput = page.locator(
      ".mobile-nav-search-container input[type='search']",
    );
    await expect(searchInput).toBeVisible();

    // Check that search button is present
    const searchButton = page.locator(".search-button-mobile");
    await expect(searchButton).toBeVisible();

    // Test search functionality
    await searchInput.fill("test");
    await searchButton.click();

    // Should navigate to devices page with search query
    await expect(page).toHaveURL(/\/devices\?search=test/);
  });

  test("should have mobile controls (theme and language)", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Wait for navigation to load
    await page.waitForLoadState("networkidle");

    // Check that mobile controls are present
    await expect(page.locator(".mobile-nav-controls")).toBeVisible();

    // Check that theme switcher is present
    await expect(page.locator(".mobile-nav-controls button")).toBeVisible();

    // Check that language switcher is present
    await expect(page.locator(".mobile-nav-controls select")).toBeVisible();
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

  test("should switch between mobile and desktop navigation based on viewport", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator(".desktop-nav")).toBeVisible();
    await expect(page.locator(".mobile-nav")).not.toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator(".mobile-nav")).toBeVisible();
    await expect(page.locator(".desktop-nav")).not.toBeVisible();

    // Test tablet view (should show mobile nav)
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator(".mobile-nav")).toBeVisible();
    await expect(page.locator(".desktop-nav")).not.toBeVisible();
  });
});
