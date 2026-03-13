/**
 * Webhook spec
 */
const { test, expect } = require('../../utils/fixtures');

const WH = {
  validUrl: 'https://example.com/webhook',
  invalidUrl: 'invalid-url',
};

test.describe('UnoPim Webhook test cases', () => {
  test('Check the webhook option after installation', async ({ adminPage }) => {
    await expect(adminPage.getByRole('link', { name: ' Configuration' })).toBeVisible();
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await expect(adminPage.getByRole('link', { name: 'Webhook' })).toBeVisible();
  });

  test('Check that webhook is clickable', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    const link = adminPage.getByRole('link', { name: 'Webhook' });
    await expect(link).toBeVisible();
    await expect(link).toBeEnabled();
  });

  test('Check the URL of the webhook page', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    await expect(adminPage).toHaveURL(/.*\/admin\/webhook\/settings/);
  });

  test('Check the page after clicking webhook', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    await expect(adminPage).toHaveURL(/.*\/admin\/webhook\/settings/);
    await expect(adminPage.getByText('Webhook Settings')).toBeVisible();
  });

  test('Check the fields in the webhook page', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    const activeLabel = adminPage.locator('label[for="webhook_active"]');
    await expect(activeLabel).toBeVisible();
    await expect(activeLabel).toBeEnabled();
    const urlField = adminPage.locator('input[name="webhook_url"]');
    await expect(urlField).toBeVisible();
    await expect(urlField).toBeEnabled();
    const saveBtn = adminPage.getByRole('button', { name: 'Save' });
    await expect(saveBtn).toBeVisible();
    await expect(saveBtn).toBeEnabled();
  });

  test('Check saving webhook settings with empty field', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    await adminPage.getByRole('button', { name: 'Save' }).click();
    await expect(adminPage.getByText('The Webhook URL field is required')).toBeVisible();
  });

  test('Check saving webhook URL with invalid random string', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    await adminPage.locator('input[name="webhook_url"]').fill(WH.invalidUrl);
    await adminPage.getByRole('button', { name: 'Save' }).click();
    await expect(adminPage.getByText('The webhook url format is invalid.')).toBeVisible();
  });

  test('Check saving webhook URL with valid URL', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    await adminPage.locator('input[name="webhook_url"]').fill(WH.validUrl);
    await adminPage.getByRole('button', { name: 'Save' }).click();
    await expect(adminPage.getByText('Webhook settings saved successfully')).toBeVisible();
  });

  test('Check toggling the webhook active checkbox', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    const webhookActiveCheckbox = adminPage.locator('label[for="webhook_active"]');
    const isCheckedBefore = await webhookActiveCheckbox.isChecked();
    await webhookActiveCheckbox.click();
    const isCheckedAfter = await webhookActiveCheckbox.isChecked();
    expect(isCheckedBefore).not.toBe(isCheckedAfter);
  });

  test('Check that webhook settings persist after saving', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    const urlField = adminPage.locator('input[name="webhook_url"]');
    const activeCheckbox = adminPage.locator('label[for="webhook_active"]');
    await urlField.fill(WH.validUrl);
    const isCheckedBefore = await activeCheckbox.isChecked();
    await adminPage.getByRole('button', { name: 'Save' }).click();
    await expect(adminPage.getByText('Webhook settings saved successfully')).toBeVisible();
    await adminPage.reload();
    const savedUrl = await urlField.inputValue();
    const isCheckedAfter = await activeCheckbox.isChecked();
    expect(savedUrl).toBe(WH.validUrl);
    expect(isCheckedBefore).toBe(isCheckedAfter);
  });

  test('Check the log section is visible and clickable', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    const logSection = adminPage.getByRole('link', { name: 'Logs' });
    await expect(logSection).toBeVisible();
    await expect(logSection).toBeEnabled();
  });

  test('Check the URL of the log section in webhook page', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    await adminPage.getByRole('link', { name: 'Logs' }).click();
    await expect(adminPage).toHaveURL(/admin\/webhook\/settings.*logs/);
  });

  test('Check the content of the log section', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    await adminPage.getByRole('link', { name: 'Logs' }).click();
    await expect(adminPage.getByText('Webhook Logs')).toBeVisible();
    await expect(adminPage.getByText('No Records Available.')).toBeVisible();
  });

  test('Check the presence of columns in the log section', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    await adminPage.getByRole('link', { name: 'Logs' }).click();
    await expect(adminPage.getByText('ID')).toBeVisible();
    await expect(adminPage.getByText('Date/Time')).toBeVisible();
    await expect(adminPage.getByText('SKU')).toBeVisible();
    await expect(adminPage.getByText('User', { exact: true })).toBeVisible();
    await expect(adminPage.getByText('Status')).toBeVisible();
    await expect(adminPage.getByText('Actions')).toBeVisible();
  });

  test('Check the webhook log filtering options', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    await adminPage.getByRole('link', { name: 'Logs' }).click();
    await adminPage.getByText('Filter', { exact: true }).click();
    await expect(adminPage.getByText('Apply Filters')).toBeVisible();
    await expect(adminPage.locator('input[name="sku"]')).toBeVisible();
    await expect(adminPage.locator('input[name="user"]')).toBeVisible();
    await expect(adminPage.locator('input[name="status"]')).toBeVisible();
    await expect(adminPage.getByText('Save')).toBeVisible();
  });

  test('Check the search bar in the webhook log section', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    await adminPage.getByRole('link', { name: 'Logs' }).click();
    const searchBar = adminPage.getByRole('textbox', { name: 'Search' });
    await expect(searchBar).toBeVisible();
    await expect(searchBar).toBeEnabled();
  });

  test('Check the history section on the webhook page', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    const historySection = adminPage.getByRole('link', { name: 'History' });
    await expect(historySection).toBeVisible();
    await expect(historySection).toBeEnabled();
  });

  test('Check the URL of the history section', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    await adminPage.getByRole('link', { name: 'History' }).click();
    await expect(adminPage).toHaveURL(/admin\/webhook\/settings.*history/);
  });

  test('Check the columns of the history section', async ({ adminPage }) => {
    await adminPage.getByRole('link', { name: ' Configuration' }).click();
    await adminPage.getByRole('link', { name: 'Webhook' }).click();
    await adminPage.getByRole('link', { name: 'History' }).click();
    await expect(adminPage.getByText('Date / Time')).toBeVisible();
    await expect(adminPage.getByText('Version', { exact: true })).toBeVisible();
    await expect(adminPage.getByText('User', { exact: true })).toBeVisible();
    await expect(adminPage.getByText('Actions')).toBeVisible();
  });
});
