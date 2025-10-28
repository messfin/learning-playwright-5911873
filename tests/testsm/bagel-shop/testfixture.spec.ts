import { expect, test } from '@playwright/test'; // Added semicolon

test('Sign In button is visible', async ({ page }) => { 
  await page.goto('https://binaryville.com/account'); 
  const signInButton = page.getByRole('button', { name: 'Sign in' }); 
  await expect(signInButton).toBeVisible(); 
}); 