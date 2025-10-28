import { AccountPage } from "@pages/account/account.page";
import { LoginPage } from "@pages/login/login.page";
import { MessagesPage } from "@pages/account/messages.page";
import { ContactPage } from "@pages/contact/contact.page";
import { ShoppingCartPage } from "@pages/shopping-cart/shopping-cart.page";
import { PracticeShoppingCartPage } from "@pages/shopping-cart/practice-shopping-cart.page";
import { test as baseTest } from "@playwright/test";
import { FusionHeader } from "@pages/fusionww/header.page";
import { RequestQuotePage } from "@pages/fusionww/request-quote.page";
import { RegistrationPage } from "@pages/fusionww/registration.page";
import { DownloadTemplatesPage } from "@pages/fusionww/download-templates.page";

type MyPages = {
  loginPage: LoginPage;
  accountPage: AccountPage;
  messagesPage: MessagesPage;
  contactPage: ContactPage;
  shoppingCartPage: ShoppingCartPage;
  practiceShoppingCartPage: PracticeShoppingCartPage;
  fusionHeader: FusionHeader;
  requestQuotePage: RequestQuotePage;
  registrationPage: RegistrationPage;
  downloadTemplatesPage: DownloadTemplatesPage;
};

export const test = baseTest.extend<MyPages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  messagesPage: async ({ page }, use) => {
    await use(new MessagesPage(page));
  },

  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  shoppingCartPage: async ({ page }, use) => {
    await use(new ShoppingCartPage(page));
  },
  practiceShoppingCartPage: async ({ page }, use) => {
    await use(new PracticeShoppingCartPage(page));
  },
  fusionHeader: async ({ page }, use) => {
    await use(new FusionHeader(page));
  },
  requestQuotePage: async ({ page }, use) => {
    await use(new RequestQuotePage(page));
  },
  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
  downloadTemplatesPage: async ({ page }, use) => {
    await use(new DownloadTemplatesPage(page));
  },
});

export { expect } from "@playwright/test";
