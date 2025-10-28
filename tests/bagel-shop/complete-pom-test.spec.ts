import { test, expect } from "@fixtures/bagel-shop.fixture";

test.describe("Bagel Shop - Complete POM Test Suite", () => {
  test("Complete bagel shop workflow using POM and fixtures", async ({
    bagelShopHomePage,
    menuPage,
    orderPage,
    contactPage,
  }) => {
    // Test Home Page
    await bagelShopHomePage.goto();
    await expect(bagelShopHomePage.welcomeHeading).toBeVisible();
    await expect(bagelShopHomePage.promoBox).toBeVisible();
    await expect(bagelShopHomePage.reviewsSection).toBeVisible();

    // Navigate to Menu Page
    await bagelShopHomePage.navigateToMenu();
    await expect(menuPage.menuHeading).toBeVisible();
    await expect(menuPage.menuTable).toBeVisible();

    // Test adding bagel to cart
    await menuPage.setupDialogHandlers("Plain");
    await menuPage.addBagelToCart("Plain");

    // Navigate to Order Page
    await menuPage.navigateToOrder();
    await expect(orderPage.orderHeading).toBeVisible();
    await expect(orderPage.orderForm).toBeVisible();

    // Test order form
    await orderPage.fillInstructions("Please make it extra crispy");
    await orderPage.setQuantity(3);
    await expect(await orderPage.getInstructionsValue()).toBe(
      "Please make it extra crispy"
    );
    await expect(await orderPage.getQuantityValue()).toBe("3");

    // Navigate to Contact Page
    await orderPage.navigateToContact();
    await expect(contactPage.contactHeading).toBeVisible();
    await expect(contactPage.contactForm).toBeVisible();

    // Test contact form
    await contactPage.fillContactForm(
      "John Doe",
      "john@example.com",
      "Great bagels!"
    );
    await expect(await contactPage.getNameValue()).toBe("John Doe");
    await expect(await contactPage.getEmailValue()).toBe("john@example.com");
    await expect(await contactPage.getMessageValue()).toBe("Great bagels!");
  });

  test("Test navigation between all pages", async ({
    bagelShopHomePage,
    menuPage,
    orderPage,
    contactPage,
  }) => {
    // Start from home
    await bagelShopHomePage.goto();

    // Navigate to menu
    await bagelShopHomePage.navigateToMenu();
    await expect(menuPage.menuHeading).toBeVisible();

    // Navigate to order
    await menuPage.navigateToOrder();
    await expect(orderPage.orderHeading).toBeVisible();

    // Navigate to contact
    await orderPage.navigateToContact();
    await expect(contactPage.contactHeading).toBeVisible();

    // Navigate back to home
    await contactPage.navigateToHome();
    await expect(bagelShopHomePage.welcomeHeading).toBeVisible();
  });

  test("Test bagel menu functionality", async ({ menuPage }) => {
    await menuPage.goto();

    // Test individual bagel types
    await menuPage.setupDialogHandlers("Plain");
    await menuPage.addBagelToCart("Plain");

    // Verify bagel details for Plain bagel
    const price = await menuPage.getBagelPrice("Plain");
    const description = await menuPage.getBagelDescription("Plain");

    expect(price).toBeTruthy();
    expect(description).toBeTruthy();
  });
});
