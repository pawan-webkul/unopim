/**
 * Integration spec
 */
const { test, expect } = require('../../utils/fixtures');

const INT = {
  name: 'Admin User',
  updatedName: 'Admin Testing',
  assignUser: 'Example',
};

test.describe('UnoPim Integration Management', () => {
  test('Create Integration with empty Name field', async ({ integrationPage, adminPage }) => {
    await integrationPage.gotoCreate();
    await adminPage.getByRole('textbox', { name: 'Name' }).fill('');
    await adminPage.locator('input[name="admin_id"]').locator('..').locator('.multiselect__placeholder').click();
    await adminPage.getByRole('option', { name: INT.assignUser }).locator('span').first().click();
    await adminPage.getByRole('button', { name: 'Save' }).click();
    await expect(adminPage.getByText('The Name field is required')).toBeVisible();
  });

  test('Create Integration with empty Assign User field', async ({
    integrationPage,
    adminPage,
  }) => {
    await integrationPage.gotoCreate();
    await adminPage.getByRole('textbox', { name: 'Name' }).fill(INT.name);
    await adminPage.getByRole('button', { name: 'Save' }).click();
    await expect(adminPage.getByText('The Assign User field is required')).toBeVisible();
  });

  test('Create Integration with empty Name and Assign User field', async ({
    integrationPage,
    adminPage,
  }) => {
    await integrationPage.gotoCreate();
    await adminPage.getByRole('textbox', { name: 'Name' }).fill('');
    await adminPage.getByRole('button', { name: 'Save' }).click();
    await expect(adminPage.getByText('The Name field is required')).toBeVisible();
    await expect(adminPage.getByText('The Assign User field is required')).toBeVisible();
  });

  test('Create Integration', async ({ integrationPage, adminPage }) => {
    await integrationPage.gotoCreate();
    await adminPage.getByRole('textbox', { name: 'Name' }).fill(INT.name);
    await adminPage.locator('input[name="admin_id"]').locator('..').locator('.multiselect__placeholder').click();
    await adminPage.getByRole('option', { name: INT.assignUser }).locator('span').first().click();
    await adminPage.getByRole('button', { name: 'Save' }).click();
    await expect(adminPage.getByText(/API Integration Created Successfully/i)).toBeVisible();
  });

  test('should allow Integration search', async ({ integrationPage }) => {
    await integrationPage.goto();
    await integrationPage.search('Admin');
    await expect(integrationPage.page.locator(`text=${INT.name}`, { exact: true })).toBeVisible();
  });

  test('should open the filter menu when clicked', async ({ integrationPage }) => {
    await integrationPage.goto();
    await integrationPage.openFilter();
    await expect(integrationPage.page.getByText('Apply Filters')).toBeVisible();
  });

  test('should allow setting items per page', async ({ integrationPage }) => {
    await integrationPage.goto();
    await integrationPage.setItemsPerPage(20);
    await expect(integrationPage.page.getByRole('button', { name: '' })).toContainText('20');
  });

  test('should perform actions on an Integration (Edit, Delete)', async ({
    integrationPage,
    adminPage,
  }) => {
    await integrationPage.goto();
    const itemRow = adminPage.locator('div', { hasText: INT.name });
    await itemRow.locator('span[title="Edit"]').first().click();
    await expect(adminPage).toHaveURL(/\/admin\/integrations\/api-keys\/edit/);
    await integrationPage.goBack();
    await itemRow.locator('span[title="Delete"]').first().click();
    await expect(adminPage.locator('text=Are you sure you want to delete?')).toBeVisible();
  });

  test('Generate API key', async ({ integrationPage, adminPage }) => {
    await integrationPage.goto();
    const itemRow = adminPage.locator('div', { hasText: INT.name });
    await itemRow.locator('span[title="Edit"]').first().click();
    await adminPage.getByRole('button', { name: 'Generate' }).click();
    await expect(adminPage.getByText(/API key is generated successfully/i)).toBeVisible();
    await expect(adminPage.locator('#client_id')).not.toHaveValue('');
    await expect(adminPage.locator('#secret_key')).not.toHaveValue('');
  });

  test('Regenerate API key', async ({ integrationPage, adminPage }) => {
    await integrationPage.goto();
    const itemRow = adminPage.locator('div', { hasText: INT.name });
    await itemRow.locator('span[title="Edit"]').first().click();
    await adminPage.getByRole('button', { name: 'Re-Generate Secret Key' }).click();
    await expect(adminPage.getByText(/API secret key is regenerated successfully/i)).toBeVisible();
    await expect(adminPage.locator('#client_id')).not.toHaveValue('');
    await expect(adminPage.locator('#secret_key')).not.toHaveValue('');
  });

  test('Update Integration', async ({ integrationPage, adminPage }) => {
    await integrationPage.goto();
    const itemRow = adminPage.locator('div', { hasText: INT.name });
    await itemRow.locator('span[title="Edit"]').first().click();
    await adminPage.getByRole('textbox', { name: 'Name' }).fill(INT.updatedName);
    await adminPage.getByRole('button', { name: 'Save' }).click();
    await expect(adminPage.getByText(/API Integration is updated successfully/i)).toBeVisible();
  });

  test('Delete Integration', async ({ integrationPage, adminPage }) => {
    await integrationPage.goto();
    const itemRow = adminPage.locator('div', { hasText: INT.updatedName });
    await itemRow.locator('span[title="Delete"]').first().click();
    await adminPage.getByRole('button', { name: 'Delete' }).click();
    await expect(adminPage.getByText(/API Integration is deleted successfully/i)).toBeVisible();
  });
});
