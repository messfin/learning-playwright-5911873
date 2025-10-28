import { test, expect } from "@fixtures/bagel-shop.fixture";

test("Validate promo code popup", async ({ bagelShopHomePage }) => {
  await bagelShopHomePage.goto();

  const popup = await bagelShopHomePage.clickGetPromoCode();

  // Wait for the popup to load and check for the promo code text directly
  await expect(popup.getByText("The promo code is:")).toBeVisible();
  await expect(popup.getByText("B6G2")).toBeVisible();
  await popup.close();
});
