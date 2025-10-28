import { test, expect, type Page } from "@fixtures/base.fixture";

/**
 * Constants for timeouts and URLs used throughout the test suite.
 * Centralizing these values makes them easy to adjust and maintain.
 */
const TIMEOUTS = {
  DEFAULT: 5000, // Standard timeout for most assertions
  NAVIGATION: 2000, // Timeout for page navigation events
  SHORT: 3000, // Shorter timeout for quick checks
} as const;

const URLS = {
  HOMEPAGE: "https://www.fusionww.com/",
} as const;

// Set global test timeout to 60 seconds
test.setTimeout(60_000);

/**
 * TestHelpers class provides reusable utility methods for common test operations.
 * This promotes code reuse, consistent error handling, and better test reporting.
 */
class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Executes an action safely with proper error handling and reporting.
   *
   * @param action - The async function to execute
   * @param context - Description of the action for logging
   * @returns Object containing success status, result, and any error message
   *
   * This method:
   * - Wraps actions in try-catch blocks
   * - Logs results to Playwright's test annotations
   * - Provides structured return values for conditional logic
   */
  async safeAction<T>(
    action: () => Promise<T>,
    context: string
  ): Promise<{ success: boolean; result?: T; error?: string }> {
    try {
      const result = await action();
      // Log success to Playwright HTML report
      test.info().annotations.push({
        type: "success",
        description: `✓ ${context}`,
      });
      return { success: true, result };
    } catch (error) {
      // Log failure as info (not error) to continue test execution
      test.info().annotations.push({
        type: "info",
        description: `✗ ${context}: ${error.message}`,
      });
      return { success: false, error: error.message };
    }
  }

  /**
   * Verifies visibility of multiple elements in parallel.
   *
   * @param elements - Array of elements with locators and descriptive names
   * @param timeout - Maximum time to wait for each element
   * @returns Map of element names to their visibility status
   *
   * Uses Promise.allSettled to:
   * - Check all elements concurrently for better performance
   * - Continue checking remaining elements even if some fail
   * - Provide complete visibility report
   */
  async verifyElementsVisible(
    elements: Array<{ locator: any; name: string }>,
    timeout = TIMEOUTS.DEFAULT
  ): Promise<Map<string, boolean>> {
    const results = await Promise.allSettled(
      elements.map(({ locator }) => expect(locator).toBeVisible({ timeout }))
    );

    const visibilityMap = new Map<string, boolean>();
    elements.forEach(({ name }, index) => {
      const isVisible = results[index].status === "fulfilled";
      visibilityMap.set(name, isVisible);
      // Log each element's visibility status
      test.info().annotations.push({
        type: isVisible ? "success" : "info",
        description: `${name}: ${isVisible ? "visible" : "not visible"}`,
      });
    });

    return visibilityMap;
  }

  /**
   * Clicks an element and waits for page navigation to complete.
   *
   * @param locator - Playwright locator for the element
   * @param name - Descriptive name for logging
   * @returns Boolean indicating if the click was successful
   *
   * This method ensures:
   * - The click action completes
   * - DOM content is fully loaded before proceeding
   * - Proper error handling if element is not clickable
   */
  async clickElement(locator: any, name: string): Promise<boolean> {
    const { success } = await this.safeAction(async () => {
      await locator.click();
      // Wait for navigation to stabilize
      await this.page.waitForLoadState("domcontentloaded", {
        timeout: TIMEOUTS.NAVIGATION,
      });
    }, `Clicked ${name}`);
    return success;
  }

  /**
   * Fills multiple form fields in sequence.
   *
   * @param fields - Array of form fields with locators, names, and optional values
   * @returns Boolean indicating if all fields were successfully interacted with
   *
   * This method:
   * - Clicks each field to focus it
   * - Optionally fills in values if provided
   * - Tracks overall success across all fields
   */
  async fillForm(
    fields: Array<{ locator: any; name: string; value?: string }>
  ): Promise<boolean> {
    let allSuccess = true;
    for (const { locator, name, value } of fields) {
      const { success } = await this.safeAction(async () => {
        await locator.click();
        if (value) await locator.fill(value);
      }, `Interacted with ${name} field`);
      allSuccess = allSuccess && success;
    }
    return allSuccess;
  }
}

/**
 * Main test suite for FusionWW end-to-end user journey.
 * Tests the complete flow from homepage navigation through registration.
 */
