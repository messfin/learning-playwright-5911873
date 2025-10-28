import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login/loginPage";

test("User can log in using pom", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("customer@practicesoftwaretesting.com", "welcome01");
  await expect(page.locator('[data-test="nav-menu"]')).toContainText(
    "Jane Doe"
  );
  
    });
 
