import { test, expect } from "@fixtures/base.fixture";

const templates = [
  "Request a Quote Template",
  "Excess Inventory Template", 
  "BOM Template",
];

test.describe("Download Templates Modal", () => {
  for (const name of templates) {
    test(`should verify label and download ${name}`, async ({
      fusionHeader,
      downloadTemplatesPage,
      registrationPage,
    }) => {
      // Step 1: Navigate to homepage and handle cookies
      await fusionHeader.goto();
      //await fusionHeader.acceptCookiesIfPresent();
      await registrationPage.acceptCookiesIfPresent();

      // Step 2: Navigate to uploads & tools
      await downloadTemplatesPage.navigateToUploadsTools();

      // Step 3: Open modal
      await downloadTemplatesPage.openDownloadTemplatesModal();
      await expect(downloadTemplatesPage.modal).toBeVisible();

      // Step 4: Download file based on template name
      let downloadResult;
      if (name === "Request a Quote Template") {
        downloadResult =
          await downloadTemplatesPage.downloadRequestQuoteTemplate();
      } else if (name === "Excess Inventory Template") {
        downloadResult =
          await downloadTemplatesPage.downloadExcessInventoryTemplate();
      } else if (name === "BOM Template") {
        downloadResult = await downloadTemplatesPage.downloadBomTemplate();
      }

      const fileName = downloadResult.download.suggestedFilename();

      // Step 5: Validate file name
      expect(fileName).toMatch(/\.xlsx$/);

      // Step 6: Close popup and modal
      await downloadResult.popup.close();
      await downloadTemplatesPage.closeModal();

      console.log(`✅ Successfully downloaded: ${fileName}`);
    });
  }
});
