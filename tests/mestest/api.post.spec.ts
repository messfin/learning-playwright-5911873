import { test, expect } from "@playwright/test";

test("POST /users/login", async ({ request }) => {
  const apiUrl = "https://api.practicesoftwaretesting.com";
  const response = await request.post(apiUrl + "/users/login", {
    data: {
      email: "customer@practicesoftwaretesting.com",
      password: "welcome01",
    },
  });
  console.log(await response.json());// Log the response body for debugging
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.access_token).toBeTruthy();
  expect(body.token_type).toBe("bearer");
  expect(body.expires_in).toBe(300); ;
});
