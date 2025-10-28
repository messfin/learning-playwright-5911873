import { test, expect } from "@playwright/test";

test("GET /products", async ({ request }) => {
  const apiUrl = "https://api.practicesoftwaretesting.com";
  const response = await request.get(apiUrl + "/products");

  expect(response.status()).toBe(200);

  // Check if response is JSON before parsing
  const contentType = response.headers()["content-type"];
  expect(contentType).toContain("application/json");

  const body = await response.json();
  expect(body.data.length).toBe(9);
  expect(body.total).toBe(53);
});

test("POST /users/login", async ({ request }) => {
  const apiUrl = "https://api.practicesoftwaretesting.com";
  const response = await request.post(apiUrl + "/users/login", {
    data: {
      email: "customer@practicesoftwaretesting.com",
      password: "welcome01",
    },
  });

  expect(response.status()).toBe(200);

  // Check if response is JSON before parsing
  const contentType = response.headers()["content-type"];
  expect(contentType).toContain("application/json");

  const body = await response.json();
  expect(body.access_token).toBeTruthy();
});
