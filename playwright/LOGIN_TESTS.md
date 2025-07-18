# Login Tests with Playwright

This document explains how to set up and run login tests for the Retro Ranker application using Playwright.

## Overview

The login tests use environment variables to store test credentials securely. This approach allows you to:

- Keep credentials out of version control
- Use different credentials for different environments
- Run tests with real user accounts
- Test the complete authentication flow

## Setup

### 1. Create Environment File

Copy the example environment file and fill in your credentials:

```bash
cp env.example .env
```

### 2. Configure Credentials

Edit the `.env` file with your test user credentials:

```env
# Playwright Test Credentials
# Copy this file to .env and fill in your actual credentials
# This file is ignored by git for security

# Test user credentials for login tests
TEST_USER_NICKNAME=your_test_nickname
TEST_USER_PASSWORD=your_test_password

# Optional: Additional test users for different scenarios
TEST_USER_2_NICKNAME=your_second_test_nickname
TEST_USER_2_PASSWORD=your_second_test_password
```

**Important**:

- Use a real test account that you control
- The account should have basic permissions
- Consider creating a dedicated test account for this purpose
- Never commit the `.env` file to version control

### 3. Install Dependencies

The tests require the `dotenv` package to load environment variables:

```bash
npm install dotenv
```

## Test Structure

### Authentication Helper

The tests use an `AuthHelpers` class that provides common authentication operations:

- `loginWithEnvCredentials()` - Login using credentials from `.env`
- `loginWithCredentials(nickname, password)` - Login with specific credentials
- `isLoggedIn()` - Check if user is currently logged in
- `logout()` - Logout the current user
- `getCsrfToken()` - Get CSRF token from the sign-in page

### Test Cases

The `login.spec.ts` file includes comprehensive test cases:

#### Positive Tests

- **Successful login with .env credentials** - Tests the main login flow
- **Successful login with specific credentials** - Tests login with provided credentials
- **Login state persistence** - Verifies login state across page navigation
- **User-specific navigation elements** - Checks that logged-in users see appropriate UI elements
- **CSRF token handling** - Verifies CSRF protection works correctly

#### Negative Tests

- **Invalid credentials** - Tests login failure with wrong credentials
- **Empty credentials** - Tests form validation
- **Missing nickname** - Tests partial form submission
- **Missing password** - Tests partial form submission

#### Additional Tests

- **Logout functionality** - Tests the logout process
- **Multiple test users** - Tests with different user accounts (if configured)

## Running the Tests

### Run All Login Tests

```bash
npm test login.spec.ts
```

### Run Specific Test

```bash
npm test login.spec.ts --grep "should login successfully"
```

### Run Tests in Headed Mode

```bash
npm run test:headed login.spec.ts
```

### Run Tests with UI

```bash
npm run test:ui login.spec.ts
```

## Test Behavior

### Conditional Test Execution

Tests that require credentials will be skipped if the environment variables are not set:

```typescript
if (!nickname || !password) {
  test.skip();
  return;
}
```

This allows the test suite to run even without credentials configured.

### Error Handling

The tests include proper error handling for:

- Missing environment variables
- Network timeouts
- Invalid page states
- Authentication failures

## Security Considerations

### Environment Variables

- The `.env` file is ignored by git (see `.gitignore`)
- Never commit real credentials to version control
- Use different credentials for different environments (dev, staging, prod)

### Test Data

- Use dedicated test accounts, not production accounts
- Test accounts should have minimal permissions
- Consider using disposable test accounts for CI/CD

### CSRF Protection

The tests verify that CSRF tokens are properly handled:

- Tokens are present in forms
- Tokens are validated on submission
- Invalid tokens are rejected

## Troubleshooting

### Common Issues

1. **"TEST_USER_NICKNAME and TEST_USER_PASSWORD not set"**

   - Ensure `.env` file exists and contains the required variables
   - Check that the variable names match exactly

2. **Login fails with valid credentials**

   - Verify the test account exists and is active
   - Check that the application is running on the expected URL
   - Ensure the account hasn't been locked or disabled

3. **Tests timeout**

   - Check network connectivity
   - Verify the application is responsive
   - Increase timeout values in `playwright.config.ts` if needed

4. **CSRF token errors**
   - Ensure the application is generating valid CSRF tokens
   - Check that the token extraction logic matches the actual form structure

### Debug Mode

Run tests in debug mode to see what's happening:

```bash
npm run test:debug login.spec.ts
```

This will open the browser and allow you to step through the test execution.

## Integration with CI/CD

For continuous integration, you can set environment variables in your CI system:

```yaml
# Example GitHub Actions configuration
env:
  TEST_USER_NICKNAME: ${{ secrets.TEST_USER_NICKNAME }}
  TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
```

## Best Practices

1. **Use dedicated test accounts** - Don't use production accounts for testing
2. **Rotate credentials regularly** - Change test account passwords periodically
3. **Monitor test results** - Watch for authentication-related failures
4. **Keep tests isolated** - Each test should be independent and not rely on others
5. **Use descriptive test names** - Make it clear what each test is verifying

## Related Files

- `playwright/tests/login.spec.ts` - Main test file
- `playwright/tests/utils/test-helpers.ts` - Helper functions
- `playwright/playwright.config.ts` - Playwright configuration
- `playwright/env.example` - Environment variables template
- `playwright/.env` - Your actual credentials (not in git)
