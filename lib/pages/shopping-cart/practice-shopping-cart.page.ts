import { type Locator, type Page, expect } from "@playwright/test";

export class PracticeShoppingCartPage {
  readonly page: Page;

  // Navigation elements
  readonly navCart: Locator;
  readonly cartQuantity: Locator;

  // Product elements
  readonly clawHammerProduct: Locator;
  readonly addToCartButton: Locator;

  // Checkout process elements
  readonly proceed1Button: Locator;
  readonly proceed2Button: Locator;
  readonly proceed3Button: Locator;
  readonly finishButton: Locator;

  // Step indicator
  readonly stepIndicator2: Locator;

  // Billing address form
  readonly streetField: Locator;
  readonly cityField: Locator;
  readonly stateField: Locator;
  readonly countryField: Locator;
  readonly postalCodeField: Locator;

  // Payment elements
  readonly paymentMethodSelect: Locator;
  readonly monthlyInstallmentsSelect: Locator;
  readonly helpBlock: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.navCart = page.getByTestId("nav-cart");
    this.cartQuantity = page.getByTestId("cart-quantity");

    // Product
    this.clawHammerProduct = page.getByText(
      "Claw Hammer with Shock Reduction Grip"
    );
    this.addToCartButton = page.getByTestId("add-to-cart");

    // Checkout buttons
    this.proceed1Button = page.getByTestId("proceed-1");
    this.proceed2Button = page.getByTestId("proceed-2");
    this.proceed3Button = page.getByTestId("proceed-3");
    this.finishButton = page.getByTestId("finish");

    // Step indicator
    this.stepIndicator2 = page
      .locator(".step-indicator")
      .filter({ hasText: "2" });

    // Billing address fields
    this.streetField = page.getByTestId("street");
    this.cityField = page.getByTestId("city");
    this.stateField = page.getByTestId("state");
    this.countryField = page.getByTestId("country");
    this.postalCodeField = page.getByTestId("postal_code");

    // Payment elements
    this.paymentMethodSelect = page.getByTestId("payment-method");
    this.monthlyInstallmentsSelect = page.getByTestId("monthly_installments");
    this.helpBlock = page.locator(".help-block");
  }

  async goto() {
    await this.page.goto("https://practicesoftwaretesting.com");
  }

  async addClawHammerToCart() {
    // Navigate to homepage first
    await this.page.goto("https://practicesoftwaretesting.com");

    // Wait for the page to load
    await this.page.waitForLoadState("networkidle");

    // Search for the claw hammer product
    await this.page
      .getByTestId("search-query")
      .fill("Claw Hammer with Shock Reduction Grip");
    await this.page.getByTestId("search-submit").click();

    // Wait for search results
    await this.page.waitForLoadState("networkidle");

    // Click on the claw hammer product link (use the product name, not search term)
    await this.page
      .getByTestId("product-name")
      .filter({ hasText: "Claw Hammer with Shock Reduction Grip" })
      .click();

    // Wait for the product page to load and the add to cart button to be visible
    await this.addToCartButton.waitFor({ state: "visible", timeout: 10000 });
    await this.addToCartButton.click();

    // Wait for the cart quantity to update
    await this.page.waitForTimeout(1000);
  }

  async verifyCartQuantity(expectedQuantity: string) {
    // Wait for the cart quantity element to be visible and have the expected text
    await expect(this.cartQuantity).toBeVisible({ timeout: 10000 });
    await expect(this.cartQuantity).toHaveText(expectedQuantity, {
      timeout: 5000,
    });
  }

  async navigateToCart() {
    await this.navCart.click();
  }

  async proceedToStep1() {
    await expect(this.proceed1Button).toBeVisible({ timeout: 15000 });
    await expect(this.proceed1Button).toBeEnabled();
    await Promise.all([
      this.page.waitForLoadState("networkidle"),
      this.proceed1Button.click(),
    ]);
  }

  async proceedToStep2() {
    await expect(this.proceed2Button).toBeVisible({ timeout: 15000 });
    await expect(this.proceed2Button).toBeEnabled();
    await Promise.all([
      this.page.waitForLoadState("networkidle"),
      this.proceed2Button.click(),
    ]);
  }

  async verifyStep2Active() {
    await expect(this.stepIndicator2).toHaveCSS(
      "background-color",
      "rgb(51, 153, 51)"
    );
  }

  async verifyBillingAddressVisible() {
    await expect(this.streetField).toBeVisible();
  }

  async fillBillingAddress(address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }) {
    // Clear all fields first
    await this.streetField.clear();
    await this.cityField.clear();
    await this.stateField.clear();
    await this.countryField.clear();
    await this.postalCodeField.clear();

    // Wait a moment for clearing to complete
    await this.page.waitForTimeout(500);

    // Fill the fields
    await this.streetField.fill(address.street);
    await this.cityField.fill(address.city, { timeout: 10000 });
    await this.stateField.fill(address.state);
    await this.countryField.fill(address.country);
    await this.postalCodeField.fill(address.postalCode);

    // Wait for form validation to complete
    await this.page.waitForTimeout(2000);
  }

  async proceedToStep3() {
    // Wait for the proceed button to be enabled before clicking
    await expect(this.proceed3Button).toBeEnabled({ timeout: 10000 });
    await this.proceed3Button.click();
  }

  async waitForProceed3ToBeEnabled() {
    // Wait for the proceed button to be enabled
    await expect(this.proceed3Button).toBeEnabled({ timeout: 15000 });
  }

  async verifyFinishButtonDisabled() {
    await expect(this.finishButton).toBeDisabled();
  }

  async selectPaymentMethod(method: string) {
    await this.paymentMethodSelect.selectOption(method);
  }

  async selectMonthlyInstallments(installments: string) {
    await this.monthlyInstallmentsSelect.selectOption(installments);
  }

  async completePurchase() {
    await this.finishButton.click();
  }

  async verifyPaymentSuccess() {
    await expect(this.helpBlock).toHaveText("Payment was successful");
  }

  // Complete checkout workflow
  async completeBuyNowPayLaterCheckout(address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }) {
    // Add product to cart
    await this.addClawHammerToCart();
    await this.verifyCartQuantity("1");

    // Navigate to cart and proceed
    await this.navigateToCart();
    await this.proceedToStep1();
    await this.proceedToStep2();

    // Verify step 2 is active
    await this.verifyStep2Active();
    await this.verifyBillingAddressVisible();

    // Fill billing address
    await this.fillBillingAddress(address);

    // Wait for form validation to complete and proceed button to be enabled
    await this.waitForProceed3ToBeEnabled();
    await this.proceedToStep3();

    // Configure payment
    await this.verifyFinishButtonDisabled();
    await this.selectPaymentMethod("Buy Now Pay Later");
    await this.selectMonthlyInstallments("6 Monthly Installments");

    // Complete purchase
    await this.completePurchase();
    await this.verifyPaymentSuccess();
  }
}
