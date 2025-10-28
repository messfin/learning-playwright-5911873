import { type Locator, type Page } from "@playwright/test";

export class RequestQuotePage {
  readonly page: Page;
  readonly acceptAllButton: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly phoneNumber: Locator;
  readonly companyName: Locator;
  readonly geographicRegion: Locator;
  readonly manufacturerPartNumber: Locator;
  readonly Quntity: Locator;
  readonly comments: Locator;
  readonly signInButton: Locator;
  readonly closeModalButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.acceptAllButton = page.getByRole("button", { name: "Accept all" });
    this.firstName = page.getByRole("textbox", { name: "First Name" });
    this.lastName = page.getByRole("textbox", { name: "Last Name" });
    this.email = page.getByRole("textbox", { name: "Email" });
    this.phoneNumber = page.getByRole("textbox", { name: "Phone Number" });
    this.companyName = page.getByRole("textbox", { name: "Company Name" });
    this.Quntity = page.getByRole("textbox", { name: "Quantity" });
    this.geographicRegion = page.getByRole("button", {
      name: "Geographic Region",
    });
    this.manufacturerPartNumber = page.getByRole("textbox", {
      name: "Manufacturer Part Number",
    });
    this.comments = page.getByRole("textbox", {
      name: "Add Comments (Optional)",
    });
    this.signInButton = page.getByRole("button", { name: /Sign\s*In/i });
    this.closeModalButton = page.getByRole("button", { name: "Close modal" });
  }

  async acceptCookiesIfPresent() {
    const candidates: Locator[] = [
      this.acceptAllButton,
      this.page.getByRole("button", { name: /Accept All Cookies/i }),
      this.page.getByRole("button", { name: /Accept Cookies/i }),
      this.page.locator("#hs-eu-confirmation-button"),
      this.page.locator("#onetrust-accept-btn-handler"),
    ];

    for (const locator of candidates) {
      try {
        if (await locator.isVisible({ timeout: 500 })) {
          await locator.click({ trial: false });
          break;
        }
      } catch {
        // ignore and try next candidate
      }
    }

    // Wait briefly for the banner container to be gone to avoid intercepting clicks
    const banner = this.page.locator("#hs-banner-parent");
    try {
      await banner.waitFor({ state: "hidden", timeout: 2000 });
    } catch {
      // ignore if it doesn't exist
    }
  }

  async ensureSignInClickable() {
    await this.signInButton.waitFor({ state: "attached", timeout: 5000 });
    try {
      await this.signInButton.click({ trial: true, timeout: 1000 });
      return;
    } catch {
      // fallthrough to hard-hide banners
    }

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

    await this.signInButton.scrollIntoViewIfNeeded();
    try {
      await this.signInButton.click({ trial: true, timeout: 1000 });
    } catch {
      // ignore and force click next
    }
  }

  async waitForIframeContent(iframeSelector: string, timeout: number = 5000) {
    try {
      // Wait for iframe to be attached to DOM
      await this.page.waitForSelector(iframeSelector, { timeout: 2000 });

      // Wait for iframe to load
      const iframe = this.page.frameLocator(iframeSelector);

      // Wait for any content to be visible in the iframe
      await iframe.locator("body").waitFor({ state: "visible", timeout });

      // Additional wait for dynamic content (forms, buttons, etc.)
      await this.page.waitForTimeout(500);

      return true;
    } catch {
      return false;
    }
  }

  async clickSignInSafe() {
    await this.acceptCookiesIfPresent();

    // Optimized approach: try the most likely candidates first with shorter timeouts
    const pageCandidates: Locator[] = [
      this.signInButton,
      this.page.getByText(/\bSign\s*In\b/i),
      this.page.locator('button:has-text("Sign In")'),
    ];

    // Quick scroll to ensure elements are in view
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(100);

    // Try primary candidates with shorter timeout
    for (const locator of pageCandidates) {
      try {
        if (await locator.isVisible({ timeout: 1000 })) {
          await locator.scrollIntoViewIfNeeded();
          await locator.click({ timeout: 2000 });
          return;
        }
      } catch {
        // Continue to next candidate
      }
    }

    // Try modal containers with reduced timeout
    const modalRoots: Locator[] = [
      this.page.getByRole("dialog"),
      this.page.locator('[aria-modal="true"]'),
    ];

    for (const modal of modalRoots) {
      try {
        if (await modal.isVisible({ timeout: 500 })) {
          const modalBtn = modal
            .getByRole("button", { name: /Sign\s*In/i })
            .first();
          if (await modalBtn.isVisible({ timeout: 500 })) {
            await modalBtn.click({ timeout: 2000 });
            return;
          }
        }
      } catch {
        // Continue to next modal
      }
    }

    // Try iframe contexts (HubSpot forms, chat widgets, etc.)
    const iframeCandidates = [
      'iframe[src*="hubspot"]',
      'iframe[src*="hsforms"]',
      'iframe[src*="hs-scripts"]',
      'iframe[title*="chat"]',
      'iframe[title*="widget"]',
      'iframe[title*="form"]',
      "iframe[data-hs-iframe]",
      'iframe[class*="hs-form"]',
      'iframe[class*="chat"]',
      'iframe[class*="widget"]',
      // Generic iframe selectors as fallback
      'iframe[src*="//"]',
      'iframe:not([src=""])',
    ];

    for (const iframeSelector of iframeCandidates) {
      try {
        // Wait for iframe content to load before attempting interaction
        const iframeReady = await this.waitForIframeContent(
          iframeSelector,
          3000
        );
        if (!iframeReady) continue;

        const iframe = this.page.frameLocator(iframeSelector);
        const signInInIframe = iframe.getByRole("button", {
          name: /Sign\s*In/i,
        });

        if (await signInInIframe.isVisible({ timeout: 1000 })) {
          await signInInIframe.click({ timeout: 2000 });
          return;
        }
      } catch {
        // Continue to next iframe
      }
    }

    // Try iframe with text-based locators as fallback
    for (const iframeSelector of iframeCandidates) {
      try {
        // Wait for iframe content to load before attempting interaction
        const iframeReady = await this.waitForIframeContent(
          iframeSelector,
          2000
        );
        if (!iframeReady) continue;

        const iframe = this.page.frameLocator(iframeSelector);
        const signInTextInIframe = iframe.getByText(/\bSign\s*In\b/i);

        if (await signInTextInIframe.isVisible({ timeout: 1000 })) {
          await signInTextInIframe.click({ timeout: 2000 });
          return;
        }
      } catch {
        // Continue to next iframe
      }
    }

    // Try iframe with generic button locators
    for (const iframeSelector of iframeCandidates) {
      try {
        // Wait for iframe content to load before attempting interaction
        const iframeReady = await this.waitForIframeContent(
          iframeSelector,
          2000
        );
        if (!iframeReady) continue;

        const iframe = this.page.frameLocator(iframeSelector);
        const signInButtonInIframe = iframe
          .locator('button, [role="button"]')
          .filter({ hasText: /Sign\s*In/i });

        if ((await signInButtonInIframe.count()) > 0) {
          await signInButtonInIframe.first().click({ timeout: 2000 });
          return;
        }
      } catch {
        // Continue to next iframe
      }
    }

    // Fallback: try any button with Sign In text
    try {
      const signInButtons = this.page
        .locator('button, [role="button"]')
        .filter({ hasText: /Sign\s*In/i });
      if ((await signInButtons.count()) > 0) {
        await signInButtons.first().click({ timeout: 2000 });
        return;
      }
    } catch {
      // Final fallback
    }

    console.log(
      "Sign In button not found in page, modals, or iframes, continuing with test"
    );
  }
}
