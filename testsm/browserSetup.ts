import { chromium, Browser, Page } from "@playwright/test";

let browser: Browser;
let page: Page;

export async function setupBrowser() {
  browser = await chromium.launch();
  const context = await browser.newContext();
  page = await context.newPage();
  return page;
}

export function getPage() {
  return page;
}
