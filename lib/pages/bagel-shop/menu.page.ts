import { type Locator, type Page } from "@playwright/test";

export class MenuPage {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly menuLink: Locator;
  readonly orderLink: Locator;
  readonly contactLink: Locator;
  readonly menuHeading: Locator;
  readonly menuTable: Locator;
  readonly plainBagelRow: Locator;
  readonly everythingBagelRow: Locator;
  readonly sesameBagelRow: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation elements
    this.homeLink = page.getByRole("link", { name: "Home" });
    this.menuLink = page.getByRole("link", { name: "Menu" });
    this.orderLink = page.getByRole("link", { name: "Order" });
    this.contactLink = page.getByRole("link", { name: "Contact" });

    // Main content elements
    this.menuHeading = page.getByRole("heading", { name: "Our Menu" });
    this.menuTable = page.locator("#menuTable");

    // Bagel rows
    this.plainBagelRow = page.getByRole("row", { name: /Plain/ });
    this.everythingBagelRow = page.getByRole("row", { name: /Everything/ });
    this.sesameBagelRow = page.getByRole("row", { name: /Sesame/ });
  }

  async goto() {
    await this.page.goto("http://localhost:5173/menu.html");
  }

  async navigateToHome() {
    await this.homeLink.click();
  }

  async navigateToOrder() {
    await this.orderLink.click();
  }

  async navigateToContact() {
    await this.contactLink.click();
  }

  async addBagelToCart(bagelType: string) {
    const bagelRow = this.getBagelRow(bagelType);
    const addToCartButton = bagelRow.getByRole("button", {
      name: "Add to Cart",
    });
    await addToCartButton.click();
  }

  private getBagelRow(bagelType: string): Locator {
    switch (bagelType.toLowerCase()) {
      case "plain":
        return this.plainBagelRow;
      case "everything":
        return this.everythingBagelRow;
      case "sesame":
        return this.sesameBagelRow;
      default:
        return this.page
          .getByRole("cell", { name: new RegExp(`^${bagelType}`) })
          .locator("..");
    }
  }

  async getBagelPrice(bagelType: string): Promise<string | null> {
    const bagelRow = this.getBagelRow(bagelType);
    const priceCell = bagelRow.getByRole("cell").nth(2); // Price is in the 3rd column
    return await priceCell.textContent();
  }

  async getBagelDescription(bagelType: string): Promise<string | null> {
    const bagelRow = this.getBagelRow(bagelType);
    const descriptionCell = bagelRow.getByRole("cell").nth(1); // Description is in the 2nd column
    return await descriptionCell.textContent();
  }

  async isMenuTableVisible() {
    return await this.menuTable.isVisible();
  }

  async getMenuTableRows() {
    return await this.menuTable.getByRole("row").count();
  }

  async setupDialogHandlers(bagelType: string) {
    this.page.on("dialog", async (dialog) => {
      console.log(`Dialog: ${dialog.message()}`);

      if (dialog.type() === "confirm") {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }
}
