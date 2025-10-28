import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  await page.getByRole('link', { name: 'Practice Software Testing -' }).click();
  await page.getByTestId('nav-home').click();
});