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
