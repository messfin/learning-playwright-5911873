import { test, expect } from "@playwright/test";

test("Send Message through Contact page", async ({ page, context }) => {
  await page.goto("http://localhost:5173/");
  const contactPagePromise = context.waitForEvent("page");
  await page.getByRole("link", { name: "Contact" }).click();
  const contactPage = await contactPagePromise;

  await contactPage.locator("#name").fill("Testy McTester");
  await contactPage.locator("#email").fill("test@test.com");
  await contactPage.locator("#message").fill("Hi I love your bagels!");

  // Handle the first dialog (confirmation)
  contactPage.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Send this message?");
    await dialog.accept(); // Click "OK" on the confirmation

    // Set up handler for the second dialog (alert) that will appear after confirmation
    contactPage.once("dialog", async (dialog2) => {
      expect(dialog2.message()).toContain("Message sent successfully!");
      await dialog2.dismiss(); // Click "OK" on the alert
    });
  });

  await contactPage.getByRole("button", { name: "Send Message" }).click();
  await expect(contactPage.locator("#name")).toHaveValue("");
});
