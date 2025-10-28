import { test, expect } from "@fixtures/base.fixture";

test.describe("Download Templates", () => {
  test("should download all available templates successfully", async ({
    fusionHeader,
    downloadTemplatesPage,
    registrationPage,
  }) => {
    // Arrange: Setup initial page state
    await fusionHeader.goto();

    await registrationPage.acceptCookiesIfPresent();

    //await fusionHeader.acceptCookiesIfPresent();
    //({ timeout: 50000 });

    // Act: Navigate to templates
    await downloadTemplatesPage.navigateToUploadsTools();
    await downloadTemplatesPage.openDownloadTemplatesModal();

    // Assert: Modal is visible
    await expect(downloadTemplatesPage.modal).toBeVisible();

    //assert: Modal title is correct
   // await expect(downloadTemplatesPage.modal).toHaveText(
    //  "Download TemplatesDownload TemplatesIf you haven't already, download CSV templates see an example of the format required.Request a Quote TemplateDownload CSVExcess Inventory TemplateDownload"
    //);

    //assert: model text Request a Quote Template
    //await expect(downloadTemplatesPage.modal).toHaveText("Request a Quote Template");

    //assert: model text Excess Inventory Template
    //await expect(downloadTemplatesPage.modal).toHaveText("Excess Inventory Template");

    //assert: model text BOM Template
    //await expect(downloadTemplatesPage.modal).toHaveText("BOM Template");

    // Act: Download all templates
    const downloadResults = await downloadTemplatesPage.downloadAllTemplates();

    // Assert: Verify all downloads were initiated
    await verifyDownloadsInitiated(downloadResults);

    // Cleanup: Close popup pages
    await closeAllPopups(downloadResults);
  });
});

/**
 * Verifies that all template downloads were successfully initiated
 */
async function verifyDownloadsInitiated(downloadResults: {
  requestQuote: { download: any; popup: any };
  excessInventory: { download: any; popup: any };
  bom: { download: any; popup: any };
}) {
  const templates = ["requestQuote", "excessInventory", "bom"] as const;

  for (const template of templates) {
    expect(
      downloadResults[template].download,
      `${template} download should be defined`
    ).toBeDefined();
  }
}

/**
 * Closes all popup windows opened during template downloads
 */
async function closeAllPopups(downloadResults: {
  requestQuote: { popup: any };
  excessInventory: { popup: any };
  bom: { popup: any };
}) {
  const popups = [
    downloadResults.requestQuote.popup,
    downloadResults.excessInventory.popup,
    downloadResults.bom.popup,
  ];

  await Promise.all(popups.map((popup) => popup.close()));
}
