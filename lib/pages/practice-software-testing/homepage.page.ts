import { type Locator, type Page } from "@playwright/test";

export class PracticeSoftwareTestingHomepage {
  readonly page: Page;

  // Main page elements
  readonly categoriesText: Locator;
  readonly bugHuntingButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main page elements
    this.categoriesText = page.getByText(
      "Categories Hand Tools Categories Hammer Hand Saw Wrench Screwdriver Pliers"
    );
    this.bugHuntingButton = page.getByRole("button", {
      name: "🐛 Bug Hunting",
    });
  }

  async goto() {
    await this.page.goto("https://practicesoftwaretesting.com/");
  }

  async verifyCategoriesVisible() {
    await this.categoriesText.waitFor({ state: "visible", timeout: 10000 });
  }

  async clickBugHuntingButton() {
    await this.bugHuntingButton.click();
  }

  async waitForBugHuntingPopup() {
    return await this.page.waitForEvent("popup");
  }
}

