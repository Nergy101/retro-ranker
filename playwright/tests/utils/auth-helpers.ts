import { expect, Page } from "@playwright/test";
import process from "node:process";

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
                const userElements = await this.page.locator(
                    '[href="/profile"]',
                )
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
        } catch {
            // Check if we got an error message
            const errorElement = this.page.locator(".auth-form-error");
            if (await errorElement.isVisible()) {
                const errorText = await errorElement.textContent();
                throw new Error(`Login failed: ${errorText}`);
            }

            // Check if we're still on the sign-in page
            if (this.page.url().includes("/auth/sign-in")) {
                throw new Error(
                    "Login failed: Still on sign-in page after submission",
                );
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
