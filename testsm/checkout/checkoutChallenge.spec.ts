import { test, expect } from "@playwright/test";
import { randomState } from "@helpers/states";

test.describe("Checkout challenge", async () => {
  test.use({ storageState: ".auth/customer01.json" });

  // Set test timeout to handle slower operations
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("buy now pay later", async ({ page, headless, isMobile }) => {
    await page.getByText("Claw Hammer with Shock Reduction Grip").click();
    await page.getByTestId("add-to-cart").click();

    // Wait for cart to update after adding item
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("cart-quantity")).toHaveText("1", {
      timeout: 10000,
    });
    if (isMobile === true) {
      await page.getByLabel("Toggle navigation").click();
    }
    await page.getByTestId("nav-cart").click();
    await page.waitForLoadState("networkidle");

    await page.getByTestId("proceed-1").click();
    await page.waitForLoadState("networkidle");

    await page.getByTestId("proceed-2").click();
    await page.waitForLoadState("networkidle");
    await expect(
      page.locator(".step-indicator").filter({ hasText: "2" })
    ).toHaveCSS("background-color", "rgb(51, 153, 51)");
    await page.getByTestId("street").fill("123 Testing Way");
    await page.getByTestId("city").fill("Sacramento");
    await page.getByTestId("state").fill(randomState());
    await page.getByTestId("country").fill("USA");
    await page.getByTestId("postal_code").fill("98765");

    // Wait for form validation to complete
    await page.waitForTimeout(2000);
    await page.getByTestId("proceed-3").click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("finish")).toBeDisabled();
    await page.getByTestId("payment-method").selectOption("Buy Now Pay Later");
    await page
      .getByTestId("monthly_installments")
      .selectOption("6 Monthly Installments");
    await page.getByTestId("finish").click();
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".help-block")).toHaveText(
      "Payment was successful",
      { timeout: 15000 }
    );
    headless
      ? await test.step("visual test", async () => {
          await expect(page).toHaveScreenshot("checkout.png", {
            mask: [page.getByTitle("Practice Software Testing - Toolshop")],
          });
        })
      : console.log("Running in Headed mode, no screenshot comparison");
  });
});
