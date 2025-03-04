import { test, expect, type Page } from '@playwright/test';
import { UserLogsIn as UserLogsIn } from './helpers/userLogin';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
});


test.describe('test if loging fails sucessfully', () => {
  test('test if loging fails sucessfully', async ({ page }) => {

    await UserLogsIn(page,'standard_user', 'wrong_password');

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
  });
});


test.describe('test if loging is sucessfully', () => {
  test('test if loging is sucessfully', async ({ page }) => {

    await UserLogsIn(page, 'standard_user','secret_sauce');  
    await expect(page.getByText('Products')).toBeVisible();
  });
});


test.describe('test if add to cart button works', () => {
  test('test add to cart buttons', async ({ page }) => {

    await UserLogsIn(page, 'standard_user', 'secret_sauce');   
    await addItemToBasket(page, 3);

    await page.locator('//*[@id="shopping_cart_container"]/a').click();
    await expect(page.getByText('Your Cart')).toBeVisible();

    const items = page.getByRole('button', {name: 'REMOVE'});
    const items_count = await items.count();
    console.log(`Found ${items} 'REMOVE' buttons`);
    expect(items_count).toBe(3); 
  });
});


test.describe('test if remove from cart button works', () => {
  test('test remove from cart buttons', async ({ page }) => {

    await UserLogsIn(page, 'standard_user', 'secret_sauce');   
    await addItemToBasket(page, 3);

    await page.locator('//*[@id="shopping_cart_container"]/a').click();
    await expect(page.getByText('Your Cart')).toBeVisible();

    const items = page.getByRole('button', {name: 'REMOVE'});
    const items_count = await items.count();
    console.log(`Found ${items_count} 'REMOVE' buttons`);
    expect(items_count).toBe(3); 

    await removeItemFromBasket(items);
    const basket_item = page.locator('.removed_cart_item').first();
    await expect(basket_item).not.toBeVisible();
  });
});


[
  { user: 'locked_out_user'},
  { user: 'problem_user'},
  { user: 'performance_glitch_user'},
].forEach(({ user }) => {
  test.describe('test all users can log in', () => {
    test(`test ${user} all accounts can log in properly`, async ({ page }) => {
        const pass = 'secret_sauce'
        await UserLogsIn(page, user, pass);
        if (user === 'locked_out_user') {
          const errorMessage = page.locator('[data-test="error"]');
          await expect(errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
        }
        else {await expect(page.getByText('Products')).toBeVisible();}
    });
  });
});



async function addItemToBasket(page: Page, numberOfItems: number) {
  const addToCartButtons = page.getByRole('button', {name: 'ADD TO CART'});

  const count = await addToCartButtons.count();
  console.log(`Found ${count} 'ADD TO CART' buttons before adding`);

  for (let i = 0; i < numberOfItems; i++) {
    console.log(`Clicking ${i + 1} 'ADD TO CART' button`);
    await addToCartButtons.nth(i).click();
  }
}


async function removeItemFromBasket(items) {
  const count = await items.count();
  console.log(`Found ${count} 'REMOVE' buttons before removing`);

  for (let i = count - 1; i >= 0; i--) {
    console.log(`Clicking ${i + 1} 'REMOVE' button`);
    await items.nth(i).click();
  }
}