import { type Locator, type Page } from "@playwright/test";

export class DownloadTemplatesPage {
  readonly page: Page;
  readonly uploadsToolsLink: Locator;
  readonly downloadTemplatesButton: Locator;
  readonly modal: Locator;
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
    this.closeModalButton = page.getByRole("button", { name: "Close modal" });
  }

  /**
   * Dynamically get a template section (label + button) by name.
   * Example: "Excess Inventory Template"
   */
  getTemplateSection(templateName: string) {
    const section = this.page
      .locator("div")
      .filter({
        hasText: new RegExp(`^${templateName}\\s*Download CSV$`, "i"),
      });
    const button = section.getByRole("button", { name: "Download CSV" });
    return { section, button };
  }

  async navigateToUploadsTools() {
    await this.uploadsToolsLink.click();
  }

  async openDownloadTemplatesModal() {
    await this.downloadTemplatesButton.click();
    await this.modal.waitFor({ state: "visible" });
  }

  async downloadTemplate(templateName: string) {
    const { button } = this.getTemplateSection(templateName);
    const [popup, download] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.page.waitForEvent("download"),
      button.click(),
    ]);
    return { popup, download };
  }

  async closeModal() {
    await this.closeModalButton.click();
  }
}
