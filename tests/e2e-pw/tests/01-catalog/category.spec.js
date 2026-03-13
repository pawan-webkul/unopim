/**
 * Category spec
 */
const { test, expect } = require('../../utils/fixtures');
const testData = require('../../config/test-data');

const { category: cat } = testData;

test.describe('UnoPim Category', () => {
  test('Create Categories with empty Code field', async ({ categoryPage }) => {
    await categoryPage.gotoCreate();
    await categoryPage.fillName(cat.name);
    await categoryPage.save();
    await expect(categoryPage.page.getByText('The code field is required')).toBeVisible();
  });

  test('Create Categories with empty Name field', async ({ categoryPage }) => {
    await categoryPage.gotoCreate();
    await categoryPage.fillCode(cat.code);
    await categoryPage.save();
    await expect(categoryPage.page.getByText('The Name field is required')).toBeVisible();
  });

  test('Create Categories with empty Code and Name field', async ({ categoryPage }) => {
    await categoryPage.gotoCreate();
    await categoryPage.fillCode('');
    await categoryPage.fillName('');
    await categoryPage.save();
    await expect(categoryPage.page.getByText('The code field is required')).toBeVisible();
    await expect(categoryPage.page.getByText('The Name field is required')).toBeVisible();
  });

  test('Create Categories with all fields', async ({ categoryPage }) => {
    await categoryPage.create({ code: cat.code, name: cat.name });
    await expect(categoryPage.page.getByText(/Category created successfully/i)).toBeVisible();
  });

  test('should allow category search', async ({ categoryPage }) => {
    await categoryPage.goto();
    await categoryPage.search(cat.code);
    await expect(
      categoryPage.page.locator(`text=${cat.name}${cat.name}${cat.code}`, { exact: true })
    ).toBeVisible();
  });

  test('should open the filter menu when clicked', async ({ categoryPage }) => {
    await categoryPage.goto();
    await categoryPage.openFilter();
    await expect(categoryPage.page.getByText('Apply Filters')).toBeVisible();
  });

  test('should allow setting items per page', async ({ categoryPage }) => {
    await categoryPage.goto();
    await categoryPage.setItemsPerPage(20);
    await expect(categoryPage.page.getByRole('button', { name: '' })).toContainText('20');
  });

  test('should perform actions on a category (Edit, Delete)', async ({ categoryPage }) => {
    await categoryPage.goto();
    const itemRow = categoryPage.page.locator('div', { hasText: 'root' });
    await itemRow.locator('span[title="Edit"]').first().click();
    await expect(categoryPage.page).toHaveURL(/\/admin\/catalog\/categories\/edit/);
    await categoryPage.goBack();
    await itemRow.locator('span[title="Delete"]').first().click();
    await expect(categoryPage.page.locator('text=Are you sure you want to delete?')).toBeVisible();
  });

  test('should allow selecting all categories with the mass action checkbox', async ({
    categoryPage,
  }) => {
    await categoryPage.goto();
    await categoryPage.selectAllRecords();
    await expect(categoryPage.page.locator('#mass_action_select_all_records')).toBeChecked();
  });

  test('Update Categories', async ({ categoryPage }) => {
    await categoryPage.goto();
    await categoryPage.search(cat.code);
    await categoryPage.clickEditForRow(`${cat.name}${cat.name}${cat.code}`);
    await categoryPage.fillName(cat.updatedName);
    await categoryPage.save();
    await expect(categoryPage.page.getByText(/Category updated successfully/i)).toBeVisible();
  });

  test('Delete Category', async ({ categoryPage }) => {
    await categoryPage.goto();
    await categoryPage.page
      .getByText(`${cat.updatedName}${cat.updatedName}${cat.code}`)
      .getByTitle('Delete')
      .click();
    await categoryPage.confirmDelete();
    await expect(
      categoryPage.page.getByText(/The category has been successfully deleted/i)
    ).toBeVisible();
  });

  test('Delete Root Category', async ({ categoryPage }) => {
    await categoryPage.goto();
    const itemRow = categoryPage.page.locator('div', { hasText: '[root][root]' });
    await itemRow.locator('span[title="Delete"]').first().click();
    await categoryPage.confirmDelete();
    await expect(
      categoryPage.page.getByText(
        /You cannot delete the root category that is associated with a channel./i
      )
    ).toBeVisible();
  });
});
