import { test, expect } from "@fixtures/pages.fixture";
import { randomState } from "@helpers/states";

// increase overall test timeout and expect timeout
test.setTimeout(120000);

test.describe("Checkout challenge", () => {
  test.use({ storageState: ".auth/customer01.json" });

  test.beforeEach(async ({ page }) => {
    // wait for network to be idle to reduce flakiness/timeouts
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("buy now pay later", async ({
    practiceShoppingCartPage,
    page,
    headless,
    isMobile,
  }) => {
    // Add product to cart
    await practiceShoppingCartPage.addClawHammerToCart();
    await practiceShoppingCartPage.verifyCartQuantity("1");

    // Navigate to cart (handle mobile navigation)
    if (isMobile === true) {
      await page.getByLabel("Toggle navigation").click();
    }
    await practiceShoppingCartPage.navigateToCart();

    // Proceed through checkout steps
    await practiceShoppingCartPage.proceedToStep1();
    await practiceShoppingCartPage.proceedToStep2();
    await practiceShoppingCartPage.verifyStep2Active();

    // Fill billing address with proper validation
    const address = {
      street: "123 Testing Way",
      city: "Sacramento",
      state: randomState(),
      country: "USA",
      postalCode: "98765",
    };
    await practiceShoppingCartPage.fillBillingAddress(address);

    // Wait for form validation and proceed to step 3
    await practiceShoppingCartPage.waitForProceed3ToBeEnabled();
    await practiceShoppingCartPage.proceedToStep3();

    // Configure payment method
    await practiceShoppingCartPage.verifyFinishButtonDisabled();
    await practiceShoppingCartPage.selectPaymentMethod("Buy Now Pay Later");
    await practiceShoppingCartPage.selectMonthlyInstallments(
      "6 Monthly Installments"
    );

    // Complete purchase
    await practiceShoppingCartPage.completePurchase();
    await practiceShoppingCartPage.verifyPaymentSuccess();

    // Visual regression test (only in headless mode)
    if (headless) {
      await test.step("visual test", async () => {
        await expect(page).toHaveScreenshot("checkout.png", {
          // allow more time for screenshot comparison in slower environments
          timeout: 30000,
          mask: [page.getByTitle("Practice Software Testing - Toolshop")],
        });
      });
    } else {
      console.log("Running in Headed mode, no screenshot comparison");
    }
  });
});
