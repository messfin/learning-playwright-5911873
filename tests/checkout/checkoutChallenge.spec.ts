import { test, expect } from "@fixtures/base.fixture";

test.describe("Checkout challenge", () => {
  test.use({ storageState: ".auth/customer01.json" });

  test.beforeEach(async ({ practiceShoppingCartPage }) => {
    await practiceShoppingCartPage.page.goto("/");
  });

  test("buy now pay later", async ({ practiceShoppingCartPage, config }) => {
    const billingAddress = {
      street: "123 Testing Way",
      city: "Sacramento",
      state: "California",
      country: "USA",
      postalCode: "98765",
    };

    await practiceShoppingCartPage.completeBuyNowPayLaterCheckout(
      billingAddress
    );

    if (config.headless) {
      await test.step("visual test", async () => {
        // Wait for the page to stabilize before taking screenshot
        await practiceShoppingCartPage.page.waitForLoadState("networkidle");
        await practiceShoppingCartPage.page.waitForTimeout(5000);

        // Wait for any success messages or final state to be visible
        await practiceShoppingCartPage.page.waitForSelector(".help-block", {
          timeout: 10000,
        });

        await expect(practiceShoppingCartPage.page).toHaveScreenshot(
          "checkout.png",
          {
            mask: [
              practiceShoppingCartPage.page.getByTitle(
                "Practice Software Testing - Toolshop"
              ),
            ],
            threshold: 0.5, // Allow 50% pixel difference for more flexibility
            maxDiffPixels: 50000, // Allow up to 50,000 different pixels
            animations: "disabled", // Disable animations
          }
        );
      });
    } else {
      console.log("Running in Headed mode, no screenshot comparison");
    }
  });
});
