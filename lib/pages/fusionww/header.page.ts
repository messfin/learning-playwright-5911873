import { type Locator, type Page } from "@playwright/test";

export class FusionHeader {
  readonly page: Page;
  readonly acceptAllButton: Locator;
  readonly shopLink: Locator;
  readonly industriesLink: Locator;
  readonly qualityLink: Locator;
  readonly aboutLink: Locator;
  readonly insightsLink: Locator;
  readonly requestQuoteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.acceptAllButton = page.getByRole("button", { name: "Accept all" });
    this.shopLink = page.getByRole("link", { name: "Shop", exact: true });
    this.industriesLink = page.getByText("Industries", { exact: true });
    this.qualityLink = page.getByText("Quality", { exact: true });
    this.aboutLink = page.getByText("About", { exact: true });
    this.insightsLink = page.getByRole("link", { name: "Insights" });
    this.requestQuoteButton = page
      .locator("#global-header")
      .getByRole("button", { name: "Request Quote" });
  }

  async goto() {
    await this.page.goto("https://www.fusionww.com/");
  }

  async acceptCookiesIfPresent() {
    const candidates: Locator[] = [
      this.acceptAllButton,
      this.page.getByRole("button", { name: /Accept All Cookies/i }),
      this.page.getByRole("button", { name: /Accept Cookies/i }),
      this.page.getByRole("button", { name: /Accept/i }),
      this.page.locator("#hs-eu-confirmation-button"),
      this.page.locator("#onetrust-accept-btn-handler"),
      this.page.locator('[data-testid*="accept"]'),
      this.page.locator('[id*="accept"]'),
      this.page.locator('[class*="accept"]'),
      this.page.getByText(/Accept All/i),
      this.page.getByText(/Accept Cookies/i),
      this.page.getByText(/I Accept/i),
      this.page.getByText(/Agree/i),
    ];

    for (const locator of candidates) {
      try {
        if (await locator.isVisible({ timeout: 1000 })) {
          await locator.click({ trial: false });
          console.log("Cookie banner accepted successfully");
          break;
        }
      } catch {
        // ignore and try next candidate
      }
    }

    // Wait briefly for the banner container to be gone to avoid intercepting clicks
    const bannerSelectors = [
      "#hs-banner-parent",
      "#hs-eu-cookie-confirmation",
      "#hs-eu-cookie-confirmation-buttons-area",
      "#onetrust-banner-sdk",
      "#onetrust-consent-sdk",
    ];

    for (const selector of bannerSelectors) {
      try {
        const banner = this.page.locator(selector);
        await banner.waitFor({ state: "hidden", timeout: 2000 });
      } catch {
        // ignore if it doesn't exist
      }
    }

    // More targeted cleanup - only hide specific cookie banner elements
    await this.page.evaluate(() => {
      const ids = [
        "hs-banner-parent",
        "hs-eu-cookie-confirmation",
        "hs-eu-cookie-confirmation-buttons-area",
        "onetrust-banner-sdk",
        "onetrust-consent-sdk",
      ];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          el.setAttribute("aria-hidden", "true");
          (el as HTMLElement).style.pointerEvents = "none";
          (el as HTMLElement).style.display = "none";
        }
      }
    });
  }
}
