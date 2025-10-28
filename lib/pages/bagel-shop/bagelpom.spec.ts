// pages/bagel-shop/bagel-shop-home.page.ts
import { type Locator, type Page } from "@playwright/test";
export class BagelShopHomePage {
  constructor(page) {
    this.page = page;
    this.promoBox = page.locator(".promo-box");
  }

  async goto() {
    await this.page.goto("http://localhost:5173/");
  }
}
