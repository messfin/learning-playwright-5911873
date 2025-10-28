import { test, expect } from "@playwright/test";

test.describe("Api challenge", () => {
  test("GET /products/{id}", async ({ request }) => {
    const apiUrl =
      process.env.API_URL || "https://practicesoftwaretesting.com/api";
    const getProductResponse = await request.get(
      apiUrl + "/products/search?q=thor%20hammer",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    expect(getProductResponse.status()).toBe(200);

    const contentType = getProductResponse.headers()["content-type"];
    if (!contentType || !contentType.includes("application/json")) {
      const text = await getProductResponse.text();
      test.fail(
        `Expected JSON response but got ${contentType}. Response: ${text.substring(
          0,
          200
        )}...`
      );
    }

    const productBody = await getProductResponse.json();
    const productId = productBody.data[0].id;

    const response = await request.get(apiUrl + "/products/" + productId, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    expect(response.status()).toBe(200);

    const responseContentType = response.headers()["content-type"];
    if (
      !responseContentType ||
      !responseContentType.includes("application/json")
    ) {
      const text = await response.text();
      test.fail(
        `Expected JSON response but got ${responseContentType}. Response: ${text.substring(
          0,
          200
        )}...`
      );
    }

    const body = await response.json();

    expect(body.in_stock).toBe(true);
    expect(body.is_location_offer).toBe(false);
    expect(body.is_rental).toBe(false);
    expect(body.name).toBe("Thor Hammer");
    expect(body.price).toBe(11.14);
    expect(body.price).toBeNumber();
  });
});
