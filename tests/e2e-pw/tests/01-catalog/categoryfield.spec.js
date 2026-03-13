/**
 * Category Field spec
 */
const { test, expect } = require('../../utils/fixtures');

// Category field data – uses its own data since it collides with category's 'test1'
const CF = {
  code: 'test1',
  name: 'Suggestion',
  updatedName: 'Suggestion Updated',
};

test.describe('UnoPim Category Field', () => {
  test('Create category field with empty Code', async ({ categoryFieldPage }) => {
    await categoryFieldPage.gotoCreate();
    await categoryFieldPage.selectType('Text');
    await categoryFieldPage.fillName(CF.name);
    await categoryFieldPage.save();
    await expect(categoryFieldPage.page.getByText('The Code field is required')).toBeVisible();
  });

  test('Create category field with empty Type', async ({ categoryFieldPage }) => {
    await categoryFieldPage.gotoCreate();
    await categoryFieldPage.fillCode(CF.code);
    await categoryFieldPage.fillName(CF.name);
    await categoryFieldPage.save();
    await expect(categoryFieldPage.page.getByText('The Type field is required')).toBeVisible();
  });

  test('Create category field with empty Code and Type', async ({ categoryFieldPage }) => {
    await categoryFieldPage.gotoCreate();
    await categoryFieldPage.fillCode('');
    await categoryFieldPage.fillName(CF.name);
    await categoryFieldPage.save();
    await expect(categoryFieldPage.page.getByText('The Code field is required')).toBeVisible();
    await expect(categoryFieldPage.page.getByText('The Type field is required')).toBeVisible();
  });

  test('Create category field', async ({ categoryFieldPage }) => {
    await categoryFieldPage.create({ code: CF.code, type: 'Text', name: CF.name });
    await expect(
      categoryFieldPage.page.getByText(/Category Field Created Successfully/i)
    ).toBeVisible();
  });

  test('should allow category field search', async ({ categoryFieldPage }) => {
    await categoryFieldPage.goto();
    await categoryFieldPage.search('tes');
    await expect(categoryFieldPage.page.locator('text=1 Results')).toBeVisible();
    await expect(categoryFieldPage.page.locator(`text=${CF.code}`, { exact: true })).toBeVisible();
  });

  test('should open the filter menu when clicked', async ({ categoryFieldPage }) => {
    await categoryFieldPage.goto();
    await categoryFieldPage.openFilter();
    await expect(categoryFieldPage.page.getByText('Apply Filters')).toBeVisible();
  });

  test('should allow setting items per page', async ({ categoryFieldPage }) => {
    await categoryFieldPage.goto();
    await categoryFieldPage.setItemsPerPage(20);
    await expect(categoryFieldPage.page.getByRole('button', { name: '' })).toContainText('20');
  });

  test('should perform actions on a category field (Edit, Delete)', async ({
    categoryFieldPage,
  }) => {
    await categoryFieldPage.goto();
    const itemRow = categoryFieldPage.page.locator('div', { hasText: 'name' });
    await itemRow.locator('span[title="Edit"]').first().click();
    await expect(categoryFieldPage.page).toHaveURL(/\/admin\/catalog\/category-fields\/edit/);
    await categoryFieldPage.goBack();
    await itemRow.locator('span[title="Delete"]').first().click();
    await expect(
      categoryFieldPage.page.locator('text=Are you sure you want to delete?')
    ).toBeVisible();
  });

  test('should allow selecting all category fields with the mass action checkbox', async ({
    categoryFieldPage,
  }) => {
    await categoryFieldPage.goto();
    await categoryFieldPage.selectAllRecords();
    await expect(categoryFieldPage.page.locator('#mass_action_select_all_records')).toBeChecked();
  });

  test('update category field', async ({ categoryFieldPage }) => {
    await categoryFieldPage.goto();
    await categoryFieldPage.page
      .getByText(`${CF.code}${CF.name}`)
      .getByTitle('Edit')
      .click();
    await categoryFieldPage.fillName(CF.updatedName);
    await categoryFieldPage.save();
    await expect(
      categoryFieldPage.page.getByText(/Category Field Updated Successfully/i)
    ).toBeVisible();
  });

  test('delete category field', async ({ categoryFieldPage }) => {
    await categoryFieldPage.goto();
    await categoryFieldPage.page
      .getByText(`${CF.code}${CF.updatedName}`)
      .getByTitle('Delete')
      .click();
    await categoryFieldPage.confirmDelete();
    await expect(
      categoryFieldPage.page.getByText(/Category Field Deleted Successfully/i)
    ).toBeVisible();
  });

  test('delete default category field', async ({ categoryFieldPage }) => {
    await categoryFieldPage.goto();
    await categoryFieldPage.page.getByText('nameName').getByTitle('Delete').click();
    await categoryFieldPage.confirmDelete();
    await expect(
      categoryFieldPage.page.getByText(/This category field can not be deleted./i)
    ).toBeVisible();
  });
});
