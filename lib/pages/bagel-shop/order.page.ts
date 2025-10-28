import { type Locator, type Page, expect } from "@playwright/test";

export class OrderPage {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly menuLink: Locator;
  readonly orderLink: Locator;
  readonly contactLink: Locator;
  readonly orderHeading: Locator;
  readonly orderForm: Locator;
  readonly designUpload: Locator;
  readonly instructions: Locator;
  readonly quantity: Locator;
  readonly placeOrderButton: Locator;
  readonly downloadSection: Locator;
  readonly downloadReceiptButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation elements
    this.homeLink = page.getByRole("link", { name: "Home" });
    this.menuLink = page.getByRole("link", { name: "Menu" });
    this.orderLink = page.getByRole("link", { name: "Order" });
    this.contactLink = page.getByRole("link", { name: "Contact" });

    // Main content elements
    this.orderHeading = page.getByRole("heading", { name: "Place Your Order" });
    this.orderForm = page.locator("#orderForm");

    // Form elements
    this.designUpload = page.locator("#designUpload");
    this.instructions = page.locator("#instructions");
    this.quantity = page.locator("#quantity");
    this.placeOrderButton = page.getByRole("button", { name: "Place Order" });

    // Download section
    this.downloadSection = page.locator("#downloadSection");
    this.downloadReceiptButton = page.getByRole("button", {
      name: "Download Receipt",
    });
  }

  async goto() {
    await this.page.goto("http://localhost:5173/order.html");
  }

  async navigateToHome() {
    await this.homeLink.click();
  }

  async navigateToMenu() {
    await this.menuLink.click();
  }

  async navigateToContact() {
    await this.contactLink.click();
  }

  async uploadDesign(filePath: string) {
    await this.designUpload.setInputFiles(filePath);
  }

  async fillInstructions(text: string) {
    await this.instructions.fill(text);
  }

  async setQuantity(amount: number) {
    await this.quantity.fill(amount.toString());
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  async downloadReceipt() {
    const downloadPromise = this.page.waitForEvent("download");
    await this.downloadReceiptButton.click();
    return await downloadPromise;
  }

  async isDownloadSectionVisible() {
    return await this.downloadSection.isVisible();
  }

  async isOrderFormVisible() {
    return await this.orderForm.isVisible();
  }

  async getInstructionsValue() {
    return await this.instructions.inputValue();
  }

  async getQuantityValue() {
    return await this.quantity.inputValue();
  }

  async setupFileUploadDialog(fileName: string) {
    this.page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain(
        `File "${fileName}" uploaded successfully!`
      );
      await dialog.dismiss();
    });
  }

  async setupOrderDialog() {
    this.page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Order placed successfully!");
      await dialog.accept();
    });
  }
}
