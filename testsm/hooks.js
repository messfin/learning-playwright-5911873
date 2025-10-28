const { Before, After } = require("@cucumber/cucumber");
const { setupBrowser } = require("./browserSetup");

Before(async function() {
  console.log("Setting up browser...");
  await setupBrowser();
  console.log("Browser setup complete");
});

After(async function() {
  console.log("Test completed");
});





























