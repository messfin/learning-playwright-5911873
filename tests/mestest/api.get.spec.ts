import { test, expect } from "@playwright/test";

test("GET /products", async ({ request }) => {
  const apiUrl = "https://api.practicesoftwaretesting.com";
  const response = await request.get(apiUrl + "/products");

  expect(response.status()).toBe(200);
  const body = await response.json();
  console.log(body); // Log the response body for debugging
  expect(body.data.length).toBe(9);
  expect(body.total).toBe(53);
});
