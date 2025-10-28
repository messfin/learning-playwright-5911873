import { test, expect } from "@playwright/test";

test.describe("Api Test-passig value", () => {
  test("GET /products/{id}", async ({ request }) => {
    const apiUrl = "https://api.practicesoftwaretesting.com";
    const getProductResponse = await request.get(
      apiUrl + "/products/search?q=thor%20hammer"
    );
    expect(getProductResponse.status()).toBe(200);
    const productBody = await getProductResponse.json();
    const productId = productBody.data[0].id;
    //console.log("Product ID:", productId); // Log the product ID for debugging
   

    const response = await request.get(apiUrl + "/products/" + productId);
    console.log(apiUrl + "/products/" + productId);
    //console.log("Response:", await response.text()); // Log the full response for debugging
    expect(response.status()).toBe(200);
    const body = await response.json();
    //console.log(body); // Log the response body for debugging
    expect(body.in_stock).toBe(true);
    expect(body.is_location_offer).toBe(false);
    expect(body.is_rental).toBe(false);
    expect(body.name).toBe("Thor Hammer");
    expect(body.price).toBe(11.14);
  });
});
