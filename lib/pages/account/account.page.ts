import { type Locator, type Page } from "@playwright/test";

export class AccountPage {
  readonly page: Page;
  readonly navMenu: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    // Support both data-testid and data-test attributes for robustness
    this.navMenu = page.locator('[data-testid="nav-menu"], [data-test="nav-menu"]');
    this.pageTitle = page.getByTestId("page-title");
  }

  async goto() {
    await this.page.goto("/account");
  }
}