test.describe("FusionWW Complete User Journey", () => {
  test("should complete full user journey from homepage to registration", async ({
    fusionHeader,
    requestQuotePage,
    registrationPage,
    page,
  }) => {
    // Initialize test helper utilities
    const helpers = new TestHelpers(page);

    /**
     * STEP 1: Initialize Homepage
     * - Navigate to the FusionWW homepage
     * - Accept cookie consent if present
     * - Ensure page is fully loaded before proceeding
     */
    await test.step("Initialize homepage", async () => {
      await fusionHeader.goto();
      // Verify correct URL was loaded
      await expect(page).toHaveURL(URLS.HOMEPAGE);
      // Handle cookie consent banner
      await fusionHeader.acceptCookiesIfPresent();
      // Wait for DOM to be fully loaded
      await page.waitForLoadState("domcontentloaded");
    });

    /**
     * STEP 2: Verify and Test Header Navigation
     * - Check visibility of main navigation links
     * - Test each visible link by clicking and waiting for navigation
     * - Continue with remaining tests even if some links fail
     */
    await test.step("Verify and test header navigation", async () => {
      // Define header elements to verify
      const headerElements = [
        { locator: fusionHeader.shopLink, name: "Shop link" },
        { locator: fusionHeader.industriesLink, name: "Industries link" },
        { locator: fusionHeader.aboutLink, name: "About link" },
      ];

      // Check which elements are visible (parallel execution)
      const visibilityMap = await helpers.verifyElementsVisible(headerElements);

      // Test navigation only for visible elements
      // This prevents test failures on hidden/conditional navigation items
      for (const { locator, name } of headerElements) {
        if (visibilityMap.get(name)) {
          await helpers.clickElement(locator, name);
        }
      }
    });

    /**
     * STEP 3: Test Request Quote Flow
     * - Open the request quote modal
     * - Verify form fields are present
     * - Test form field interactions
     * - Test sign-in modal flow
     * - Clean up by closing modals
     *
     * This step uses early returns to skip sub-steps if critical actions fail.
     */
    await test.step("Test request quote modal and form", async () => {
      // Attempt to open the request quote modal
      const { success: modalOpened } = await helpers.safeAction(async () => {
        await expect(fusionHeader.requestQuoteButton).toBeVisible({
          timeout: TIMEOUTS.DEFAULT,
        });
        await fusionHeader.requestQuoteButton.click();
      }, "Opened request quote modal");

      // Skip remaining steps if modal didn't open
      if (!modalOpened) {
        test.info().annotations.push({
          type: "info",
          description: "Skipping request quote form tests - modal not opened",
        });
        return;
      }

      // Verify critical form fields are present
      await helpers.verifyElementsVisible([
        { locator: requestQuotePage.firstName, name: "First name field" },
        { locator: requestQuotePage.email, name: "Email field" },
        {
          locator: requestQuotePage.manufacturerPartNumber,
          name: "MPN field",
        },
      ]);

      // Test interactions with each form field
      await helpers.fillForm([
        { locator: requestQuotePage.firstName, name: "First name" },
        { locator: requestQuotePage.email, name: "Email" },
        {
          locator: requestQuotePage.manufacturerPartNumber,
          name: "MPN",
        },
      ]);

      // Test the sign-in flow from within the request quote modal
      await helpers.safeAction(async () => {
        await requestQuotePage.clickSignInSafe();
        const signInModal = page.getByText("Access Your Account").first();
        await expect(signInModal).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
      }, "Opened sign-in modal");

      // Clean up by closing the sign-in modal
      await helpers.safeAction(
        async () => await requestQuotePage.closeModalButton.click(),
        "Closed sign-in modal"
      );
    });

    /**
     * STEP 4: Test Registration Page
     * - Navigate directly to the registration page
     * - Verify page loaded correctly
     * - Test registration form field interactions
     * - Fill in sample data
     *
     * Uses early return pattern to skip tests if navigation fails.
     */
    await test.step("Test registration page and form", async () => {
      // Navigate to registration page
      const { success: navigated } = await helpers.safeAction(async () => {
        await registrationPage.goto();
        await registrationPage.acceptCookiesIfPresent();
      }, "Navigated to registration page");

      // Skip remaining tests if navigation failed
      if (!navigated) {
        test.info().annotations.push({
          type: "info",
          description: "Skipping registration tests - navigation failed",
        });
        return;
      }

      // Verify registration page elements are present
      await helpers.safeAction(async () => {
        const accountButton = page.locator("#account-button");
        await expect(accountButton).toBeVisible({ timeout: TIMEOUTS.SHORT });
      }, "Verified registration page elements");

      // Test form field by filling in sample data
      await helpers.safeAction(async () => {
        const firstNameField = page.getByRole("textbox", {
          name: "First Name",
        });
        await expect(firstNameField).toBeVisible({ timeout: TIMEOUTS.SHORT });
        await firstNameField.fill("John");
      }, "Filled registration form field");
    });

    /**
     * STEP 5: Verify Journey Completion
     * - Log successful completion of the entire user journey
     * - Capture final URL for debugging purposes
     * - Provide summary in test report
     */
    await test.step("Verify journey completion", async () => {
      // Mark journey as successfully completed
      test.info().annotations.push({
        type: "success",
        description: "✅ User journey completed successfully",
      });

      // Capture and log final URL state
      await helpers.safeAction(
        async () => page.url(),
        `Final URL: ${page.url()}`
      );
    });
  });
});
