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

  async clickSignInSafe() {
    await this.acceptCookiesIfPresent();

    // In-page candidates first
    const pageCandidates: Locator[] = [
      this.signInButton,
      this.page.getByText(/\bSign\s*In\b/i),
      this.page.locator('button:has-text("Sign In")'),
      this.page.locator('[role="button"]:has-text("Sign In")'),
      this.page.locator("text=Sign In"),
    ];

    try {
      await this.page.evaluate(() =>
        window.scrollTo(0, document.body.scrollHeight)
      );
    } catch {}
    try {
      await this.page.waitForTimeout(200);
    } catch {}
    try {
      await this.page.evaluate(() => window.scrollTo(0, 0));
    } catch {}
    try {
      await this.ensureSignInClickable();
    } catch {}

    for (const locator of pageCandidates) {
      try {
        if ((await locator.count()) > 0) {
          await locator.first().scrollIntoViewIfNeeded();
          await locator.first().click({ force: true, timeout: 1500 });
          return;
        }
      } catch {}
    }

    // Try inside modal containers
    const modalRoots: Locator[] = [
      this.page.getByRole("dialog"),
      this.page.locator('[aria-modal="true"]'),
      this.page.locator(".modal:visible"),
    ];
    for (const modal of modalRoots) {
      try {
        if (await modal.isVisible({ timeout: 500 })) {
          const modalBtn = modal
            .getByRole("button", { name: /Sign\s*In/i })
            .first();
          if (await modalBtn.count()) {
            await modalBtn.scrollIntoViewIfNeeded();
            await modalBtn.click({ force: true, timeout: 1500 });
            return;
          }
        }
      } catch {}
    }

    // Try inside common iframes (HubSpot/embedded forms)
    const frameSelectors = [
      'iframe[src*="hsforms"]',
      'iframe[title*="form" i]',
      'iframe[title*="hubspot" i]',
      'iframe[id*="hs-" i]',
      "iframe",
    ];
    for (const sel of frameSelectors) {
      try {
        const frameLoc = this.page.frameLocator(sel);
        const frameBtn = frameLoc
          .getByRole("button", { name: /Sign\s*In/i })
          .first();
        if (await frameBtn.count()) {
          await frameBtn.scrollIntoViewIfNeeded();
          await frameBtn.click({ force: true, timeout: 1500 });
          return;
        }
      } catch {}
    }

    // Final attempt: any button with matching text
    const anyButton = this.page.locator('button, [role="button"]');
    const count = await anyButton.count();
    for (let i = 0; i < count; i++) {
      const btn = anyButton.nth(i);
      const text = (await btn.textContent()) || "";
      if (/\bSign\s*In\b/i.test(text)) {
        await btn.scrollIntoViewIfNeeded();
        await btn.click({ force: true, timeout: 1500 });
        return;
      }
    }

    throw new Error(
      'Unable to locate a clickable "Sign In" control on Request Quote page (checked page, modals, iframes).'
    );
  }
}
