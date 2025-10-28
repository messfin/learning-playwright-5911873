import { test, expect } from "@fixtures/base.fixture";
import { LoginPage } from "@pages/login/login.page";
import { registerUser } from "@datafactory/register";

test("login without page object", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile === true) {
    await page.getByLabel("Toggle navigation").click();
  }
  await page.locator('[data-test="nav-sign-in"]').click();
  await page
    .locator('[data-test="email"]')
    .fill("customer@practicesoftwaretesting.com");
  await page.locator('[data-test="password"]').fill("welcome01");
  await page.locator('[data-test="login-submit"]').click();
  await expect(page.locator('[data-test="nav-menu"]')).toContainText(
    "Jane Doe"
  );
  await expect(page.locator('[data-test="page-title"]')).toContainText(
    "My account"
  );
});

test("login with page object", async ({ page }) => {
  const email = "customer@practicesoftwaretesting.com";
  const password = "welcome01";
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);

  await expect(page.getByTestId("nav-menu")).toContainText("Jane Doe");
  await expect(page.getByTestId("page-title")).toContainText("My account");
});

test("login with newly registered user", async ({ page }) => {
  const email = `test${Date.now()}@test.com`;
  const password = "fjdWEdfs82@";

  await registerUser(email, password);
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);

  await expect(page.getByTestId("nav-menu")).toContainText("Test User");
  await expect(page.getByTestId("page-title")).toContainText("My account");
});

test("login with fixture", async ({ loginPage, accountPage, pageConsole }) => {
  const email = `test${Date.now()}@test.com`;
  const password = "fjdWEdfs82@";

  await registerUser(email, password);
  await loginPage.goto();
  await loginPage.login(email, password);

  await expect(accountPage.navMenu).toContainText("Test User");
  await expect(accountPage.pageTitle).toContainText("My account");
});
