import { test as base } from "@playwright/test";
import { BagelShopHomePage } from "@pages/bagel-shop/bagel-shop-home.page";
import { PromoCodePopupPage } from "@pages/bagel-shop/promo-code-popup.page";
import { MenuPage } from "@pages/bagel-shop/menu.page";
import { OrderPage } from "@pages/bagel-shop/order.page";
import { ContactPage } from "@pages/bagel-shop/contact.page";

export interface BagelShopFixtures {
  bagelShopHomePage: BagelShopHomePage;
  promoCodePopupPage: PromoCodePopupPage;
  menuPage: MenuPage;
  orderPage: OrderPage;
  contactPage: ContactPage;
}

export const test = base.extend<BagelShopFixtures>({
  bagelShopHomePage: async ({ page }, use) => {
    const bagelShopHomePage = new BagelShopHomePage(page);
    await use(bagelShopHomePage);
  },

  promoCodePopupPage: async ({ page }, use) => {
    const promoCodePopupPage = new PromoCodePopupPage(page);
    await use(promoCodePopupPage);
  },

  menuPage: async ({ page }, use) => {
    const menuPage = new MenuPage(page);
    await use(menuPage);
  },

  orderPage: async ({ page }, use) => {
    const orderPage = new OrderPage(page);
    await use(orderPage);
  },

  contactPage: async ({ page }, use) => {
    const contactPage = new ContactPage(page);
    await use(contactPage);
  },
});

export { expect } from "@playwright/test";
