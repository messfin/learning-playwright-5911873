import { type Locator, type Page } from "@playwright/test";

export class DownloadTemplatesPage {
  readonly page: Page;
  readonly uploadsToolsLink: Locator;
  readonly downloadTemplatesButton: Locator;
  readonly modal: Locator;
  readonly requestQuoteTemplateButton: Locator;
  readonly excessInventoryTemplateButton: Locator;
  readonly bomTemplateButton: Locator;
  readonly closeModalButton: Locator;
  

  constructor(page: Page) {
    this.page = page;
    this.uploadsToolsLink = page.getByRole("link", {
      name: "Uploads & Tools Manage Quotes",
    });
    this.downloadTemplatesButton = page.getByRole("button", {
      name: "Download Templates",
    });
    this.modal = page.getByRole("dialog", { name: "Modal" });
    this.requestQuoteTemplateButton = page
      .locator("div")
      .filter({ hasText: /^Request a Quote TemplateDownload CSV$/ })
      .getByRole("button");
    this.excessInventoryTemplateButton = page
      .locator("div")
      .filter({ hasText: /^Excess Inventory TemplateDownload CSV$/ })
      .getByRole("button");
    this.bomTemplateButton = page
      .locator("div")
      .filter({ hasText: /^BOM TemplateDownload CSV$/ })
      .getByRole("button");
    this.closeModalButton = page.getByRole("button", { name: "Close modal" });
  }

  async navigateToUploadsTools() {
    await this.uploadsToolsLink.click();
  }

  async openDownloadTemplatesModal() {
    await this.downloadTemplatesButton.click();
    await this.modal.waitFor({ state: "visible" });
  }

  async downloadRequestQuoteTemplate() {
    const [popup, download] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.page.waitForEvent("download"),
      this.requestQuoteTemplateButton.click(),
    ]);
    return { popup, download };
  }

  async downloadExcessInventoryTemplate() {
    const [popup, download] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.page.waitForEvent("download"),
      this.excessInventoryTemplateButton.click(),
    ]);
    return { popup, download };
  }

  async downloadBomTemplate() {
    const [popup, download] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.page.waitForEvent("download"),
      this.bomTemplateButton.click(),
    ]);
    return { popup, download };
  }

  async closeModal() {
    await this.closeModalButton.click();
  }

  async downloadAllTemplates() {
    const results = {
      requestQuote: await this.downloadRequestQuoteTemplate(),
      excessInventory: await this.downloadExcessInventoryTemplate(),
      bom: await this.downloadBomTemplate(),
    };

    await this.closeModal();
    return results;
  }
}

