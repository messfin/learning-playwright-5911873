import { type Locator, type Page } from "@playwright/test";

export class ContactPage {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly menuLink: Locator;
  readonly orderLink: Locator;
  readonly contactLink: Locator;
  readonly contactHeading: Locator;
  readonly contactInfo: Locator;
  readonly contactForm: Locator;
  readonly nameField: Locator;
  readonly emailField: Locator;
  readonly messageField: Locator;
  readonly sendMessageButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation elements
    this.homeLink = page.getByRole("link", { name: "Home" });
    this.menuLink = page.getByRole("link", { name: "Menu" });
    this.orderLink = page.getByRole("link", { name: "Order" });
    this.contactLink = page.getByRole("link", { name: "Contact" });

    // Main content elements
    this.contactHeading = page.getByRole("heading", { name: "Contact Us" });
    this.contactInfo = page.locator(".contact-info");
    this.contactForm = page.locator("#contactForm");

    // Form elements
    this.nameField = page.locator("#name");
    this.emailField = page.locator("#email");
    this.messageField = page.locator("#message");
    this.sendMessageButton = page.getByRole("button", { name: "Send Message" });
  }

  async goto() {
    await this.page.goto("http://localhost:5173/contact.html");
  }

  async navigateToHome() {
    await this.homeLink.click();
  }

  async navigateToMenu() {
    await this.menuLink.click();
  }

  async navigateToOrder() {
    await this.orderLink.click();
  }

  async fillName(name: string) {
    await this.nameField.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailField.fill(email);
  }

  async fillMessage(message: string) {
    await this.messageField.fill(message);
  }

  async sendMessage() {
    await this.sendMessageButton.click();
  }

  async fillContactForm(name: string, email: string, message: string) {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillMessage(message);
  }

  async isContactFormVisible() {
    return await this.contactForm.isVisible();
  }

  async isContactInfoVisible() {
    return await this.contactInfo.isVisible();
  }

  async getNameValue() {
    return await this.nameField.inputValue();
  }

  async getEmailValue() {
    return await this.emailField.inputValue();
  }

  async getMessageValue() {
    return await this.messageField.inputValue();
  }

  async setupContactDialogs() {
    // Handle the first dialog (confirmation)
    this.page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Send this message?");
      await dialog.accept(); // Click "OK" on the confirmation

      // Set up handler for the second dialog (alert) that will appear after confirmation
      this.page.once("dialog", async (dialog2) => {
        expect(dialog2.message()).toContain("Message sent successfully!");
        await dialog2.dismiss(); // Click "OK" on the alert
      });
    });
  }

  async getContactInfoText() {
    return await this.contactInfo.textContent();
  }

  async isFormEmpty() {
    const nameValue = await this.getNameValue();
    const emailValue = await this.getEmailValue();
    const messageValue = await this.getMessageValue();
    return nameValue === "" && emailValue === "" && messageValue === "";
  }
}
