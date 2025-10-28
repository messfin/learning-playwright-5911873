import { type Locator, type Page } from "@playwright/test";

export class PromoCodePopupPage {
  readonly page: Page;
  readonly promoCodeHeading: Locator;
  readonly promoCodeText: Locator;
  readonly promoCodeValue: Locator;

  constructor(page: Page) {
    this.page = page;
    this.promoCodeHeading = page.getByRole("heading", { name: "Promo Code" });
    this.promoCodeText = page.getByText("The promo code is:");
    this.promoCodeValue = page.getByText("B6G2");
  }

  async waitForPopupToLoad() {
    await this.promoCodeHeading.waitFor({ state: "visible", timeout: 10000 });
  }

  async getPromoCodeValue() {
    return await this.promoCodeValue.textContent();
  }

  async isPromoCodeVisible() {
    return await this.promoCodeText.isVisible();
  }

  async closePopup() {
    await this.page.close();
  }
}
