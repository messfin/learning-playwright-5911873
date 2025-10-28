import { type Locator, type Page } from "@playwright/test";

export class BugHuntingPage {
  page: Page;

  // Navigation elements
  readonly mainMenuBar: Locator;
  readonly productDiscoveryHuntLink: Locator;
  readonly closeBugHuntingButton: Locator;
  readonly navSignInButton: Locator;

  // Mission elements
  readonly missionHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation elements
    this.mainMenuBar = page.getByRole("menubar", { name: "Main menu" });
    this.productDiscoveryHuntLink = page
      .locator(".category-card")
      .filter({ hasText: "Product Discovery Hunt" });
    this.closeBugHuntingButton = page.getByRole("button", {
      name: "✕ Close Bug Hunting",
    });
    this.navSignInButton = page.locator('[data-test="nav-sign-in"]');

    // Mission elements
    this.missionHeading = page.getByText("🎯 Your Mission");
  }

  async verifyMainMenuVisible() {
    await this.mainMenuBar.waitFor({ state: "visible", timeout: 10000 });
  }

  async clickProductDiscoveryHunt() {
    // Click on the first element (category title)
    await this.page.getByText("Product Discovery Hunt").first().click();
  }

  async verifyMissionHeadingVisible() {
    await this.missionHeading.waitFor({ state: "visible", timeout: 10000 });
  }

  async closeBugHunting() {
    await this.closeBugHuntingButton.click();
  }

  async clickSignIn() {
    await this.navSignInButton.click();
  }
}
