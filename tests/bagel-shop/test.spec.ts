import { test, expect } from "@fixtures/bagel-shop.fixture";
import { MenuPage } from "@pages/bagel-shop/menu.page";
import { time } from "console";

test("Bagel Shop Smoke Test", async ({ bagelShopHomePage }) => {
  await bagelShopHomePage.goto();

  await expect(
    bagelShopHomePage.page.getByText("The best bagels in town since 1995!")
  ).toBeVisible();
});

test("Bagel Shop Menu Navigation Test", async ({
  bagelShopHomePage,
  menuPage,
}) => {
  await bagelShopHomePage.goto();
  await bagelShopHomePage.page.getByRole("link", { name: "Menu" }).click();
  await expect(menuPage.page).toHaveURL(/.*\/menu/);
});
test("Bagel Shop Contact Navigation Test", async ({
  bagelShopHomePage,
  contactPage,    
}) => {
  await bagelShopHomePage.goto();
  await bagelShopHomePage.page.getByRole("link", { name: "Contact" }).click();
  //await expect(contactPage.page).toHaveScreenshot
});