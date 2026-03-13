/**
 * Attribute Group spec
 */
const { test, expect } = require('../../utils/fixtures');

// Attribute group test data is stored inline here since attributegroup uses
// specific data (`product_description`) not shared with other suites.
const AG = {
  code: 'product_description',
  name: 'Product Description',
  updatedName: 'Product Description Updated',
};

test.describe('UnoPim Attribute Groups', () => {
  test('Create Attribute Group with empty Code field', async ({ attributeGroupPage }) => {
    await attributeGroupPage.gotoCreate();
    await attributeGroupPage.fillCode('');
    await attributeGroupPage.fillName(AG.name);
    await attributeGroupPage.save();
    await expect(attributeGroupPage.page.getByText('The Code field is required')).toBeVisible();
  });

  test('Create Attribute Group', async ({ attributeGroupPage }) => {
    await attributeGroupPage.create({ code: AG.code, name: AG.name });
    await expect(
      attributeGroupPage.page.getByText(/Attribute Group Created Successfully/i)
    ).toBeVisible();
  });

  test('should allow attribute group search', async ({ attributeGroupPage }) => {
    await attributeGroupPage.goto();
    await attributeGroupPage.search('product');
    await expect(
      attributeGroupPage.page.locator(`text=${AG.code}`, { exact: true })
    ).toBeVisible();
  });

  test('should open the filter menu when clicked', async ({ attributeGroupPage }) => {
    await attributeGroupPage.goto();
    await attributeGroupPage.openFilter();
    await expect(attributeGroupPage.page.getByText('Apply Filters')).toBeVisible();
  });

  test('should allow setting items per page', async ({ attributeGroupPage }) => {
    await attributeGroupPage.goto();
    await attributeGroupPage.setItemsPerPage(20);
    await expect(attributeGroupPage.page.getByRole('button', { name: '' })).toContainText('20');
  });

  test('should perform actions on an attribute group (Edit, Delete)', async ({
    attributeGroupPage,
  }) => {
    await attributeGroupPage.goto();
    const itemRow = attributeGroupPage.page.locator('div', { hasText: AG.code });
    await itemRow.locator('span[title="Edit"]').first().click();
    await expect(attributeGroupPage.page).toHaveURL(/\/admin\/catalog\/attributegroups\/edit/);
    await attributeGroupPage.goBack();
    await itemRow.locator('span[title="Delete"]').first().click();
    await expect(
      attributeGroupPage.page.locator('text=Are you sure you want to delete?')
    ).toBeVisible();
  });

  test('Update attribute group', async ({ attributeGroupPage }) => {
    await attributeGroupPage.goto();
    await attributeGroupPage.page
      .getByText(`${AG.code}${AG.name}`)
      .getByTitle('Edit')
      .click();
    await attributeGroupPage.fillName(AG.updatedName);
    await attributeGroupPage.save();
    await expect(
      attributeGroupPage.page.getByText(/Attribute Group Updated Successfully/i)
    ).toBeVisible();
  });

  test('Delete Attribute Group', async ({ attributeGroupPage }) => {
    await attributeGroupPage.goto();
    await attributeGroupPage.page
      .getByText(`${AG.code}${AG.updatedName}`)
      .getByTitle('Delete')
      .click();
    await attributeGroupPage.confirmDelete();
    await expect(
      attributeGroupPage.page.getByText(/Attribute Group Deleted Successfully/i)
    ).toBeVisible();
  });
});
