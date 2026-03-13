const { test, expect } = require('../../utils/fixtures');
const testData = require('../../config/test-data');

test.describe('UnoPim login adminPage UI test cases', () => {

  test('Check the adminPage URL, title and Logo existence', async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.page).toHaveURL(/\/admin\/login/);
    await expect(loginPage.page).toHaveTitle(/Login/);
    await expect(loginPage.logo).toBeVisible();
  });

  test('Check with invalid credentials', async ({ loginPage }) => {
    await loginPage.login(testData.user.invalid.email, testData.user.invalid.password);
    await expect(loginPage.page.getByText('Invalid Email or Password')).toBeVisible();
  });

  test('Check with valid credentials', async ({ loginPage }) => {
    await loginPage.login(testData.user.valid.email, testData.user.valid.password);
    await expect(loginPage.page).toHaveURL(/\/admin\/dashboard/);
  });

  test('Check logout functionality', async ({ loginPage }) => {
    await loginPage.login(testData.user.valid.email, testData.user.valid.password);
    await loginPage.logout();
    await expect(loginPage.page).toHaveURL(/\/admin\/login/);
  });

  test('Check show and hide password functionality', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.fillPassword('password123');
    const passwordField = loginPage.page.locator('input[name="password"]');
    await expect(passwordField).toHaveAttribute('type', 'password');

    await loginPage.togglePasswordVisibility();
    await expect(passwordField).toHaveAttribute('type', 'text');

    await loginPage.togglePasswordVisibility();
    await expect(passwordField).toHaveAttribute('type', 'password');
  });

  test('Admin login adminPage UI verification', async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
    await expect(loginPage.page.getByText('Email', { exact: true })).toBeVisible();
    await expect(loginPage.page.getByText('Password', { exact: true })).toBeVisible();
    await expect(loginPage.page.getByRole('link', { name: 'Forgot Password?' })).toBeVisible();
    await expect(loginPage.page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(loginPage.page.getByText('UnoPim - (PIM Product Info Management)')).toBeVisible();
  });
});
