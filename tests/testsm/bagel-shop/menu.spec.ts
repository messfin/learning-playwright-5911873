import { test, expect } from "@playwright/test";

test.describe("Menu Page", () => {
  const bagelType = "Sesame";
  test(`Add ${bagelType} Bagel To Cart`, async ({ page }) => {
    await page.goto("http://localhost:5173/menu.html");

    const dialogPromise1 = page.waitForEvent("dialog");

    // Set up dialog handling
    let dialogCount = 0;
    page.on("dialog", async (dialog) => {
      dialogCount++;
      console.log(`Dialog ${dialogCount}: ${dialog.message()}`);

      if (dialog.type() === "confirm") {
        expect(dialog.message()).toContain(`Add ${bagelType} bagel to cart?`);
        await dialog.accept();
      } else {
        expect(dialog.message()).toContain(`${bagelType} bagel added to cart!`);
        await dialog.dismiss();
      }
    });

    // const table = page.locator("#menuTable");
    // const bagelRow = table.getByRole("row", { name: bagelType });
    // const addToCartButton = bagelRow.getByRole("button");

    // await addToCartButton.click();

    // await page
    //   .getByRole("row", { name: new RegExp(`^${bagelType}`) })
    //   .getByRole("button")
    //   .click();

    await page
      .getByRole("cell", { name: new RegExp(`^${bagelType}`) })
      .locator("..")
      .getByRole("button")
      .click();
  });
});
