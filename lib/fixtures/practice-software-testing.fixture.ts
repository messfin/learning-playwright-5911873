import { test as baseTest } from "@playwright/test";
import { PracticeSoftwareTestingHomepage } from "@pages/practice-software-testing/homepage.page";
import { BugHuntingPage } from "@pages/practice-software-testing/bug-hunting.page";
import { PracticeSoftwareTestingRegistration } from "@pages/practice-software-testing/registration.page";

type PracticeSoftwareTestingPages = {
  practiceHomepage: PracticeSoftwareTestingHomepage;
  bugHuntingPage: BugHuntingPage;
  practiceRegistration: PracticeSoftwareTestingRegistration;
};

export const test = baseTest.extend<PracticeSoftwareTestingPages>({
  practiceHomepage: async ({ page }, use) => {
    await use(new PracticeSoftwareTestingHomepage(page));
  },
  bugHuntingPage: async ({ page }, use) => {
    await use(new BugHuntingPage(page));
  },
  practiceRegistration: async ({ page }, use) => {
    await use(new PracticeSoftwareTestingRegistration(page));
  },
});

export { expect } from "@playwright/test";

