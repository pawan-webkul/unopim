/**
 * Attribute spec — tests for creating, reading, updating, and deleting attributes
 * of all supported types (Text, Checkbox, Multiselect, Select, Swatch).
 */
const { test, expect } = require('../../utils/fixtures');
const testData = require('../../config/test-data');

const { attribute: attr } = testData;

// ---------------------------------------------------------------------------
// Basic Text Attribute CRUD
// ---------------------------------------------------------------------------
test.describe('UnoPim Attribute', () => {
  test('Create attribute with empty code field', async ({ attributePage }) => {
    await attributePage.gotoCreate();
    await attributePage.fillCode('');
    await attributePage.searchAndSelectType('Text', 'Text');
    await attributePage.fillName(attr.textName);
    await attributePage.save();
    await expect(attributePage.page.getByText('The Code field is required')).toBeVisible();
  });

  test('Create attribute with empty Type field', async ({ attributePage }) => {
    await attributePage.gotoCreate();
    await attributePage.fillCode(attr.textCode);
    await attributePage.fillName(attr.textName);
    await attributePage.save();
    await expect(attributePage.page.getByText('The Type field is required')).toBeVisible();
  });

  test('Create attribute with empty Code and Type field', async ({ attributePage }) => {
    await attributePage.gotoCreate();
    await attributePage.fillCode('');
    await attributePage.fillName(attr.textName);
    await attributePage.save();
    await expect(attributePage.page.getByText('The Code field is required')).toBeVisible();
    await expect(attributePage.page.getByText('The Type field is required')).toBeVisible();
  });

  test('Create attribute', async ({ attributePage }) => {
    await attributePage.create({
      code: attr.textCode,
      type: 'Text',
      name: attr.textName,
    });
    await expect(attributePage.page.getByText(/Attribute Created Successfully/i)).toBeVisible();
  });

  test('should allow attribute search', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.search('product');
    await expect(attributePage.page.locator(`text=${attr.textCode}`, { exact: true })).toBeVisible();
  });

  test('should open the filter menu when clicked', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.openFilter();
    await expect(attributePage.page.getByText('Apply Filters')).toBeVisible();
  });

  test('should allow setting items per page', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.setItemsPerPage(20);
    await expect(attributePage.page.getByRole('button', { name: '' })).toContainText('20');
  });

  test('should perform actions on an attribute (Edit, Delete)', async ({ attributePage }) => {
    await attributePage.goto();
    const rowText = attr.textCode;
    const itemRow = attributePage.page.locator('div', { hasText: rowText });
    await itemRow.locator('span[title="Edit"]').first().click();
    await expect(attributePage.page).toHaveURL(/\/admin\/catalog\/attributes\/edit/);
    await attributePage.goBack();
    await itemRow.locator('span[title="Delete"]').first().click();
    await expect(
      attributePage.page.locator('text=Are you sure you want to delete?')
    ).toBeVisible();
  });

  test('should allow selecting all attributes with the mass action checkbox', async ({
    attributePage,
  }) => {
    await attributePage.goto();
    await attributePage.selectAllRecords();
    await expect(
      attributePage.page.locator('#mass_action_select_all_records')
    ).toBeChecked();
  });

  test('Update attribute', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(attr.textCode);
    await attributePage.fillName(attr.updatedName);
    await attributePage.page.locator('#is_required').nth(1).click();
    await attributePage.save();
    await expect(attributePage.page.getByText(/Attribute Updated Successfully/i)).toBeVisible();
  });

  test('Delete Attribute', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.page
      .getByText(`${attr.textCode}${attr.updatedName}`)
      .getByTitle('Delete')
      .click();
    await attributePage.confirmDelete();
    await expect(attributePage.page.getByText(/Attribute Deleted Successfully/i)).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Checkbox Type Attribute Option Grid
// ---------------------------------------------------------------------------
test.describe('Checkbox Type Attribute Option Grid', () => {
  test('Adding options should not be visible while creating the attribute (checkbox type)', async ({
    attributePage,
  }) => {
    await attributePage.gotoCreate();
    await attributePage.fillCode(attr.checkboxCode);
    await attributePage.searchAndSelectType('checkbox', 'Checkbox');
    await attributePage.fillName(attr.checkboxName);
    await expect(attributePage.page.getByText('Options', { exact: true })).not.toBeVisible();
    await expect(attributePage.page.getByText('Add Row')).not.toBeVisible();
  });

  test('create the checkbox type attribute', async ({ attributePage }) => {
    await attributePage.gotoCreate();
    await attributePage.fillCode(attr.checkboxCode);
    await attributePage.searchAndSelectType('checkbox', 'Checkbox');
    await attributePage.fillName(attr.checkboxName);
    await attributePage.save();
    await expect(
      attributePage.page.getByText(/Attribute Created Successfully/i).first()
    ).toBeVisible();
    await expect(attributePage.page.getByText('Options', { exact: true })).toBeVisible();
    await expect(attributePage.page.getByText('Add Row')).toBeVisible();
  });

  test('Edit and add the options in the checkbox type attribute', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(attr.checkboxCode);
    await expect(attributePage.page.getByText('Options', { exact: true })).toBeVisible();
    for (const optionCode of attr.options.checkbox) {
      await attributePage.addTextOption({
        code: optionCode,
        label: optionCode.charAt(0).toUpperCase() + optionCode.replace(/_/g, ' ').slice(1),
      });
      await expect(
        attributePage.page.getByText('Attribute Option Created Successfully')
      ).toBeVisible();
      await attributePage.closeOptionDialog();
    }
  });

  test('check the search bar of attribute options datagrid', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(attr.checkboxCode);
    await expect(attributePage.page.getByText('Options', { exact: true })).toBeVisible();
    const searchBox = attributePage.page.getByRole('textbox', { name: 'Search', exact: true });
    await searchBox.click();
    await searchBox.fill('cable');
    await searchBox.press('Enter');
    await expect(attributePage.page.getByText('cableCable')).toBeVisible();
  });

  test('should allow setting items per page (options datagrid)', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(attr.checkboxCode);
    await attributePage.setItemsPerPage(20);
    await expect(attributePage.page.getByRole('button', { name: '' })).toContainText('20');
  });

  test('should perform actions on an attribute option (Edit, Delete)', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(attr.checkboxCode);
    const optionRow = attributePage.page.locator('div', { hasText: 'cableCable' });
    await optionRow.locator('span[title="Edit"]').first().click();
    await expect(attributePage.page.getByText('Add Option')).toBeVisible();
    await attributePage.page.locator('span.icon-cancel.cursor-pointer').click();
    await optionRow.locator('span[title="Delete"]').first().click();
    await expect(
      attributePage.page.locator('text=Are you sure you want to delete?')
    ).toBeVisible();
  });

  test('Pagination buttons should be visible, enabled, and clickable', async ({
    attributePage,
  }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(attr.checkboxCode);
    const paginationSymbols = ['«', '‹', '›', '»'];
    for (const symbol of paginationSymbols) {
      const button = attributePage.page.getByText(symbol, { exact: true });
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
      await button.click();
    }
  });

  test('Delete the checkbox type attribute', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.clickDeleteForRow(attr.checkboxCode);
    await attributePage.confirmDelete();
    await expect(attributePage.page.getByText('Attribute Deleted Successfully')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Multiselect Type Attribute Options Grid
// ---------------------------------------------------------------------------
test.describe('Multiselect Type Attribute Options Grid', () => {
  test('Adding options should not be visible while creating the attribute (multiselect type)', async ({
    attributePage,
  }) => {
    await attributePage.gotoCreate();
    await attributePage.fillCode(attr.multiselectCode);
    await attributePage.searchAndSelectType('Multiselect', 'Multiselect');
    await attributePage.fillName(attr.multiselectName);
    await expect(attributePage.page.getByText('Options', { exact: true })).not.toBeVisible();
    await expect(attributePage.page.getByText('Add Row')).not.toBeVisible();
  });

  test('create the multiselect type attribute', async ({ attributePage }) => {
    await attributePage.gotoCreate();
    await attributePage.fillCode(attr.multiselectCode);
    await attributePage.searchAndSelectType('Multiselect', 'Multiselect');
    await attributePage.fillName(attr.multiselectName);
    await attributePage.save();
    await expect(
      attributePage.page.getByText(/Attribute Created Successfully/i).first()
    ).toBeVisible();
    await expect(attributePage.page.getByText('Options', { exact: true })).toBeVisible();
    await expect(attributePage.page.getByText('Add Row')).toBeVisible();
  });

  test('Edit and add the options in the multiselect type attribute', async ({
    attributePage,
  }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.multiselectCode}${attr.multiselectName}`);
    for (const optionCode of attr.options.multiselect) {
      await attributePage.addTextOption({
        code: optionCode,
        label: optionCode.charAt(0).toUpperCase() + optionCode.slice(1),
      });
      await expect(
        attributePage.page.getByText('Attribute Option Created Successfully')
      ).toBeVisible();
      await attributePage.closeOptionDialog();
    }
  });

  test('check the search bar of attribute options datagrid', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.multiselectCode}${attr.multiselectName}`);
    const searchBox = attributePage.page.getByRole('textbox', { name: 'Search', exact: true });
    await searchBox.click();
    await searchBox.fill('charger');
    await searchBox.press('Enter');
    await expect(attributePage.page.getByText('chargerCharger')).toBeVisible();
  });

  test('should allow setting items per page (multiselect options)', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.multiselectCode}${attr.multiselectName}`);
    await attributePage.setItemsPerPage(20);
    await expect(attributePage.page.getByRole('button', { name: '' })).toContainText('20');
  });

  test('should perform actions on a multiselect attribute option (Edit, Delete)', async ({
    attributePage,
  }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.multiselectCode}features`);
    const optionRow = attributePage.page.locator('div', { hasText: 'chargerCharger' });
    await optionRow.locator('span[title="Edit"]').first().click();
    await expect(attributePage.page.getByText('Add Option')).toBeVisible();
    await attributePage.page.locator('span.icon-cancel.cursor-pointer').click();
    await optionRow.locator('span[title="Delete"]').first().click();
    await expect(
      attributePage.page.locator('text=Are you sure you want to delete?')
    ).toBeVisible();
  });

  test('Pagination buttons should be visible, enabled, and clickable (multiselect)', async ({
    attributePage,
  }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.multiselectCode}${attr.multiselectName}`);
    const paginationSymbols = ['«', '‹', '›', '»'];
    for (const symbol of paginationSymbols) {
      const button = attributePage.page.getByText(symbol, { exact: true });
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
      await button.click();
    }
  });

  test('Delete the multiselect type attribute', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.clickDeleteForRow(`${attr.multiselectCode}${attr.multiselectName}`);
    await attributePage.confirmDelete();
    await expect(attributePage.page.getByText('Attribute Deleted Successfully')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Select Type Attribute
// ---------------------------------------------------------------------------
test.describe('Select Type Attribute', () => {
  test('Adding options should not be visible while creating the attribute (select type)', async ({
    attributePage,
  }) => {
    await attributePage.gotoCreate();
    await attributePage.fillCode(attr.selectCode);
    await attributePage.searchAndSelectType('Select', 'Select');
    await attributePage.fillName(attr.selectName);
    await expect(attributePage.page.getByText('Options', { exact: true })).not.toBeVisible();
    await expect(attributePage.page.getByText('Add Row')).not.toBeVisible();
  });

  test('create the Select type attribute', async ({ attributePage }) => {
    await attributePage.gotoCreate();
    await attributePage.fillCode(attr.selectCode);
    await attributePage.searchAndSelectType('Select', 'Select');
    await attributePage.fillName(attr.selectName);
    await attributePage.save();
    await expect(
      attributePage.page.getByText(/Attribute Created Successfully/i).first()
    ).toBeVisible();
    await expect(attributePage.page.getByText('Options', { exact: true })).toBeVisible();
    await expect(attributePage.page.getByText('Add Row')).toBeVisible();
  });

  test('Edit and add the options in the Select type attribute', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.selectCode}${attr.selectName}`);
    for (const optionCode of attr.options.select) {
      await attributePage.addTextOption({
        code: optionCode,
        label: optionCode.charAt(0).toUpperCase() + optionCode.slice(1),
      });
      await expect(
        attributePage.page.getByText('Attribute Option Created Successfully')
      ).toBeVisible();
      await attributePage.closeOptionDialog();
    }
  });

  test('check the search bar of attribute options datagrid (select)', async ({
    attributePage,
  }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.selectCode}${attr.selectName}`);
    const searchBox = attributePage.page.getByRole('textbox', { name: 'Search', exact: true });
    await searchBox.click();
    await searchBox.fill('cotton');
    await searchBox.press('Enter');
    await expect(attributePage.page.getByText('cottonCotton')).toBeVisible();
  });

  test('should allow setting items per page (select options)', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.selectCode}${attr.selectName}`);
    await attributePage.setItemsPerPage(20);
    await expect(attributePage.page.getByRole('button', { name: '' })).toContainText('20');
  });

  test('should perform actions on a Select attribute option (Edit, Delete)', async ({
    attributePage,
  }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.selectCode}${attr.selectName}`);
    const optionRow = attributePage.page.locator('div', { hasText: 'cottonCotton' });
    await optionRow.locator('span[title="Edit"]').first().click();
    await expect(attributePage.page.getByText('Add Option')).toBeVisible();
    await attributePage.page.locator('span.icon-cancel.cursor-pointer').click();
    await optionRow.locator('span[title="Delete"]').first().click();
    await expect(
      attributePage.page.locator('text=Are you sure you want to delete?')
    ).toBeVisible();
  });

  test('Pagination buttons should be visible, enabled, and clickable (select)', async ({
    attributePage,
  }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.selectCode}${attr.selectName}`);
    const paginationSymbols = ['«', '‹', '›', '»'];
    for (const symbol of paginationSymbols) {
      const button = attributePage.page.getByText(symbol, { exact: true });
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
      await button.click();
    }
  });

  test('Delete the Select type attribute', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.clickDeleteForRow(`${attr.selectCode}${attr.selectName}`);
    await attributePage.confirmDelete();
    await expect(attributePage.page.getByText('Attribute Deleted Successfully')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Swatch Type Attribute Options
// ---------------------------------------------------------------------------
test.describe('Swatch Type Attribute Option', () => {
  test('Check swatch type visibility on Select attribute creation', async ({ attributePage }) => {
    await attributePage.gotoCreate();
    await attributePage.fillCode('swatch');
    await attributePage.searchAndSelectType('Select', 'Select');
    await attributePage.page
      .locator('#swatch_type')
      .getByRole('combobox')
      .locator('div')
      .filter({ hasText: 'Text Swatch' })
      .click();
  });

  test('Check the swatch type options for select type attribute', async ({ attributePage }) => {
    await attributePage.gotoCreate();
    await attributePage.fillCode('swatch');
    await attributePage.searchAndSelectType('Select', 'Select');
    const swatchCombo = attributePage.page
      .locator('#swatch_type')
      .getByRole('combobox')
      .locator('div');
    await swatchCombo.filter({ hasText: 'Text Swatch' }).click();
    await swatchCombo.filter({ hasText: 'Color Swatch' }).click();
    await swatchCombo.filter({ hasText: 'Image Swatch' }).click();
  });

  test('Verify swatch type field has default value as Text Swatch', async ({ attributePage }) => {
    await attributePage.gotoCreate();
    await attributePage.fillCode('swatch');
    await attributePage.searchAndSelectType('Select', 'Select');
    const swatchType = await attributePage.page
      .locator('#swatch_type')
      .getByRole('combobox')
      .locator('div')
      .filter({ hasText: 'Text Swatch' })
      .innerText();
    expect(swatchType).toBe('Text Swatch');
  });

  test('Create a select type attribute with swatch type as text swatch', async ({
    attributePage,
  }) => {
    await attributePage.gotoCreate();
    await attributePage.fillCode(attr.textSwatchCode);
    await attributePage.searchAndSelectType('Select', 'Select');
    await attributePage.fillName(attr.textSwatchName);
    await attributePage.save();
    await expect(
      attributePage.page.getByText(/Attribute Created Successfully/i).first()
    ).toBeVisible();
  });

  test('Verify swatch type field is visible while editing text swatch attribute', async ({
    attributePage,
  }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.textSwatchCode}${attr.textSwatchName}`);
    const swatchTypeInput = attributePage.page.locator('input[name="swatch_type"][type="text"]');
    await expect(swatchTypeInput).toBeDisabled();
    const hiddenInput = attributePage.page.locator('input[name="swatch_type"][type="hidden"]');
    await expect(hiddenInput).toHaveValue('text');
  });

  test('Edit and add the options in the Select type attribute with swatch type as text swatch', async ({
    attributePage,
  }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.textSwatchCode}${attr.textSwatchName}`);
    for (const optionCode of attr.options.textSwatch) {
      await attributePage.addTextOption({
        code: optionCode,
        label: optionCode.charAt(0).toUpperCase() + optionCode.slice(1),
      });
      await expect(
        attributePage.page.getByText('Attribute Option Created Successfully')
      ).toBeVisible();
    }
    await attributePage.save();
    await expect(attributePage.page.getByText(/Attribute Updated Successfully/i)).toBeVisible();
  });

  test('Delete the text swatch attribute option', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.textSwatchCode}${attr.textSwatchName}`);
    const optionRow = attributePage.page.locator('div', { hasText: 'redRed' });
    await optionRow.locator('span[title="Delete"]').first().click();
    await attributePage.confirmDelete();
    await expect(
      attributePage.page.getByText('Attribute Option Deleted Successfully')
    ).toBeVisible();
  });

  test('Create the select type attribute with swatch type as color swatch', async ({
    attributePage,
  }) => {
    await attributePage.gotoCreate();
    await attributePage.fillCode(attr.colorSwatchCode);
    await attributePage.searchAndSelectType('Select', 'Select');
    await attributePage.page
      .locator('#swatch_type')
      .getByRole('combobox')
      .locator('div')
      .filter({ hasText: 'Text Swatch' })
      .click();
    await attributePage.page
      .getByRole('option', { name: 'Color Swatch' })
      .locator('span')
      .first()
      .click();
    await attributePage.fillName(attr.colorSwatchName);
    await attributePage.save();
    await expect(
      attributePage.page.getByText(/Attribute Created Successfully/i).first()
    ).toBeVisible();
  });

  test('Verify swatch type is visible while editing color swatch attribute', async ({
    attributePage,
  }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.colorSwatchCode}${attr.colorSwatchName}`);
    const swatchTypeInput = attributePage.page.locator('input[name="swatch_type"][type="text"]');
    await expect(swatchTypeInput).toBeDisabled();
    const hiddenInput = attributePage.page.locator('input[name="swatch_type"][type="hidden"]');
    await expect(hiddenInput).toHaveValue('color');
  });

  test('Edit and add color swatch options', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.colorSwatchCode}${attr.colorSwatchName}`);
    for (const opt of attr.options.colorSwatch) {
      await attributePage.addColorSwatchOption(opt);
      await expect(
        attributePage.page.getByText('Attribute Option Created Successfully')
      ).toBeVisible();
    }
    await attributePage.save();
    await expect(attributePage.page.getByText(/Attribute Updated Successfully/i)).toBeVisible();
  });

  test('Delete the color swatch attribute option', async ({ attributePage }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.colorSwatchCode}${attr.colorSwatchName}`);
    const optionRow = attributePage.page.locator('div', { hasText: 'redRed' });
    await optionRow.locator('span[title="Delete"]').first().click();
    await attributePage.confirmDelete();
    await expect(
      attributePage.page.getByText('Attribute Option Deleted Successfully')
    ).toBeVisible();
  });

  test('Create the select type attribute with swatch type as image swatch', async ({
    attributePage,
  }) => {
    await attributePage.gotoCreate();
    await attributePage.fillCode(attr.imageSwatchCode);
    await attributePage.searchAndSelectType('Select', 'Select');
    await attributePage.page
      .locator('#swatch_type')
      .getByRole('combobox')
      .locator('div')
      .filter({ hasText: 'Text Swatch' })
      .click();
    await attributePage.page
      .getByRole('option', { name: 'Image Swatch' })
      .locator('span')
      .first()
      .click();
    await attributePage.fillName(attr.imageSwatchName);
    await attributePage.save();
    await expect(
      attributePage.page.getByText(/Attribute Created Successfully/i).first()
    ).toBeVisible();
  });

  test('Verify swatch type is visible while editing image swatch attribute', async ({
    attributePage,
  }) => {
    await attributePage.goto();
    await attributePage.clickEditForRow(`${attr.imageSwatchCode}${attr.imageSwatchName}`);
    const swatchTypeInput = attributePage.page.locator('input[name="swatch_type"][type="text"]');
    await expect(swatchTypeInput).toBeDisabled();
    const hiddenInput = attributePage.page.locator('input[name="swatch_type"][type="hidden"]');
    await expect(hiddenInput).toHaveValue('image');
  });
});
