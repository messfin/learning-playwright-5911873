import { test, expect } from "@fixtures/base.fixture";

test.describe("FUS-1: Header nav and Request Quote", () => {
  test("header links navigate and request quote modal opens", async ({
    fusionHeader,
    requestQuotePage,
    config,
  }) => {
    await fusionHeader.goto(config.baseUrl);
    await fusionHeader.acceptCookiesIfPresent();

    const keyHeaderLinks = [
      fusionHeader.shopLink,
      fusionHeader.industriesLink,
      fusionHeader.aboutLink,
    ];

    for (const link of keyHeaderLinks) {
      await link.click();
      await fusionHeader.page.waitForLoadState("domcontentloaded", {
        timeout: 2000,
      });
    }

    await expect(fusionHeader.requestQuoteButton).toBeVisible();
    await fusionHeader.requestQuoteButton.click();

    await Promise.all([
      expect(requestQuotePage.firstName).toBeVisible(),
      expect(requestQuotePage.email).toBeVisible(),
      expect(requestQuotePage.manufacturerPartNumber).toBeVisible(),
    ]);

    await requestQuotePage.clickSignInSafe();
    await expect(
      requestQuotePage.page.getByText("Access Your Account").first()
    ).toBeVisible();
    await requestQuotePage.closeModalButton.click();
  });
});


