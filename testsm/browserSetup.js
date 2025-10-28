const { chromium } = require("@playwright/test");

let browser;
let page;

async function setupBrowser() {
  browser = await chromium.launch();
  const context = await browser.newContext();
  page = await context.newPage();
  return page;
}

function getPage() {
  if (!page) {
    throw new Error("Browser not initialized. Call setupBrowser() first.");
  }
  return page;
}

// Browser will be initialized by hooks

module.exports = {
  setupBrowser,
  getPage
};
