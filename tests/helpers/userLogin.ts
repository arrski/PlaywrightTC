import {type Page } from '@playwright/test';

export async function UserLogsIn(page: Page, user: string, pass: string) {
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill(user);
  await page.locator('[data-test="username"]').press('Tab');
  await page.locator('[data-test="password"]').fill(pass);
  await page.locator('[data-test="login-button"]').click();
}
