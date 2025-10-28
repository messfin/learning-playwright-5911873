import { type Locator, type Page, expect } from "@playwright/test";

export class ShoppingCartPage {
  readonly page: Page;
  readonly logo: Locator;
  readonly cartCloseButton: Locator;
  readonly checkoutButton: Locator;

  // Product locators
  readonly croppedStayGroovyOffWhite: Locator;
  readonly croppedStayGroovyAddToCartButton: Locator;
  readonly croppedStayGroovyImage: Locator;

  readonly basicCactusWhiteTshirt: Locator;
  readonly basicCactusAddToCartButton: Locator;
  readonly basicCactusImage: Locator;

  readonly blackBatmanTshirt: Locator;
  readonly blackBatmanAddToCartButton: Locator;
  readonly blackBatmanImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByRole("img", { name: "Jeremy Akeze - Doghouse IT" });
    this.cartCloseButton = page.getByRole("button", { name: "X" });
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });

    // Cropped Stay Groovy Off White product
    this.croppedStayGroovyOffWhite = page.getByText(
      "Cropped Stay Groovy off white"
    );
    this.croppedStayGroovyAddToCartButton = page
      .locator("div")
      .filter({
        hasText:
          /^Free shippingCropped Stay Groovy off white\$10\.90or 9 x\$1\.21Add to cart$/,
      })
      .getByRole("button");

    // Basic Cactus White T-shirt product
    this.basicCactusWhiteTshirt = page
      .locator("div")
      .filter({
        hasText:
          /^Free shippingBasic Cactus White T-shirt\$13\.25or 3 x\$4\.42Add to cart$/,
      })
      .getByRole("button");
    this.basicCactusAddToCartButton = this.basicCactusWhiteTshirt;
    this.basicCactusImage = page.getByRole("img", {
      name: "Basic Cactus White T-shirt",
    });

    // Black Batman T-shirt product
    this.blackBatmanTshirt = page
      .locator("div")
      .filter({
        hasText:
          /^Free shippingBlack Batman T-shirt\$10\.90or 9 x\$1\.21Add to cart$/,
      })
      .locator("div")
      .nth(1);
    this.blackBatmanAddToCartButton = page
      .locator("div")
      .filter({
        hasText:
          /^Free shippingBlack Batman T-shirt\$10\.90or 9 x\$1\.21Add to cart$/,
      })
      .getByRole("button");
    this.blackBatmanImage = page.getByRole("img", {
      name: "Black Batman T-shirt",
    });
  }

  async goto() {
    await this.page.goto("https://react-shopping-cart-67954.firebaseapp.com/");
  }

  async verifyPageLoaded() {
    await expect(this.logo).toBeVisible();
  }

  async verifyItemAddedToCart() {
    await expect(this.cartCloseButton).toBeVisible();
  }

  async handleDialog() {
    this.page.once("dialog", (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
  }

  async proceedToCheckout() {
    await this.handleDialog();
    await this.checkoutButton.click();
  }

  // Cropped Stay Groovy Off White product methods
  async addCroppedStayGroovyToCart() {
    await this.croppedStayGroovyOffWhite.click();
    await this.croppedStayGroovyAddToCartButton.click();
  }

  // Basic Cactus White T-shirt product methods
  async addBasicCactusToCart() {
    await this.basicCactusAddToCartButton.click();
  }

  async verifyBasicCactusImageVisible() {
    await expect(this.basicCactusImage).toBeVisible();
  }

  // Black Batman T-shirt product methods
  async addBlackBatmanToCart() {
    await this.blackBatmanTshirt.click();
    await this.blackBatmanAddToCartButton.click();
  }

  async verifyBlackBatmanImageVisible() {
    await expect(this.blackBatmanImage).toBeVisible();
  }
}
