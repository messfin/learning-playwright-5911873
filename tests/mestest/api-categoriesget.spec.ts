import { test, expect } from "@playwright/test";

// Apply auth state for this file
test.use({ storageState: ".auth/customer01.json" });

test("GET /categories", async ({ request }) => {
  const apiUrl = "https://api.practicesoftwaretesting.com";
  const response = await request.get(apiUrl + "/categories/tree");

  expect(response.status()).toBe(200);
 
  const body = await response.json();
  console.log(body);
});
