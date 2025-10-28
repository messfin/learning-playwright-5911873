import { test, expect } from "@playwright/test";

test("GET /products", async ({ request }) => {
  const apiUrl =
    process.env.API_URL || "https://practicesoftwaretesting.com/api";
  const response = await request.get(apiUrl + "/products", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  expect(response.status()).toBe(200);

  const contentType = response.headers()["content-type"];
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    test.fail(
      `Expected JSON response but got ${contentType}. Response: ${text.substring(
        0,
        200
      )}...`
    );
  }

  const body = await response.json();
  expect(body.data.length).toBe(9);
  expect(body.total).toBe(50);
});

test("POST /users/login", async ({ request }) => {
  const apiUrl =
    process.env.API_URL || "https://practicesoftwaretesting.com/api";
  const response = await request.post(apiUrl + "/users/login", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {
      email: "customer@practicesoftwaretesting.com",
      password: "welcome01",
    },
  });

  expect(response.status()).toBe(200);

  const contentType = response.headers()["content-type"];
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    test.fail(
      `Expected JSON response but got ${contentType}. Response: ${text.substring(
        0,
        200
      )}...`
    );
  }

  const body = await response.json();
  expect(body.access_token).toBeTruthy();
});
