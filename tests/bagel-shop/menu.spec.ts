import { test, expect } from "@fixtures/bagel-shop.fixture";

test.describe("Menu Page", () => {
  const bagelType = "Sesame";

  test(`Add ${bagelType} Bagel To Cart`, async ({ menuPage }) => {
    await menuPage.goto();
    await menuPage.setupDialogHandlers(bagelType);
    await menuPage.addBagelToCart(bagelType);
  });
});

test.describe("Menu Page - Negative Tests", () => {
  const invalidBagelType = "everything";  
  test(`Attempt to Add Invalid Bagel Type: ${invalidBagelType}`, async ({ menuPage }) => {
    await menuPage.goto();
    await menuPage.setupDialogHandlers(invalidBagelType);
    await menuPage.addBagelToCart(invalidBagelType);
  }); 
});

