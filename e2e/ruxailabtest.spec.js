const { test, expect } = require('@playwright/test');

const logIn = async (page) => {
  await page.goto('/signin');

  await page.getByLabel('E-mail').fill('testemail@gmail.com');
  await page.getByLabel('Password', { exact: true }).fill('password123');

  await page.getByRole('main').getByRole('button', { name: 'Sign-In' }).click();
};

const createTest = async (page, type) => {
  await page.click('button.v-btn--fixed'); // Simplified selector
  await page.click('.card-title:has-text("Create a blank test")');

  if (type === 'heuristic') {
    await page.click('.card.col-sm-10.col-md-5.col-10');
  } else if (type === 'usability') {
    await page.click('.card.col-sm-10.col-md-5.col-12');
  }

  await page.getByRole('textbox', { name: 'Test Name' }).fill('Test heuristic playwright');
  await page.getByRole('textbox', { name: 'Test Description' }).fill('Some description');

  await page.click('.v-btn--has-bg.orange');

  if (type === 'usability') {
    await page.click('.card.col-sm-10.col-md-4.col-10');
  }

  await page.click('.console-button');
};

test.describe('Link Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);
  });

  test('has link page', async ({ page }) => {
    try {
      await test.step('Navigate to signin page', async () => {
        await page.goto('http://localhost:8080/signin', {
          waitUntil: 'networkidle',
          timeout: 45000,
        });
      });

      await test.step('Check if #app is visible', async () => {
        await expect(page.locator('#app')).toBeVisible({ timeout: 30000 });
      });

      await test.step('Check page title', async () => {
        await expect(page).toHaveTitle(/RUXAILAB/, { timeout: 30000 });
      });

      await page.screenshot({
        path: 'debug-screenshot.png',
        fullPage: true,
      });
    } catch (error) {
      console.error('Test failure:', error);
      console.error('At URL:', page.url());
      throw error;
    }
  });
});

test('Sign in and create heuristic test', async ({ page }) => {
  await logIn(page);
  await createTest(page, 'heuristic');
});

test('Sign in and create usability test', async ({ page }) => {
  await logIn(page);
  await createTest(page, 'usability');
});

test('Failure on empty heuristic test name', async ({ page }) => {
  await logIn(page);

  await page.click('button.v-btn--fixed');
  await page.click('.card-title:has-text("Create a blank test")');
  await page.click('.card.col-sm-10.col-md-5.col-12'); // Select usability
  await page.getByRole('textbox', { name: 'Test Description' }).fill('Some description');
  await page.click('.v-btn--has-bg.orange');

  const errorMessage = page.locator('div[role="alert"]');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText('Enter a Title');
});
