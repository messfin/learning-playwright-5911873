import { test } from "@playwright/test";
import { ShoppingCartPage } from "../lib/pages/shopping-cart/shopping-cart.page";

test("test ajax test page", async ({ page }) => {
  const shoppingCartPage = new ShoppingCartPage(page);
  
  // Navigate to the shopping cart page
  await shoppingCartPage.goto();
  
  // Verify page loaded correctly
  await shoppingCartPage.verifyPageLoaded();

  // Add Skater Black Sweatshirt to cart
  await shoppingCartPage.addCroppedStayGroovyToCart();
  
  // Verify item was added to cart
  await shoppingCartPage.verifyItemAddedToCart();

  // Proceed to checkout (first attempt)
  await shoppingCartPage.proceedToCheckout();
  
  // Proceed to checkout (second attempt)
  await shoppingCartPage.proceedToCheckout();
  
  // Verify checkout button is still visible
  //await shoppingCartPage.verifyBlackBatmanImageVisible();
  await shoppingCartPage.proceedToCheckout();

 
});
