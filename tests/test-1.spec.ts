import { test, expect } from "@playwright/test";

test("fusionww register flow - open register modal and interact", async ({
  page,
}) => {
  await page.goto("https://www.fusionww.com/");

  // Accept cookie banner if present and open account/register modal
  await page.getByRole("button", { name: "Accept all" }).click();
  await page.locator("#account-button").click();
  await page.getByRole("button", { name: "Register" }).click();

  // Interact with modal elements
  await page.locator(".Modal_titleWrapper__VtBVY > div").click();
  await page.getByRole("button", { name: "Register Now" }).click();
  await page.getByRole("textbox", { name: "First Name" }).click();
  await page.getByRole("textbox", { name: "Last Name" }).click();
  await page.getByRole("button", { name: "Geographical Region" }).click();
  await page.getByRole("option", { name: "Americas" }).click();
  await page.getByRole("textbox", { name: "Confirm Password" }).click();

  // Close the modal
  await page.getByRole("button", { name: "Close modal" }).click();
});
