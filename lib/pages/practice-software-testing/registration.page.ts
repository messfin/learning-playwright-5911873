import { type Locator, type Page } from "@playwright/test";

export interface RegistrationData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
  email: string;
  password: string;
  phone: string;
}

export class PracticeSoftwareTestingRegistration {
  page: Page;

  // Login elements
  readonly loginHeading: Locator;
  readonly registerLink: Locator;

  // Registration form elements
  readonly registrationHeading: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly dobField: Locator;
  readonly addressField: Locator;
  readonly postcodeField: Locator;
  readonly cityField: Locator;
  readonly stateField: Locator;
  readonly countryField: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly phoneField: Locator;
  readonly registerSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login elements
    this.loginHeading = page.getByRole("heading", { name: "Login" });
    this.registerLink = page.locator('[data-test="register-link"]');

    // Registration form elements
    this.registrationHeading = page.getByRole("heading", {
      name: "Customer registration",
    });
    this.firstNameField = page.locator('[data-test="first-name"]');
    this.lastNameField = page.locator('[data-test="last-name"]');
    this.dobField = page.locator('[data-test="dob"]');
    this.addressField = page.locator('[data-test="street"]');
    this.postcodeField = page.locator('[data-test="postal_code"]');
    this.cityField = page.locator('[data-test="city"]');
    this.stateField = page.locator('[data-test="state"]');
    this.countryField = page.locator('[data-test="country"]');
    this.emailField = page.locator('[data-test="email"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.phoneField = page.locator('[data-test="phone"]');
    this.registerSubmitButton = page.locator('[data-test="register-submit"]');
  }

  async verifyLoginPageVisible() {
    await this.loginHeading.waitFor({ state: "visible", timeout: 10000 });
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }

  async verifyRegistrationPageVisible() {
    await this.registrationHeading.waitFor({
      state: "visible",
      timeout: 10000,
    });
  }

  async fillRegistrationForm(data: RegistrationData) {
    await this.firstNameField.fill(data.firstName);
    await this.lastNameField.fill(data.lastName);
    await this.dobField.fill(data.dateOfBirth);
    await this.addressField.fill(data.address);
    await this.postcodeField.fill(data.postcode);
    await this.cityField.fill(data.city);
    await this.stateField.fill(data.state);
    await this.countryField.selectOption(data.country);
    await this.emailField.fill(data.email);
    await this.passwordField.fill(data.password);
    await this.phoneField.fill(data.phone);
  }

  async submitRegistration() {
    await this.registerSubmitButton.click();
  }

  async completeRegistration(data: RegistrationData) {
    await this.fillRegistrationForm(data);
    await this.submitRegistration();
  }
}
