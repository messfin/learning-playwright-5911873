import { test, expect } from "@playwright/test";

test.describe("Home page with no auth", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("visual test", async ({ page, headless }) => {
    await page.waitForLoadState("networkidle");
    headless
      ? await test.step("visual test", async () => {
          await expect(page).toHaveScreenshot("home-page-no-auth.png", {
            mask: [page.getByTitle("Practice Software Testing - Toolshop")],
          });
        })
      : console.log("Running in Headed mode, no screenshot comparison");
  });

  test("check sign in", async ({ page }) => {
    await expect(page.getByTestId("nav-sign-in")).toHaveText("Sign in");
  });

  test("validate page title", async ({ page }) => {
    await expect(page).toHaveTitle(
      "Practice Software Testing - Toolshop - v5.0"
    );
  });

  test("grid loads with 9 items", async ({ page }) => {
    const productGrid = page.locator(".col-md-9");
    await expect(productGrid.getByRole("link")).toHaveCount(9);
    expect(await productGrid.getByRole("link").count()).toBe(9);
  });

  test("search for Thor Hammer", async ({ page, isMobile }) => {
    const productGrid = page.locator(".col-md-9");
    if (isMobile === true) {
      await page.getByRole("button", { name: "Filters" }).click();
    }
    await page.getByTestId("search-query").fill("Thor Hammer");
    await page.getByTestId("search-submit").click();
    await expect(productGrid.getByRole("link")).toHaveCount(1);
    await expect(page.getByAltText("Thor Hammer")).toBeVisible();
  });

  test("check for inputs without labels", async ({ page }) => {
    // await page.goto("https://with-bugs.practicesoftwaretesting.com/");

    const inputsWithoutLabels = await page.evaluate(() => {
      // Find inputs that are missing labels on page
      return Array.from(document.querySelectorAll("input"))
        .filter((input) => !document.querySelector(`label[for="${input.id}"]`))
        .map((input) => input.outerHTML);
    });
    expect(
      inputsWithoutLabels.length,
      `Labels with issues: ${inputsWithoutLabels.toString()}`
    ).toBe(0);
  });

  test("check for broken images", async ({ page }) => {
    // await page.goto("https://with-bugs.practicesoftwaretesting.com/");

    const brokenImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("img"))
        .filter((img) => img.naturalWidth === 0 || img.naturalHeight === 0)
        .map((img) => img.src);
    });
    expect(
      brokenImages.length,
      `Broken Images: ${brokenImages.toString()}`
    ).toBe(0);
  });
});

test.describe("Home page customer 01 auth", () => {
  test.use({ storageState: ".auth/customer01.json" });
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("visual test authorized", async ({ page, headless }) => {
    await page.waitForLoadState("networkidle");
    headless
      ? await test.step("visual test", async () => {
          await expect(page).toHaveScreenshot("home-page-customer01.png", {
            mask: [page.getByTitle("Practice Software Testing - Toolshop")],
          });
        })
      : console.log("Running in Headed mode, no screenshot comparison");
  });
  test("check customer 01 is signed in", async ({ page }) => {
    await expect(page.getByTestId("nav-sign-in")).not.toBeVisible();
    await expect(page.getByTestId("nav-menu")).toContainText("Jane Doe");
  });

  test("validate product data is visible in UI from API", async ({ page }) => {
    let products: any;
    let apiUrl = process.env.API_URL;
    await test.step("intercept /products", async () => {
      await page.route(apiUrl + "/products**", async (route) => {
        const response = await route.fetch();
        products = await response.json();
        route.continue();
      });
    });

    await page.goto("/");

    const productGrid = page.locator(".col-md-9");
    await expect(productGrid).toBeVisible();
    await expect(page.locator(".skeleton").first()).not.toBeVisible();

    for (const product of products.data) {
      await expect(productGrid).toContainText(product.name);
      await expect(productGrid).toContainText(product.price.toString());
    }
  });
});

test("validate product data is visible from modified API", async ({ page }) => {
  let apiUrl = process.env.API_URL;
  await test.step("overwrite /products", async () => {
    await page.route(apiUrl + "/products**", async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      json.data[0]["name"] = "Mocked Product";
      json.data[0]["price"] = 100000.01;
      json.data[0]["in_stock"] = false;

      await route.fulfill({ response, json });
    });
  });
  await page.goto("/");

  const productGrid = page.locator(".col-md-9");
  await expect(productGrid.getByRole("link").first()).toContainText(
    "Mocked Product"
  );
  await expect(productGrid.getByRole("link").first()).toContainText(
    "100000.01"
  );
  await expect(productGrid.getByRole("link").first()).toContainText(
    "Out of stock"
  );
});

test("validate product data is loaded from har file", async ({ page }) => {
  const apiUrl = process.env.API_URL;
  await test.step("Mock /products", async () => {
    await page.routeFromHAR(".hars/product.har", {
      url: apiUrl + "/products**",
      update: false,
    });
  });
  await page.goto("/");
  const productGrid = page.locator(".col-md-9");
  await expect(productGrid).toContainText("Happy Path Pliers");
  await expect(productGrid).toContainText("1.99");
});

test("validate brands by intercepting network data", async ({ page }) => {
  let brands: any;
  const apiUrl = process.env.API_URL;
  await test.step("intercept /brands", async () => {
    await page.route(apiUrl + "/brands", async (route) => {
      const response = await route.fetch();
      brands = await response.json();
      route.continue();
    });
  });
  await page.goto("/");

  const productGrid = page.locator(".col-md-9");
  await expect(productGrid).toBeVisible();
  await expect(page.locator(".skeleton").first()).not.toBeVisible();

  const brandFilterSection = page.getByText("SortName (A - Z)Name (Z - A)");

  for (const brand of brands) {
    await expect(brandFilterSection).toContainText(brand.name);
  }
});

test("validate categories render in UI by mocking", async ({ page }) => {
  let categories: any;
  const apiUrl = process.env.API_URL;

  await test.step("intercept /categories", async () => {
    await page.route(apiUrl + "/categories/tree", async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      categories = json.data;

      json[0].name = "Mocked Category";
      if (json[0].sub_categories && json[0].sub_categories.length > 0) {
        json[0].sub_categories[0].name = "Mocked Subcategory";
      }
      await route.fulfill({ response, json });
    });
  });
  await page.goto("/");

  const productGrid = page.locator(".col-md-9");
  await expect(productGrid).toBeVisible();
  await expect(page.locator(".skeleton").first()).not.toBeVisible();

  const categoryFilterSection = page.getByText("SortName (A - Z)Name (Z - A)");

  await expect(categoryFilterSection).toContainText("Mocked Category");
  await expect(categoryFilterSection).toContainText("Mocked Subcategory");
});
