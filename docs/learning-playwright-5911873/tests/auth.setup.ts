import { test } from '@fixtures/base.fixture';

test.describe('Authentication Setup', () => {
  test('should sign in and save storage state', async ({ context }) => {
    const page = await context.newPage();
    
    // Navigate to the login page
    await page.goto('https://www.fusionww.com/login');

    // Fill in login form
    await page.fill('[data-test="email-input"]', 'john.doe@example.com');
    await page.fill('[data-test="password-input"]', 'password123');

    // Click the login button
    await page.click('[data-test="login-submit"]');

    // Wait for navigation after login
    await page.waitForNavigation();

    // Save the storage state to a file
    await context.storageState({ path: '.auth/customer01.json' });

    // Close the page
    await page.close();
  });
});