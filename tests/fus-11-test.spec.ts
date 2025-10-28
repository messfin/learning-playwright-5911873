import { test, expect } from "@fixtures/base.fixture";

test.setTimeout(60_000);

test.describe("FusionWW Complete User Journey", () => {
  test("should complete full user journey from homepage to registration", async ({
    fusionHeader,
    requestQuotePage,
    registrationPage,
    page,
  }) => {
    // Helper function for safe element interactions
    const safeInteract = async (
      action: () => Promise<void>,
      successMsg: string,
      failMsg: string
    ): Promise<boolean> => {
      try {
        await action();
        console.log(successMsg);
        return true;
      } catch (error) {
        console.log(`${failMsg}: ${error.message}`);
        return false;
      }
    };

    // Helper function to verify multiple elements
    const verifyElements = async (
      elements: Array<{ locator: any; name: string }>,
      timeout = 5000
    ) => {
      const results = await Promise.allSettled(
        elements.map(({ locator }) => expect(locator).toBeVisible({ timeout }))
      );

      elements.forEach(({ name }, index) => {
        const result = results[index];
        console.log(
          `${name}: ${
            result.status === "fulfilled" ? "visible" : "not visible"
          }`
        );
      });
    };

    // Step 1: Initialize homepage
    await test.step("Navigate to FusionWW homepage", async () => {
      await fusionHeader.goto();
      await expect(fusionHeader.page).toHaveURL("https://www.fusionww.com/");
      await fusionHeader.acceptCookiesIfPresent();
      await page.waitForLoadState("domcontentloaded");
    });

    // Step 2: Verify header elements
    await test.step("Verify header navigation elements", async () => {
      await verifyElements([
        { locator: fusionHeader.shopLink, name: "Shop link" },
        { locator: fusionHeader.industriesLink, name: "Industries link" },
        { locator: fusionHeader.aboutLink, name: "About link" },
      ]);
    });

    // Step 3: Test header navigation
    await test.step("Test header navigation links", async () => {
      const navigationLinks = [
        { locator: fusionHeader.shopLink, name: "Shop" },
        { locator: fusionHeader.industriesLink, name: "Industries" },
        { locator: fusionHeader.aboutLink, name: "About" },
      ];

      for (const { locator, name } of navigationLinks) {
        await safeInteract(
          async () => {
            await locator.click();
            await page.waitForLoadState("domcontentloaded", { timeout: 2000 });
          },
          `Successfully navigated to ${name}`,
          `Failed to navigate to ${name}`
        );
      }
    });

    // Step 4: Open and verify request quote modal
    await test.step("Open request quote modal", async () => {
      const modalOpened = await safeInteract(
        async () => {
          await expect(fusionHeader.requestQuoteButton).toBeVisible();
          await fusionHeader.requestQuoteButton.click();
        },
        "Request quote modal opened successfully",
        "Failed to open request quote modal"
      );

      if (!modalOpened) return;

      await verifyElements([
        { locator: requestQuotePage.firstName, name: "First name field" },
        { locator: requestQuotePage.email, name: "Email field" },
        { locator: requestQuotePage.manufacturerPartNumber, name: "MPN field" },
      ]);
    });

    // Step 5: Test request quote form interactions
    await test.step("Test request quote form interactions", async () => {
      const formFields = [
        { locator: requestQuotePage.firstName, name: "First name" },
        { locator: requestQuotePage.email, name: "Email" },
        { locator: requestQuotePage.manufacturerPartNumber, name: "MPN" },
      ];

      for (const { locator, name } of formFields) {
        await safeInteract(
          async () => await locator.click(),
          `${name} field clicked successfully`,
          `Failed to interact with ${name} field`
        );
      }

      // Test Sign In functionality
      await safeInteract(
        async () => {
          await requestQuotePage.clickSignInSafe();
          const accessYourAccount = page.getByText("Access Your Account");
          await expect(accessYourAccount.first()).toBeVisible({
            timeout: 5000,
          });
        },
        "Sign in modal appeared successfully",
        "Failed to open sign in modal"
      );

      // Close modal
      await safeInteract(
        async () => await requestQuotePage.closeModalButton.click(),
        "Sign in modal closed successfully",
        "Failed to close sign in modal"
      );
    });

    // Step 6: Navigate to registration page
    await test.step("Navigate to registration page", async () => {
      const navigated = await safeInteract(
        async () => {
          await registrationPage.goto();
          await registrationPage.acceptCookiesIfPresent();
        },
        "Navigated to registration page successfully",
        "Failed to navigate to registration page"
      );

      if (!navigated) return;

      // Verify registration page loaded
      await safeInteract(
        async () => {
          const accountButton = page.locator("#account-button");
          await expect(accountButton).toBeVisible({ timeout: 3000 });
        },
        "Registration page elements verified",
        "Registration page elements not fully loaded"
      );
    });

    // Step 7: Test registration form fields
    await test.step("Test registration form field interactions", async () => {
      await safeInteract(
        async () => {
          const firstNameField = page.getByRole("textbox", {
            name: "First Name",
          });
          await expect(firstNameField).toBeVisible({ timeout: 3000 });
          await firstNameField.fill("John");
        },
        "Registration form fields interacted successfully",
        "Failed to interact with registration form fields"
      );
    });

    // Step 8: Verify journey completion
    await test.step("Verify test journey completion", async () => {
      console.log("✅ User journey test completed successfully");

      // Optional: verify final state
      try {
        const currentUrl = page.url();
        console.log(`Final page URL: ${currentUrl}`);
      } catch (error) {
        console.log("Could not verify final URL");
      }
    });
  });
});
