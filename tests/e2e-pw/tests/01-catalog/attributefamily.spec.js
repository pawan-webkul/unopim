/**
 * Attribute Family spec
 */
const { test, expect } = require('../../utils/fixtures');
const testData = require('../../config/test-data');

const { attributeFamily: af } = testData;

test.describe('Attribute Family', () => {
  test('Create Attribute family with empty code field', async ({ attributeFamilyPage }) => {
    await attributeFamilyPage.gotoCreate();
    await attributeFamilyPage.fillCode('');
    await attributeFamilyPage.fillName('Header');
    await attributeFamilyPage.save();
    await expect(
      attributeFamilyPage.page.getByText('The Code field is required')
    ).toBeVisible();
  });

  test('Create Attribute family', async ({ attributeFamilyPage }) => {
    await attributeFamilyPage.create({ code: af.code, name: af.name });
    await expect(attributeFamilyPage.page.getByText(/Family created successfully/i)).toBeVisible();
  });

  test('should allow attribute family search', async ({ attributeFamilyPage }) => {
    await attributeFamilyPage.goto();
    await attributeFamilyPage.search(af.code);
    await expect(
      attributeFamilyPage.page.locator(`text=${af.code}${af.name}`, { exact: true })
    ).toBeVisible();
  });

  test('should open the filter menu when clicked', async ({ attributeFamilyPage }) => {
    await attributeFamilyPage.goto();
    await attributeFamilyPage.openFilter();
    await expect(attributeFamilyPage.page.getByText('Apply Filters')).toBeVisible();
  });

  test('should allow setting items per page', async ({ attributeFamilyPage }) => {
    await attributeFamilyPage.goto();
    await attributeFamilyPage.setItemsPerPage(20);
    await expect(attributeFamilyPage.page.getByRole('button', { name: '' })).toContainText('20');
  });

  test('should perform actions on a attribute family (Edit, Copy, Delete)', async ({
    attributeFamilyPage,
  }) => {
    await attributeFamilyPage.goto();
    const itemRow = attributeFamilyPage.page.locator('div', { hasText: af.code });
    await itemRow.locator('span[title="Edit"]').first().click();
    await expect(attributeFamilyPage.page).toHaveURL(/\/admin\/catalog\/families\/edit/);
    await attributeFamilyPage.goBack();
    await itemRow.locator('span[title="Copy"]').first().click();
    await expect(attributeFamilyPage.page).toHaveURL(/\/admin\/catalog\/families\/copy/);
    await attributeFamilyPage.goBack();
    await itemRow.locator('span[title="Delete"]').first().click();
    await expect(
      attributeFamilyPage.page.locator('text=Are you sure you want to delete?')
    ).toBeVisible();
  });

  test('Edit Attribute Family', async ({ attributeFamilyPage }) => {
    await attributeFamilyPage.goto();
    await attributeFamilyPage.page
      .getByText(`${af.code}${af.name}`)
      .getByTitle('Edit')
      .click();
    await attributeFamilyPage.fillName(af.updatedName);
    // Assign attribute group
    await attributeFamilyPage.page
      .locator('.secondary-button', { hasText: 'Assign Attribute Group' })
      .click();
    await attributeFamilyPage.page
      .locator('input[name="group"]')
      .locator('..')
      .locator('.multiselect__placeholder')
      .click();
    await attributeFamilyPage.page.getByRole('textbox', { name: 'group-searchbox' }).fill('General');
    await attributeFamilyPage.page
      .getByRole('option', { name: 'General' })
      .locator('span')
      .first()
      .click();
    await attributeFamilyPage.page.getByRole('button', { name: 'Assign Attribute Group' }).click();
    // Drag-and-drop SKU into the group
    const dragHandle = await attributeFamilyPage.page
      .locator('#unassigned-attributes i.icon-drag:near(:text("SKU"))')
      .first();
    const dropTarget = await attributeFamilyPage.page
      .locator('#assigned-attribute-groups .group_node')
      .first();
    const dragBox = await dragHandle.boundingBox();
    const dropBox = await dropTarget.boundingBox();
    if (dragBox && dropBox) {
      await attributeFamilyPage.page.mouse.move(
        dragBox.x + dragBox.width / 2,
        dragBox.y + dragBox.height / 2
      );
      await attributeFamilyPage.page.mouse.down();
      await attributeFamilyPage.page.mouse.move(
        dropBox.x + dropBox.width / 2,
        dropBox.y + dropBox.height / 2,
        { steps: 10 }
      );
      await attributeFamilyPage.page.mouse.up();
    }
    await attributeFamilyPage.save();
    await expect(attributeFamilyPage.page.getByText(/Family updated successfully/i)).toBeVisible();
  });

  test('Delete Attribute Family', async ({ attributeFamilyPage }) => {
    await attributeFamilyPage.goto();
    await attributeFamilyPage.page
      .getByText(`${af.code}${af.updatedName}`)
      .getByTitle('Delete')
      .click();
    await attributeFamilyPage.confirmDelete();
    await expect(attributeFamilyPage.page.getByText(/Family deleted successfully/i)).toBeVisible();
  });
});
