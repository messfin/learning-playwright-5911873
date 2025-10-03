import { test, expect } from "@fixtures/base.fixture";

test.only("fusionww header nav and request quote flow (POM)", async ({
  fusionHeader,
  requestQuotePage,
}) => {
  await fusionHeader.goto();
  await fusionHeader.acceptCookiesIfPresent();

  await fusionHeader.shopLink.click();
  await fusionHeader.industriesLink.click();
  await fusionHeader.industriesLink.click();
  await fusionHeader.qualityLink.click();
  await fusionHeader.aboutLink.click();
  await fusionHeader.insightsLink.click();

  await fusionHeader.requestQuoteButton.click();

  await requestQuotePage.firstName.click();
  await requestQuotePage.lastName.click();
  await requestQuotePage.email.click();
  await requestQuotePage.phoneNumber.click();
  await requestQuotePage.companyName.click();
  await requestQuotePage.manufacturerPartNumber.click();
  await requestQuotePage.manufacturerPartNumber.click();
  await requestQuotePage.comments.click();
  await requestQuotePage.clickSignInSafe();
  await requestQuotePage.page
    .locator("div")
    .filter({ hasText: "Access Your Account" })
    .nth(3)
    .click();
  await requestQuotePage.page
    .locator("div")
    .filter({ hasText: "Access Your Account" })
    .nth(2)
    .click();
  await requestQuotePage.closeModalButton.click();
});
