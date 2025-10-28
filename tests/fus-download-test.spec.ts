import { test, expect } from "@fixtures/base.fixture";

test("Download Templates Test", async ({
  fusionHeader,
  downloadTemplatesPage,


}) => {
  // Navigate to the site and handle cookies
  await fusionHeader.goto();
  await expect(
    fusionHeader.page.getByRole("dialog", { name: "Cookie banner" })
  ).toBeVisible();
  await fusionHeader.acceptCookiesIfPresent();

  // Navigate to uploads & tools section
  await downloadTemplatesPage.navigateToUploadsTools();

  // Open download templates modal
  await downloadTemplatesPage.openDownloadTemplatesModal();
  await expect(downloadTemplatesPage.modal).toBeVisible();

  // Check button text
  await expect(downloadTemplatesPage.requestQuoteTemplateButton).toHaveText(
    "Download CSV"
  );

  // Step 3: Verify button labels are correct
  await expect(downloadTemplatesPage.requestQuoteTemplateButton).toHaveText(
    "Request a Quote TemplateDownload CSV"
  );

  await expect(downloadTemplatesPage.excessInventoryTemplateButton).toHaveText(
    "Excess Inventory TemplateDownload CSV"
  );

  await expect(downloadTemplatesPage.bomTemplateButton).toHaveText(
    "BOM TemplateDownload CSV"
  );

  // Download all templates
  const downloadResults = await downloadTemplatesPage.downloadAllTemplates();

  // Verify downloads were initiated
  expect(downloadResults.requestQuote.download).toBeDefined();
  expect(downloadResults.excessInventory.download).toBeDefined();
  expect(downloadResults.bom.download).toBeDefined();

  // Close popup pages
  await downloadResults.requestQuote.popup.close();
  await downloadResults.excessInventory.popup.close();
  await downloadResults.bom.popup.close();
});
