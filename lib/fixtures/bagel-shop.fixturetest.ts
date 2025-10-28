// fixtures/bagel-shop.fixtures.ts
import { test as base } from "@playwright/test";
import { BagelShopHomePage } from "../pages/bagel-shop/bagelpom.spec";

export const test = base.extend({
  bagelShopHomePage: async ({ page }, use) => {
    const home = new BagelShopHomePage(page);
    await home.goto();
    await use(home);
  },
});
