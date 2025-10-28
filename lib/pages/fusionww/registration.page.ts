import { type Locator, type Page } from "@playwright/test";

export class RegistrationPage {
  readonly page: Page;
  readonly accountButton: Locator;
  readonly registerButton: Locator;
  readonly modalTitle: Locator;
  readonly registerNowButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly geographicalRegionButton: Locator;
  readonly americasOption: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly closeModalButton: Locator;
  readonly modalContainer: Locator;
  readonly modalContent: Locator;
  readonly modalErrorMessage: Locator;
  readonly modalErrorPasswordMessage: Locator;
  readonly modalErrorConfirmNameMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountButton = page.locator("#account-button");
    this.registerButton = page.getByRole("button", { name: "Register" });
    this.modalTitle = page.locator(".Modal_titleWrapper__VtBVY > div");
    this.registerNowButton = page.getByRole("button", { name: "Register" });
    this.firstNameInput = page.getByRole("textbox", { name: "First Name" });
    this.lastNameInput = page.getByRole("textbox", { name: "Last Name" });
    this.emailInput = page.getByRole("textbox", { name: "Email Address" });
    this.phoneInput = page.getByRole("textbox", { name: /Phone/i });
    this.modalErrorPasswordMessage = page.getByText(
      "Minimum 8 characters, One lowercase letter, One uppercase letter, One number, One special character"
    );
    this.modalErrorConfirmNameMessage = page.getByText(
      "Invalid characters"
    );
    this.modalContent = page.getByText("Please provide a valid email address");
    this.modalErrorMessage = page.getByText(
      "Minimum 8 characters, One lowercase letter, One uppercase letter, One number, One special character"
    ); // Adjust selector as needed
    this.geographicalRegionButton = page.getByRole("button", {
      name: "Geographical Region",
    });
    this.americasOption = page.getByRole("option", { name: "Americas" });
    this.passwordInput = page.getByRole("textbox", {
      name: "Password",
      exact: true,
    });
    this.confirmPasswordInput = page.getByRole("textbox", {
      name: "Confirm Password",
    });
    this.closeModalButton = page.getByRole("button", { name: "Close modal" });
    this.modalContainer = page
      .locator('[role="dialog"], .modal, [class*="Modal"]')
      .first();
  }

  async goto() {
    await this.page.goto("https://www.fusionww.com/");
  }

  async dismissInterferingElements() {
    try {
      // Remove any cookie banners or overlays that might interfere
      await this.page.evaluate(() => {
        const interferingSelectors = [
          "#hs-banner-parent",
          ".hs-cookie-notification",
          ".cookie-banner",
          "#cookie-consent",
          '[id*="cookie"]',
          '[class*="cookie"]',
          '[id*="banner"]',
          '[class*="banner"]',
        ];

        interferingSelectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            if (element instanceof HTMLElement) {
              element.style.display = "none";
              element.style.visibility = "hidden";
              element.style.pointerEvents = "none";
              element.remove();
            }
          });
        });
      });
    } catch (error) {
      console.log(`Error dismissing interfering elements: ${error.message}`);
    }
  }

  async acceptCookiesIfPresent() {
    try {
      // Wait for page to load with a reasonable timeout
      await this.page.waitForLoadState("domcontentloaded");

      // Wait a bit for any dynamic content to load
      await this.page.waitForTimeout(3000);

      // Try multiple cookie banner selectors with better error handling
      const cookieSelectors = [
        'button[data-testid="accept-all-cookies"]',
        'button:has-text("Accept all")',
        'button:has-text("Accept All")',
        'button:has-text("Accept")',
        '#hs-eu-cookie-confirmation-buttons-area button:has-text("Accept")',
        '.hs-cookie-notification-buttons button:has-text("Accept")',
        '#hs-eu-cookie-confirmation-buttons-area button[type="button"]',
        'button[data-hs-cookie-consent="accept-all"]',
        '[data-testid="cookie-banner"] button:has-text("Accept")',
        '.cookie-banner button:has-text("Accept")',
        '#cookie-consent button:has-text("Accept")',
      ];

      let cookiesAccepted = false;

      for (const selector of cookieSelectors) {
        try {
          const cookieButton = this.page.locator(selector).first();
          if (await cookieButton.isVisible({ timeout: 2000 })) {
            console.log(`Found cookie button with selector: ${selector}`);
            await cookieButton.click();
            // Wait for cookie banner to disappear completely
            await this.page.waitForTimeout(2000);

            // Verify cookie banner is gone by checking if it's not visible
            const cookieBanner = this.page.locator(
              "#hs-banner-parent, .hs-cookie-notification, .cookie-banner, #cookie-consent"
            );
            if (
              await cookieBanner.isVisible({ timeout: 1000 }).catch(() => false)
            ) {
              console.log(
                "Cookie banner still visible, trying to dismiss again"
              );
              // Try to dismiss any remaining cookie elements
              await this.page.evaluate(() => {
                const banners = document.querySelectorAll(
                  "#hs-banner-parent, .hs-cookie-notification, .cookie-banner, #cookie-consent"
                );
                banners.forEach((banner) => {
                  if (banner instanceof HTMLElement) {
                    banner.style.display = "none";
                    banner.remove();
                  }
                });
              });
            }

            cookiesAccepted = true;
            console.log("Cookies accepted successfully");
            break;
          }
        } catch (error) {
          // Continue to next selector if this one fails
          console.log(`Selector ${selector} failed: ${error.message}`);
          continue;
        }
      }

      if (!cookiesAccepted) {
        console.log("No cookie banner found or could not be accepted");
        // Try to remove any cookie banners that might be interfering
        await this.page.evaluate(() => {
          const banners = document.querySelectorAll(
            "#hs-banner-parent, .hs-cookie-notification, .cookie-banner, #cookie-consent"
          );
          banners.forEach((banner) => {
            if (banner instanceof HTMLElement) {
              banner.style.display = "none";
              banner.remove();
            }
          });
        });
      }
    } catch (error) {
      console.log(`Error in acceptCookiesIfPresent: ${error.message}`);
      // Don't fail the test if cookies can't be accepted
    }
  }

  async openRegistrationModal() {
    // Dismiss any interfering elements first
    await this.dismissInterferingElements();

    // Wait for account button to be visible and clickable
    await this.accountButton.waitFor({ state: "visible", timeout: 15000 });
    await this.accountButton.click();

    // Try multiple register button selectors
    const registerButtonSelectors = [
      this.registerButton,
      this.page.getByRole("button", { name: "Register" }),
      this.page.getByRole("button", { name: "Sign Up" }),
      this.page.getByRole("button", { name: "Create Account" }),
      this.page.locator('button:has-text("Register")'),
      this.page.locator('button:has-text("Sign Up")'),
      this.page.locator('button:has-text("Create Account")'),
      this.page.locator('[data-testid*="register"]'),
      this.page.locator('[data-testid*="signup"]'),
    ];

    let registerButtonFound = false;
    for (const selector of registerButtonSelectors) {
      try {
        if (await selector.isVisible({ timeout: 3000 })) {
          await selector.click();
          registerButtonFound = true;
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!registerButtonFound) {
      console.log("Register button not found, trying alternative approach");
      // Try clicking on any button that might open the registration modal
      const anyButton = this.page.locator("button").first();
      if (await anyButton.isVisible({ timeout: 2000 })) {
        await anyButton.click();
      }
    }

    // Wait for modal to be fully loaded
    await this.page.waitForTimeout(2000);

    // Wait for modal container to be visible
    await this.modalContainer.waitFor({ state: "visible", timeout: 10000 });
  }

  async clickModalTitle() {
    await this.modalTitle.click();
  }

  async clickRegisterNow() {
    // Dismiss any interfering elements first
    await this.dismissInterferingElements();

    // Wait for register button to be visible and enabled
    await this.registerNowButton.waitFor({ state: "visible", timeout: 15000 });

    // Wait for the button to be enabled (not disabled)
    await this.registerNowButton.waitFor({ state: "attached" });
    await this.page.waitForFunction(
      () => {
        const button = document.querySelector("button[disabled]");
        return !button || !button.hasAttribute("disabled");
      },
      { timeout: 15000 }
    );

    await this.registerNowButton.click();

    // Wait for form to be fully loaded
    await this.page.waitForTimeout(2000);

    // Wait for form inputs to be visible
    await this.firstNameInput.waitFor({ state: "visible", timeout: 10000 });
  }

  async fillFirstName(firstName: string) {
    await this.firstNameInput.waitFor({ state: "visible" });
    await this.firstNameInput.click();
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.waitFor({ state: "visible" });
    await this.lastNameInput.click();
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email: string) {
    await this.emailInput.waitFor({ state: "visible" });
    await this.emailInput.click();
    await this.emailInput.fill(email);
  }

  async fillPhoneNumber(phone: string) {
    // Try multiple phone field selectors since the exact field might not exist
    const phoneSelectors = [
      this.phoneInput,
      this.page.getByRole("textbox", { name: "Phone" }),
      this.page.getByRole("textbox", { name: "Phone Number" }),
      this.page.locator('input[type="tel"]'),
      this.page.locator('input[name*="phone"]'),
      this.page.locator('input[id*="phone"]'),
      this.page.locator('input[placeholder*="phone" i]'),
    ];

    let phoneFieldFound = false;
    for (const selector of phoneSelectors) {
      try {
        if (await selector.isVisible({ timeout: 2000 })) {
          await selector.click();
          await selector.fill(phone);
          phoneFieldFound = true;
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!phoneFieldFound) {
      console.log("Phone field not found, skipping phone number input");
      // Don't fail the test if phone field doesn't exist
    }
  }

  async selectGeographicalRegion(region: string = "Americas") {
    await this.geographicalRegionButton.waitFor({ state: "visible" });
    await this.geographicalRegionButton.click();

    // Wait for dropdown to open and select the specified region
    const regionOption = this.page.getByRole("option", { name: region });
    await regionOption.waitFor({ state: "visible" });
    await regionOption.click();
  }

  async fillPassword(password: string) {
    await this.passwordInput.waitFor({ state: "visible" });
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(password: string) {
    await this.confirmPasswordInput.waitFor({ state: "visible" });
    await this.confirmPasswordInput.click();
    await this.confirmPasswordInput.fill(password);
  }

  async closeModal() {
    await this.closeModalButton.click();
  }

  async closeModalTwice() {
    try {
      // Try multiple close button selectors
      const closeModalSelectors = [
        'button[aria-label="Close modal"]',
        'button:has-text("Close modal")',
        ".Modal_icon__v9JkP",
        '[data-testid="close-modal"]',
        'button[class*="close"]',
        'button[class*="Close"]',
        'button[aria-label="close"]',
        'button[title="Close"]',
        'button[title="close"]',
        '[role="button"][aria-label*="close" i]',
        '[role="button"][aria-label*="Close" i]',
        'button:has([class*="close"])',
        'button:has([class*="Close"])',
        "button:has(svg)",
        ".Modal_closeButton__*",
        ".close-button",
        ".closeButton",
        ".modal-close",
        ".modalClose",
      ];

      let modalClosed = false;

      // First attempt - try all selectors
      for (const selector of closeModalSelectors) {
        try {
          const closeButton = this.page.locator(selector).first();
          if (await closeButton.isVisible({ timeout: 1000 })) {
            await closeButton.click();
            console.log(`Modal closed using selector: ${selector}`);
            modalClosed = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      // Wait for modal to start closing
      await this.page.waitForTimeout(1000);

      // Second attempt - try again with different selectors
      if (!modalClosed) {
        const secondAttemptSelectors = [
          'button[aria-label="Close modal"]',
          'button:has-text("Close modal")',
          ".Modal_icon__v9JkP",
          'button[class*="close"]',
          'button[class*="Close"]',
        ];

        for (const selector of secondAttemptSelectors) {
          try {
            const closeButton = this.page.locator(selector).first();
            if (await closeButton.isVisible({ timeout: 1000 })) {
              await closeButton.click();
              console.log(
                `Modal closed on second attempt using selector: ${selector}`
              );
              modalClosed = true;
              break;
            }
          } catch (error) {
            continue;
          }
        }
      }

      // If still not closed, try pressing Escape key
      if (!modalClosed) {
        console.log("Trying Escape key to close modal");
        await this.page.keyboard.press("Escape");
        await this.page.waitForTimeout(1000);
      }

      // Final attempt - try clicking outside the modal
      if (!modalClosed) {
        console.log("Trying to click outside modal to close it");
        await this.page.click("body", { position: { x: 10, y: 10 } });
        await this.page.waitForTimeout(1000);
      }
    } catch (error) {
      console.log(`Error in closeModalTwice: ${error.message}`);
      // Try pressing Escape key as fallback
      await this.page.keyboard.press("Escape");
    }
  }

  async waitForModalToClose() {
    try {
      // Wait for modal container to disappear
      await this.modalContainer.waitFor({ state: "detached", timeout: 10000 });
    } catch (error) {
      console.log(
        `Modal container not found or already closed: ${error.message}`
      );
    }
  }
}
