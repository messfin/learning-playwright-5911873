import { test, expect } from "@fixtures/base.fixture";

test("ajax test example", async ({ shoppingCartPage }) => {
  // Navigate to the shopping cart page and verify it loads
  await shoppingCartPage.goto();
  await shoppingCartPage.verifyPageLoaded();

  // Add Cropped Stay Groovy Off White to cart
  await shoppingCartPage.addCroppedStayGroovyToCart();
  await shoppingCartPage.verifyItemAddedToCart();

  // Proceed to checkout (handles dialog)
  await shoppingCartPage.proceedToCheckout();

  // Add Basic Cactus White T-shirt to cart
  await shoppingCartPage.addBasicCactusToCart();
  await shoppingCartPage.verifyBasicCactusImageVisible();

  // Proceed to checkout (handles dialog)
  await shoppingCartPage.proceedToCheckout();

  // Add Black Batman T-shirt to cart
  await shoppingCartPage.addBlackBatmanToCart();
  await shoppingCartPage.verifyBlackBatmanImageVisible();

  // Final checkout (handles dialog)
  await shoppingCartPage.proceedToCheckout();
});
