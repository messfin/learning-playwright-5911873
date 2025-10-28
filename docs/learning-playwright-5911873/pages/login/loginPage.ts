import { Page } from "playwright";

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("https://www.fusionww.com/login");
  }

  get emailInput() {
    return this.page.getByTestId("login-email");
  }

  get passwordInput() {
    return this.page.getByTestId("login-password");
  }

  get loginButton() {
    return this.page.getByTestId("login-submit");
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }
}
