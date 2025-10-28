const { chromium } = require("@playwright/test");

async function testLogin() {
  console.log("Starting login test...");

  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login page
    console.log("Navigating to login page...");
    await page.goto("https://binaryville.com/account/");

    // Fill in credentials
    console.log("Entering credentials...");
    await page.getByRole("textbox", { name: "Email" }).fill("test@example.com");
    await page.getByRole("textbox", { name: "Password" }).fill("pass123");

    // Click sign in
    console.log("Clicking sign in...");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Check URL
    const currentUrl = page.url();
    console.log("Current URL:", currentUrl);

    if (
      currentUrl.includes("test%40example.com") &&
      currentUrl.includes("pass123")
    ) {
      console.log("✅ Test passed: Email and password found in URL");
    } else {
      console.log("❌ Test failed: Email and password not found in URL");
    }
  } catch (error) {
    console.error("Test failed with error:", error.message);
  } finally {
    await browser.close();
  }
}

testLogin();





























