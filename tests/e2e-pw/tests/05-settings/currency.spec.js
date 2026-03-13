/**
 * Currency spec
 */
const { test, expect } = require('../../utils/fixtures');

// Currency test data local to this spec
const CUR = {
  code: 'VND',
  symbol: '₫',
  decimal: '2',
  shortCode: 'gh',
  longCode: 'ghdn',
  fullName: 'VNDVietnamese Dong',
};

test.describe('UnoPim Currency Management', () => {
  test('Create Currency with empty Code field', async ({ adminPage, currencyPage }) => {
    await currencyPage.goto();
    await adminPage.getByRole('button', { name: 'Create Currency' }).click();
    await adminPage.getByRole('textbox', { name: 'Code', exact: true }).fill('');
    await adminPage.getByRole('textbox', { name: 'Symbol' }).fill(CUR.symbol);
    await adminPage.click('input[type="number"][name="decimal"]');
    await adminPage.fill('input[type="number"][name="decimal"]', CUR.decimal);
    await adminPage.locator('label[for="status"]').click();
    await adminPage.getByRole('button', { name: 'Save Currency' }).click();
    await expect(adminPage.getByText(/The Code field is required/i)).toBeVisible();
  });

  test('Create Currency with Code less than 3 characters', async ({ adminPage, currencyPage }) => {
    await currencyPage.goto();
    await adminPage.getByRole('button', { name: 'Create Currency' }).click();
    await adminPage.getByRole('textbox', { name: 'Code', exact: true }).fill(CUR.shortCode);
    await adminPage.getByRole('textbox', { name: 'Symbol' }).fill(CUR.symbol);
    await adminPage.click('input[type="number"][name="decimal"]');
    await adminPage.fill('input[type="number"][name="decimal"]', CUR.decimal);
    await adminPage.locator('label[for="status"]').click();
    await adminPage.getByRole('button', { name: 'Save Currency' }).click();
    await expect(
      adminPage.getByText(/The code must be at least 3 characters./i)
    ).toBeVisible();
  });

  test('Create Currency with Code more than 3 characters', async ({ adminPage, currencyPage }) => {
    await currencyPage.goto();
    await adminPage.getByRole('button', { name: 'Create Currency' }).click();
    await adminPage.getByRole('textbox', { name: 'Code', exact: true }).fill(CUR.longCode);
    await adminPage.getByRole('textbox', { name: 'Symbol' }).fill(CUR.symbol);
    await adminPage.click('input[type="number"][name="decimal"]');
    await adminPage.fill('input[type="number"][name="decimal"]', CUR.decimal);
    await adminPage.locator('label[for="status"]').click();
    await adminPage.getByRole('button', { name: 'Save Currency' }).click();
    await expect(
      adminPage.getByText(/The code may not be greater than 3 characters./i)
    ).toBeVisible();
  });

  test('Create Currency', async ({ adminPage, currencyPage }) => {
    await currencyPage.goto();
    await adminPage.getByRole('button', { name: 'Create Currency' }).click();
    await adminPage.getByRole('textbox', { name: 'Code', exact: true }).fill(CUR.code);
    await adminPage.getByRole('textbox', { name: 'Symbol' }).fill(CUR.symbol);
    await adminPage.click('input[type="number"][name="decimal"]');
    await adminPage.fill('input[type="number"][name="decimal"]', CUR.decimal);
    await adminPage.locator('label[for="status"]').click();
    await adminPage.getByRole('button', { name: 'Save Currency' }).click();
    await expect(adminPage.getByText(/Currency created successfully/i)).toBeVisible();
  });

  test('should allow Currency search', async ({ currencyPage, adminPage }) => {
    await currencyPage.goto();
    const searchBox = adminPage.getByRole('textbox', { name: 'Search by code or id' });
    await searchBox.click();
    await searchBox.type('VN');
    await adminPage.keyboard.press('Enter');
    await expect(adminPage.locator(`text=${CUR.code}`, { exact: true })).toBeVisible();
  });

  test('Update Currency', async ({ currencyPage, adminPage }) => {
    await currencyPage.goto();
    const searchBox = adminPage.getByRole('textbox', { name: 'Search by code or id' });
    await searchBox.click();
    await searchBox.type('vnd');
    await adminPage.keyboard.press('Enter');
    const itemRow = adminPage.locator('div', { hasText: CUR.fullName });
    await itemRow.locator('span[title="Edit"]').first().click();
    await adminPage.click('input[type="number"][name="decimal"]');
    await adminPage.fill('input[type="number"][name="decimal"]', CUR.decimal);
    await adminPage.locator('label[for="status"]').click();
    await adminPage.getByRole('button', { name: 'Save Currency' }).click();
    await expect(adminPage.getByText(/Currency updated successfully/i)).toBeVisible();
  });

  test('Delete Currency', async ({ currencyPage, adminPage }) => {
    await currencyPage.goto();
    const searchBox = adminPage.getByRole('textbox', { name: 'Search by code or id' });
    await searchBox.click();
    await searchBox.type('vnd');
    await adminPage.keyboard.press('Enter');
    const itemRow = adminPage.locator('div', { hasText: CUR.fullName });
    await itemRow.locator('span[title="Delete"]').first().click();
    await adminPage.getByRole('button', { name: 'Delete' }).click();
    await expect(adminPage.getByText(/Currency deleted successfully/i)).toBeVisible();
  });

  test('Delete Enabled Currency', async ({ currencyPage, adminPage }) => {
    await currencyPage.goto();
    const itemRow = adminPage.locator('div', { hasText: 'Enabled' });
    await itemRow.locator('span[title="Delete"]').first().click();
    await adminPage.getByRole('button', { name: 'Delete' }).click();
    await expect(
      adminPage.getByText(/You cannot delete a currency linked to a channel/i)
    ).toBeVisible();
  });
});
