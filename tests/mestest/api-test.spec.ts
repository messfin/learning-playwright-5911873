import { test, expect } from "@playwright/test";

test("GET /products - extract first two", async ({ request }) => {
  const apiUrl = "https://api.practicesoftwaretesting.com";
  const response = await request.get(apiUrl + "/products");

  expect(response.status()).toBe(200);

  const body = await response.json();

  // Validate total count as before
  expect(body.data.length).toBeGreaterThanOrEqual(2);
  expect(body.total).toBe(53);

  // Extract first two products
  const firstProduct = body.data[0];
  const secondProduct = body.data[1];

  console.log("First product:");
  console.log("ID:", firstProduct.id);
  console.log("Name:", firstProduct.name);
  console.log("Price:", firstProduct.price);

  console.log("Second product:");
  console.log("ID:", secondProduct.id);
  console.log("Name:", secondProduct.name);
  console.log("Price:", secondProduct.price);

  // Optional: assert they have required fields
  expect(firstProduct).toHaveProperty("id");
  expect(firstProduct).toHaveProperty("name");
  expect(firstProduct).toHaveProperty("price");

  expect(secondProduct).toHaveProperty("id");
  expect(secondProduct).toHaveProperty("name");
  expect(secondProduct).toHaveProperty("price");
});
