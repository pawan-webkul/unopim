/**
 * Locales spec
 */
const { test, expect } = require('../../utils/fixtures');

const LOCALE = {
  code: 'af_ZA',
  fullName: 'af_ZAAfrikaans (South Africa)',
  existingCode: 'en_US',
};

test.describe('UnoPim Locale Management', () => {
  test('Delete Locale', async ({ localePage, adminPage }) => {
    await localePage.goto();
    const searchBox = adminPage.getByRole('textbox', { name: 'Search by code' });
    await searchBox.click();
    await searchBox.type(LOCALE.code);
    await adminPage.keyboard.press('Enter');
    await adminPage.waitForLoadState('networkidle');
    const itemRow = adminPage.locator('div', { hasText: LOCALE.fullName });
    await itemRow.locator('span[title="Delete"]').first().click();
    await localePage.confirmDelete();
    await expect(adminPage.getByText(/Locale deleted successfully/i)).toBeVisible();
  });

  test('Create locale with empty Code field', async ({ localePage, adminPage }) => {
    await localePage.goto();
    await adminPage.getByRole('button', { name: 'Create Locale' }).click();
    await adminPage.getByRole('textbox', { name: 'Code', exact: true }).fill('');
    await adminPage.locator('label[for="status"]').click();
    await adminPage.getByRole('button', { name: 'Save Locale' }).click();
    await expect(adminPage.getByText(/The Code field is required/i)).toBeVisible();
  });

  test('Create locale with existing Code value', async ({ localePage, adminPage }) => {
    await localePage.goto();
    await adminPage.getByRole('button', { name: 'Create Locale' }).click();
    await adminPage.getByRole('textbox', { name: 'Code', exact: true }).fill(LOCALE.existingCode);
    await adminPage.locator('label[for="status"]').click();
    await adminPage.getByRole('button', { name: 'Save Locale' }).click();
    await expect(adminPage.getByText(/The code has already been taken./i)).toBeVisible();
  });

  test('Create locale', async ({ localePage, adminPage }) => {
    await localePage.goto();
    await adminPage.getByRole('button', { name: 'Create Locale' }).click();
    await adminPage.getByRole('textbox', { name: 'Code', exact: true }).fill(LOCALE.code);
    await adminPage.locator('label[for="status"]').click();
    await adminPage.getByRole('button', { name: 'Save Locale' }).click();
    await expect(adminPage.getByText(/Locale created successfully/i)).toBeVisible();
  });

  test('Update Locale', async ({ localePage, adminPage }) => {
    await localePage.goto();
    const searchBox = adminPage.getByRole('textbox', { name: 'Search by code' });
    await searchBox.click();
    await searchBox.type(LOCALE.code);
    await adminPage.keyboard.press('Enter');
    await adminPage.waitForLoadState('networkidle');
    const itemRow = adminPage.locator('div', { hasText: LOCALE.fullName });
    await itemRow.locator('span[title="Edit"]').first().click();
    await adminPage.locator('label[for="status"]').click();
    await adminPage.getByRole('button', { name: 'Save Locale' }).click();
    await expect(adminPage.getByText(/Locale Updated successfully/i)).toBeVisible();
  });

  test('Delete Enabled Locale', async ({ localePage, adminPage }) => {
    await localePage.goto();
    const itemRow = adminPage.locator('div', { hasText: 'Enabled' });
    await itemRow.locator('span[title="Delete"]').first().click();
    await localePage.confirmDelete();
    await expect(
      adminPage.getByText(/You cannot delete a locale linked to a channel or user/i)
    ).toBeVisible();
  });
});
