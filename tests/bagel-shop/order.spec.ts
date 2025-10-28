import { test, expect } from "@fixtures/bagel-shop.fixture";
import * as fs from "fs";

test("Create an Order", async ({ orderPage }) => {
  await orderPage.goto();

  await orderPage.uploadDesign("lib/uploads/image-file.png");
  await orderPage.fillInstructions("Make sure the bagel is toasted");
  await orderPage.setupFileUploadDialog("image-file.png");

  await orderPage.placeOrder();

  const download = await orderPage.downloadReceipt();

  const fileName = __dirname + download.suggestedFilename();
  await download.saveAs(__dirname + download.suggestedFilename());

  const fileContent = fs.readFileSync(fileName, "utf8");
  console.log("Content:", fileContent);

  fs.unlinkSync(fileName);
});
