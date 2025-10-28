const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { getPage } = require("../browserSetup");

Given("the user is on the login page", async () => {
  await getPage().goto("https://binaryville.com/account/");
});

When("the user enters a valid email and password", async () => {
  await getPage().getByRole("textbox", { name: "Email" }).fill("test@example.com");
  await getPage().getByRole("textbox", { name: "Password" }).fill("pass123");
});

Then("the user should see their email and password in the URL", async () => {
  await getPage().getByRole("button", { name: "Sign in" }).click();
  await expect(getPage()).toHaveURL(/test%40example.com/);
  await expect(getPage()).toHaveURL(/pass123/);
});





























