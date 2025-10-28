import { test, expect } from "@fixtures/bagel-shop.fixture";
import { PromoCodePopupPage } from "@pages/bagel-shop/promo-code-popup.page";

test("test popup", async ({ bagelShopHomePage }) => {
  // Navigate to the bagel shop homepage
  await bagelShopHomePage.goto();

  // Verify home link is visible
  await expect(bagelShopHomePage.homeLink).toBeVisible();

  // Click Get Promo Code button and handle popup
  const popup = await bagelShopHomePage.clickGetPromoCode();

  // Create PromoCodePopupPage instance for the popup
  const promoCodePopupPage = new PromoCodePopupPage(popup);

  // Wait for popup to load and verify content
  await promoCodePopupPage.waitForPopupToLoad();
  await expect(promoCodePopupPage.promoCodeHeading).toContainText("Promo Code");

  // Close the popup
  await promoCodePopupPage.closePopup();
});
