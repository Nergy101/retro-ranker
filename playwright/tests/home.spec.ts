import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load the home page with correct title and meta", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check that the page has the correct title
    await expect(page).toHaveTitle(/Retro Ranker - Home/);

    // Check for meta description
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Retro Ranker - Home to browse and compare retro gaming handhelds/,
    );
  });

  test("should display hero section with main content", async ({ page }) => {
    await page.goto("/");

    // Check for hero container
    await expect(page.locator(".hero-container")).toBeVisible();

    // Check for main heading with "Retro Ranker"
    await expect(page.locator("h1")).toContainText("Retro Ranker");

    // Check for hero description
    await expect(page.locator(".hero-section p")).toBeVisible();

    // Check for join community button in hero section
    await expect(page.locator('.hero-section a[href="/auth/sign-in"]'))
      .toBeVisible();

    // Check for hero image
    await expect(page.locator('img[alt="Retro Ranker"]')).toBeVisible();
  });

  test("should display navigation elements", async ({ page }) => {
    await page.goto("/");

    // Check for navigation elements (TopNavbar renders either DesktopNav or MobileNav)
    await expect(page.locator("body")).toBeVisible();

    // Check for main content area
    await expect(page.locator("main.main-content")).toBeVisible();

    // Check for footer
    await expect(page.locator("footer")).toBeVisible();
  });

  test("should display popular searches section", async ({ page }) => {
    await page.goto("/");

    // Check for popular searches container
    await expect(page.locator(".popular-searches-container")).toBeVisible();

    // Check for popular searches heading
    await expect(page.locator(".popular-searches-container h3")).toBeVisible();

    // Check for tag components (should have multiple tags)
    const tags = page.locator(".popular-searches-container a");
    const tagCount = await tags.count();
    expect(tagCount).toBeGreaterThan(0);
  });

  test("should display device sections", async ({ page }) => {
    await page.goto("/");

    // Check for all main device sections
    await expect(page.locator(".home-section")).toHaveCount(4);

    // Check for specific section titles using more specific selectors
    await expect(page.locator("h2.home-section-title:has-text('New Arrivals')"))
      .toBeVisible();
    await expect(
      page.locator("h2.home-section-title").filter({
        hasText: /Bang for.*buck/i,
      }),
    ).toBeVisible();
    await expect(page.locator("h2.home-section-title:has-text('Upcoming')"))
      .toBeVisible();
    await expect(
      page.locator("h2.home-section-title:has-text('Personal Picks')"),
    ).toBeVisible();

    // Check that each section has device cards
    const deviceCards = page.locator(".device-card");
    const cardCount = await deviceCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Check for "See More" cards
    const seeMoreCards = page.locator(".see-more-card");
    const seeMoreCount = await seeMoreCards.count();
    expect(seeMoreCount).toBeGreaterThan(0);
  });

  test("should display site introduction section", async ({ page }) => {
    await page.goto("/");

    // Check for site introduction
    await expect(page.locator(".site-introduction")).toBeVisible();

    // Check for handheld database heading
    await expect(page.locator(".site-introduction h2")).toBeVisible();

    // Check for action buttons
    const actionButtons = page.locator(".index-buttons a");
    const buttonCount = await actionButtons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Check for specific navigation buttons in the index-buttons section
    await expect(page.locator('.index-buttons a[href="/devices"]'))
      .toBeVisible();
    await expect(page.locator('.index-buttons a[href="/compare"]'))
      .toBeVisible();
    await expect(page.locator('.index-buttons a[href="/release-timeline"]'))
      .toBeVisible();
    await expect(page.locator('.index-buttons a[href="/charts"]'))
      .toBeVisible();
  });

  test("should be responsive across different viewport sizes", async ({ page }) => {
    await page.goto("/");

    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator(".hero-container")).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator(".hero-container")).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator(".hero-container")).toBeVisible();
  });

  test("should have working device card links", async ({ page }) => {
    await page.goto("/");

    // Check that device cards are clickable and have proper hrefs
    const deviceCardLinks = page.locator("a[href^='/devices/']");
    const linkCount = await deviceCardLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // Check that links point to device pages
    for (let i = 0; i < Math.min(linkCount, 3); i++) {
      const href = await deviceCardLinks.nth(i).getAttribute("href");
      expect(href).toMatch(/^\/devices\/.+/);
    }
  });

  test("should have working navigation links", async ({ page }) => {
    await page.goto("/");

    // Check that "See More" cards have proper links
    const seeMoreLinks = page.locator(".see-more-card");
    const seeMoreCount = await seeMoreLinks.count();
    expect(seeMoreCount).toBeGreaterThan(0);

    // Check that action buttons have proper links
    const actionLinks = page.locator(".index-buttons a");
    const actionCount = await actionLinks.count();
    expect(actionCount).toBeGreaterThan(0);

    // Verify specific expected links exist
    const expectedLinks = [
      {
        href: "/devices?sort=new-arrivals",
        selector: ".see-more-card[href='/devices?sort=new-arrivals']",
      },
      {
        href: "/devices?tags=mid&sort=highly-ranked",
        selector: ".see-more-card[href='/devices?tags=mid&sort=highly-ranked']",
      },
      {
        href: "/devices?tags=upcoming",
        selector: ".see-more-card[href='/devices?tags=upcoming']",
      },
      {
        href: "/devices?tags=personal-pick",
        selector: ".see-more-card[href='/devices?tags=personal-pick']",
      },
    ];

    for (const expectedLink of expectedLinks) {
      await expect(page.locator(expectedLink.selector)).toBeVisible();
    }
  });

  test("should display device images and information", async ({ page }) => {
    await page.goto("/");

    // Check for device images
    const deviceImages = page.locator(".device-card-image");
    const imageCount = await deviceImages.count();
    expect(imageCount).toBeGreaterThan(0);

    // Check for device names
    const deviceNames = page.locator(".device-card-hgroup strong");
    const nameCount = await deviceNames.count();
    expect(nameCount).toBeGreaterThan(0);

    // Check for device brands
    const deviceBrands = page.locator(".device-card-hgroup span");
    const brandCount = await deviceBrands.count();
    expect(brandCount).toBeGreaterThan(0);
  });
});
