import { type Locator, type Page } from "@playwright/test";

export class BagelShopHomePage {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly menuLink: Locator;
  readonly orderLink: Locator;
  readonly contactLink: Locator;
  readonly welcomeHeading: Locator;
  readonly promoBox: Locator;
  readonly promoHeading: Locator;
  readonly promoDescription: Locator;
  readonly getPromoCodeButton: Locator;
  readonly reviewsSection: Locator;
  readonly reviewsHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation elements
    this.homeLink = page.getByRole("link", { name: "Home" });
    this.menuLink = page.getByRole("link", { name: "Menu" });
    this.orderLink = page.getByRole("link", { name: "Order" });
    this.contactLink = page.getByRole("link", { name: "Contact" });

    // Main content elements
    this.welcomeHeading = page.getByRole("heading", {
      name: "Welcome to The Bagel Shop",
    });
    this.promoBox = page.locator(".promo-box");
    this.promoHeading = page.getByRole("heading", { name: "Today's Special" });
    this.promoDescription = page.getByText("Buy 6 bagels, get 2 free!");
    this.getPromoCodeButton = page.getByRole("button", {
      name: "Get Promo Code",
    });

    // Reviews section
    this.reviewsSection = page.locator(".reviews-section");
    this.reviewsHeading = page.getByRole("heading", {
      name: "Customer Reviews",
    });
  }

  async goto() {
    await this.page.goto("http://localhost:5173/");
  }

  async clickGetPromoCode() {
    const popupPromise = this.page.waitForEvent("popup");
    await this.getPromoCodeButton.click();
    return await popupPromise;
  }

  async navigateToMenu() {
    await this.menuLink.click();
  }

  async navigateToOrder() {
    await this.orderLink.click();
  }

  async navigateToContact() {
    await this.contactLink.click();
  }

  async isPromoBoxVisible() {
    return await this.promoBox.isVisible();
  }

  async isReviewsSectionVisible() {
    return await this.reviewsSection.isVisible();
  }

  async getPromoDescription() {
    return await this.promoDescription.textContent();
  }
}
