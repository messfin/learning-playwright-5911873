import { test, expect } from "@playwright/test";
import * as fs from "fs";

test("Create an Order", async ({ page }) => {
  await page.goto("http://localhost:5173/order.html");
  await page
    .locator("#designUpload")
    .setInputFiles("lib/uploads/image-file.png");
  await page.locator("#instructions").fill("Make sure the bagel is toasted");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain(
      'File "image-file.png" uploaded successfully!'
    );
    await dialog.dismiss();
  });

  await page.getByRole("button", { name: "Place Order" }).click();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download Receipt" }).click();
  const download = await downloadPromise;

  const fileName = __dirname + download.suggestedFilename();
  await download.saveAs(__dirname + download.suggestedFilename());

  const fileContent = fs.readFileSync(fileName, "utf8");
  console.log("Content:", fileContent);

  fs.unlinkSync(fileName);
});
