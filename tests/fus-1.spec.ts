import { test, expect } from "@fixtures/base.fixture";

test("fusionww header nav and request quote flow (POM)", async ({
  fusionHeader,
  requestQuotePage,
}) => {
  // Set test timeout for slower operations
  test.setTimeout(120000);
  // Navigate to homepage and handle cookies
  await fusionHeader.goto();
  await fusionHeader.acceptCookiesIfPresent();
  // Accept cookies if present

  // Test header navigation efficiently - only test key links
  const keyHeaderLinks = [
    fusionHeader.shopLink,
    fusionHeader.industriesLink,
    fusionHeader.aboutLink,
  ];

  // Navigate through key header links with optimized waits
  for (const link of keyHeaderLinks) {
    await link.click();
    await fusionHeader.page.waitForLoadState("domcontentloaded", {
      timeout: 2000,
    });
  }

  // Verify and click Request Quote button
  await expect(fusionHeader.requestQuoteButton).toBeVisible();
  await fusionHeader.requestQuoteButton.click();

  // Wait for request quote form to load with parallel expectations
  await Promise.all([
    expect(requestQuotePage.firstName).toBeVisible(),
    expect(requestQuotePage.email).toBeVisible(),
    expect(requestQuotePage.manufacturerPartNumber).toBeVisible(),
  ]);

  // Test form field interactions efficiently - only test key fields
  const keyFormFields = [
    requestQuotePage.firstName,
    requestQuotePage.email,
    requestQuotePage.manufacturerPartNumber,
  ];

  // Click key form fields to test focus
  for (const field of keyFormFields) {
    await field.click();
  }

  // Test Sign In functionality
  await requestQuotePage.clickSignInSafe();

  // Verify Sign In modal appeared
  const accessYourAccount = requestQuotePage.page.getByText(
    "Access Your Account"
  );
  await expect(accessYourAccount.first()).toBeVisible();

  // Close Sign In modal
  await requestQuotePage.closeModalButton.click();

  // Wait for modal to be fully closed before reopening
  await requestQuotePage.closeModalButton
    .waitFor({ state: "hidden", timeout: 5000 })
    .catch(() => {});

  // Wait a moment for the page to stabilize
  await fusionHeader.page.waitForTimeout(1000);

  // Reopen Request Quote modal to test complete flow
  // Wait for page to be stable and header to be visible
  await fusionHeader.page.waitForLoadState("networkidle");
  await fusionHeader.page.waitForTimeout(2000);

  // Try multiple approaches to find and click the Request Quote button
  try {
    await fusionHeader.requestQuoteButton.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await fusionHeader.requestQuoteButton.click();
  } catch {
    // Fallback: try to find the button with different selectors
    const requestQuoteAlternatives = [
      fusionHeader.page.getByRole("button", { name: "Request Quote" }),
      fusionHeader.page.getByText("Request Quote"),
      fusionHeader.page.locator('button:has-text("Request Quote")'),
      fusionHeader.page.locator('[data-testid*="request"]'),
      fusionHeader.page.locator('[class*="request"]'),
    ];

    for (const button of requestQuoteAlternatives) {
      try {
        if (await button.isVisible({ timeout: 2000 })) {
          await button.click();
          break;
        }
      } catch {
        // Continue to next alternative
      }
    }
  }

  // Wait for modal to be fully loaded
  await expect(requestQuotePage.firstName).toBeVisible();

  // Close the modal to complete the test
  await requestQuotePage.closeModalButton.click();
});
