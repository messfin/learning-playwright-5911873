import { test as base } from "@playwright/test";
import { DownloadTemplatesPage } from "../pages/fusionww/download1-templates.page";

type Fixtures = {
  downloadTemplatesPage: DownloadTemplatesPage;
};

export const test = base.extend<Fixtures>({
  downloadTemplatesPage: async ({ page }, use) => {
    const downloadTemplatesPage = new DownloadTemplatesPage(page);
    await use(downloadTemplatesPage);
  },
});

export { expect } from "@playwright/test";
