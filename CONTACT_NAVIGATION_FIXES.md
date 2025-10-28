# Contact Page Navigation - Issues and Solutions

## Issues Identified

### 1. Network Timeout Issues

**Problem**: Tests timing out when navigating to `https://practicesoftwaretesting.com`
**Error**: `Test timeout of 30000ms exceeded while running "beforeEach" hook`

### 2. Missing Test Data Attributes

**Problem**: Tests looking for elements with `data-test` attributes that don't exist
**Examples**:

- `[data-test="nav-contact"]` - not found
- `[data-test="nav-cart"]` - not found
- `[data-test="product-card"]` - not found

### 3. Wrong Element Selectors

**Problem**: Tests expecting elements that don't match the actual website structure

## Solutions

### Solution 1: Fix Network Timeout Issues

```typescript
// In tests/mestest/modifiedpref.spec.ts
test.describe("Enhanced Navigation Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Add timeout and retry logic
    await page.goto("https://practicesoftwaretesting.com", {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Wait for network to be idle with longer timeout
    try {
      await page.waitForLoadState("networkidle", { timeout: 30000 });
    } catch (error) {
      console.log("Network idle timeout, continuing with test");
    }
  });
```

### Solution 2: Update Element Selectors

```typescript
// Fix contact page navigation test
test("Navigate to contact page", async ({ page }) => {
  // Use more reliable selectors
  const contactLink = page
    .locator('a[href="/contact"], a:has-text("Contact")')
    .first();
  await expect(contactLink).toBeVisible();
  await contactLink.click();

  // Wait for navigation with proper URL
  await page.waitForURL("**/contact");

  // Use correct selectors for contact form elements
  await expect(
    page.locator('input[name="first_name"], input[id="first_name"]')
  ).toBeVisible();
  await expect(
    page.locator('input[name="last_name"], input[id="last_name"]')
  ).toBeVisible();
  await expect(
    page.locator('input[name="email"], input[id="email"]')
  ).toBeVisible();
});
```

### Solution 3: Add Proper Error Handling

```typescript
// Enhanced test with better error handling
test("Navigate to contact page with error handling", async ({ page }) => {
  try {
    // Check if contact link exists
    const contactLink = page.locator('a:has-text("Contact")').first();

    if ((await contactLink.count()) > 0) {
      await contactLink.click();
      await page.waitForURL("**/contact", { timeout: 10000 });

      // Verify contact page loaded
      await expect(page.locator("h1, h2")).toContainText(/contact/i);
    } else {
      throw new Error("Contact link not found on page");
    }
  } catch (error) {
    console.log("Contact navigation failed:", error.message);
    // Take screenshot for debugging
    await page.screenshot({ path: "contact-navigation-failure.png" });
    throw error;
  }
});
```

### Solution 4: Fix Bagel Shop Contact Tests

The bagel shop contact tests are actually working correctly. The issue is with the external website tests.

```typescript
// The existing bagel shop test is correct:
test("Send Message through Contact page", async ({ page, context }) => {
  await page.goto("http://localhost:5173/");
  const contactPagePromise = context.waitForEvent("page");
  await page.getByRole("link", { name: "Contact" }).click();
  const contactPage = await contactPagePromise;
  // ... rest of test
});
```

### Solution 5: Environment-Specific Test Configuration

```typescript
// Create separate test configurations
const testConfig = {
  local: {
    baseURL: "http://localhost:5173",
    timeout: 10000,
  },
  production: {
    baseURL: "https://practicesoftwaretesting.com",
    timeout: 60000,
  },
};

// Use appropriate config based on environment
const config =
  process.env.TEST_ENV === "local" ? testConfig.local : testConfig.production;
```

## Recommended Actions

1. **Immediate Fix**: Update the `modifiedpref.spec.ts` file with correct selectors
2. **Network Issues**: Add retry logic and longer timeouts for external site tests
3. **Element Detection**: Use more flexible selectors that work across different page structures
4. **Error Handling**: Add proper error handling and debugging information
5. **Environment Setup**: Ensure test environment is properly configured

## Test the Fixes

Run these commands to test the fixes:

```bash
# Test bagel shop contact (should pass)
npx playwright test tests/bagel-shop/contact.spec.ts

# Test external site with fixes
npx playwright test tests/mestest/modifiedpref.spec.ts --timeout=60000
```






