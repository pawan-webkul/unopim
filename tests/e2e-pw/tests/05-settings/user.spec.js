/**
 * User spec
 */
const { test, expect } = require('../../utils/fixtures');
const testData = require('../../config/test-data');

const { user: u, locale } = testData;

test.describe('UnoPim User Management', () => {
  test('Create User with empty name field', async ({ userPage }) => {
    await userPage.create({
      name: '',
      email: u.email,
      password: u.password,
      confirmPassword: u.password,
      uiLocale: locale.ui,
      timezoneSearch: locale.timezoneSearch,
      role: u.role,
    });
    await expect(userPage.page.getByText(/The Name field is required/i)).toBeVisible();
  });

  test('Create User with empty Email field', async ({ userPage }) => {
    await userPage.create({
      name: u.name,
      email: '',
      password: u.password,
      confirmPassword: u.password,
      uiLocale: locale.ui,
      timezoneSearch: locale.timezoneSearch,
      role: u.role,
    });
    await expect(userPage.page.getByText(/The Email field is required/i)).toBeVisible();
  });

  test('Create User with empty password field', async ({ userPage }) => {
    await userPage.create({
      name: u.name,
      email: u.email,
      password: '',
      confirmPassword: u.password,
      uiLocale: locale.ui,
      timezoneSearch: locale.timezoneSearch,
      role: u.role,
    });
    await expect(userPage.page.getByText(/The Password field is required/i)).toBeVisible();
  });

  test('Create User with empty confirm password field', async ({ userPage }) => {
    await userPage.create({
      name: u.name,
      email: u.email,
      password: u.password,
      confirmPassword: '',
      uiLocale: locale.ui,
      timezoneSearch: locale.timezoneSearch,
      role: u.role,
    });
    await expect(userPage.page.getByText(/The Password field is required/i)).toBeVisible();
  });

  test('Create User with different password in confirm password field', async ({ userPage }) => {
    await userPage.create({
      name: u.name,
      email: u.email,
      password: u.password,
      confirmPassword: u.wrongPassword,
      uiLocale: locale.ui,
      timezoneSearch: locale.timezoneSearch,
      role: u.role,
    });
    await expect(
      userPage.page.getByText(/The Password field confirmation does not match/i)
    ).toBeVisible();
  });

  test('Create User with empty UI locale field', async ({ userPage }) => {
    await userPage.create({
      name: u.name,
      email: u.email,
      password: u.password,
      confirmPassword: u.password,
      timezoneSearch: locale.timezoneSearch,
      role: u.role,
    });
    await expect(userPage.page.getByText(/The UI Locale field is required/i)).toBeVisible();
  });

  test('Create User with empty Timezone field', async ({ userPage }) => {
    await userPage.create({
      name: u.name,
      email: u.email,
      password: u.password,
      confirmPassword: u.wrongPassword,
      uiLocale: locale.ui,
      role: u.role,
    });
    await expect(userPage.page.getByText(/The Timezone field is required/i)).toBeVisible();
  });

  test('Create User with empty Role field', async ({ userPage }) => {
    await userPage.create({
      name: u.name,
      email: u.email,
      password: u.password,
      confirmPassword: u.wrongPassword,
      uiLocale: locale.ui,
      timezoneSearch: locale.timezoneSearch,
    });
    await expect(userPage.page.getByText(/The Role field is required/i)).toBeVisible();
  });

  test('Create User', async ({ userPage }) => {
    await userPage.create({
      name: u.name,
      email: u.email,
      password: u.password,
      confirmPassword: u.password,
      uiLocale: locale.ui,
      timezoneSearch: locale.timezoneSearch,
      role: u.role,
    });
    await expect(userPage.page.getByText(/User created successfully/i)).toBeVisible();
  });

  test('should allow User search', async ({ userPage }) => {
    await userPage.goto();
    await userPage.search('testing@example');
    await expect(
      userPage.page.locator(`text=${u.email}`, { exact: true })
    ).toBeVisible();
  });

  test('Update User', async ({ userPage }) => {
    await userPage.goto();
    await userPage.clickEditForRow(u.name);
    await userPage.toggleStatus();
    await userPage.save();
    await expect(userPage.page.getByText(/User updated successfully/i)).toBeVisible();
  });

  test('Delete User', async ({ userPage }) => {
    await userPage.goto();
    await userPage.clickDeleteForRow(u.name);
    await userPage.confirmDelete();
    await expect(userPage.page.getByText(/User deleted successfully/i)).toBeVisible();
  });

  test('Delete Default User', async ({ userPage }) => {
    await userPage.goto();
    await userPage.clickDeleteForRow('Example');
    await userPage.confirmDelete();
    await expect(userPage.page.getByText(/Last User delete failed/i)).toBeVisible();
  });
});
