const { test, expect } = require('../../utils/fixtures');

test.describe('Verify the behvaiour of Product Completenss feature', () => {
  test('Verify product grid shows NA for completeness when no required channel configured', async ({ productPage }) => {
    await productPage.create({
      sku: 'NAScore',
      type: 'Simple',
      family: 'Default'
    });
    await productPage.goto();
    const skuRow = productPage.page.locator('div.row:has-text("NAScore")');
    const completeColumn = skuRow.locator('span.label-info');
    await expect(completeColumn).toHaveText('N/A');
  });

  test('Verify product edit adminPage shows no completeness score when no required channel configured', async ({ productPage }) => {
    await productPage.goto();
    await productPage.page.getByText('NAScore').click();
    await expect(productPage.page).toHaveURL(/.*\/edit\/.*/);
    await expect(productPage.page.locator('text=Missing Required Attributes')).toHaveCount(0);
    await expect(productPage.page.locator('text=Completeness')).toHaveCount(0);
  });

  test('Verify that attributes can be set as required from Completeness tab in default family', async ({ completenessPage }) => {
    await completenessPage.gotoFamilyCompleteness('Default');
    await completenessPage.setItemsPerPage(50);
    await expect(completenessPage.page.getByText('16 Results')).toBeVisible();

    // Using nth(10) to match the original test's arbitrary selection
    await completenessPage.page.locator(`input[name="channel_requirements"]`).locator('..').locator('.multiselect__tags').nth(10).click();
    await completenessPage.page.getByRole('option', { name: 'Default' }).locator('span').first().click();
    await expect(completenessPage.page.getByText('Completeness updated successfully Close').first()).toBeVisible();
  });

  test('Verify all available channels are displayed when user clicks “Configure Completeness” option', async ({ completenessPage }) => {
    await completenessPage.gotoFamilyCompleteness('Default');
    await completenessPage.performMassAction('Change Completeness');

    const multiselect = completenessPage.page.locator('.px-4 > .mb-4 > div > .multiselect > .multiselect__tags');
    await multiselect.click();
    await expect(completenessPage.page.getByRole('option', { name: 'Default' }).locator('span').first()).toBeVisible();
    await expect(completenessPage.page.getByRole('option', { name: 'channel3' }).locator('span').first()).toBeVisible();
  });

  test('Verify bulk selection of attributes for required channel updates product completeness visibility', async ({ completenessPage }) => {
    await completenessPage.gotoFamilyCompleteness('Default');
    await completenessPage.setItemsPerPage(50);

    await completenessPage.selectAllRecords();
    await completenessPage.page.getByRole('button', { name: /Select Action/i }).click();
    await completenessPage.page.locator('a', { hasText: 'Change Completeness Requirement' }).click();

    const multiselect = completenessPage.page.locator('.px-4 > .mb-4 > div > .multiselect > .multiselect__tags');
    await multiselect.click();
    await completenessPage.page.getByRole('option', { name: 'Default' }).locator('span').first().click();
    await completenessPage.page.getByRole('button', { name: 'Save' }).click();
    await expect(completenessPage.page.getByText('Completeness updated successfully Close')).toBeVisible();
  });

  test('Verify channel can be deselected for specific attribute in completeness settings', async ({ completenessPage }) => {
    await completenessPage.gotoFamilyCompleteness('Default');
    await completenessPage.setItemsPerPage(50);

    // Deselect first tag
    await completenessPage.page.locator('.multiselect__tag-icon').first().click();
    await expect(completenessPage.page.getByText('Completeness updated successfully Close').first()).toBeVisible();
  });

  test('Update the sku by filling all missing required attribute', async ({ productPage }) => {
    await productPage.goto();
    await productPage.clickEditForRow('NAScore');

    await productPage.page.locator('#product_number').fill('123');
    await productPage.page.locator('input[name="values[channel_locale_specific][default][en_US][name]"]').fill('skusavedraft');
    await productPage.page.locator('input[name="values[common][url_key]"]').fill('skusavedraft');

    const shortDescFrame = productPage.page.frameLocator('#short_description_ifr');
    await shortDescFrame.locator('body').fill('This is a short description');

    const mainDescFrame = productPage.page.frameLocator('#description_ifr');
    await mainDescFrame.locator('body').fill('This is the full product description added by test.');

    await productPage.page.locator('input[name="values[channel_locale_specific][default][en_US][price][USD]"]').fill('300');
    await productPage.page.locator('#meta_title').fill('meattitle');
    await productPage.page.locator('#meta_keywords').fill('keyword');
    await productPage.page.locator('#meta_description').fill('description');
    await productPage.page.locator('#cost').fill('23');

    await productPage.save();
  });

  test('Verify configuring required attributes for different channels in Default Family Completeness settings', async ({ completenessPage }) => {
    await completenessPage.gotoFamilyCompleteness('Default');
    await completenessPage.setItemsPerPage(50);

    // Set for channel3
    await completenessPage.page.locator(`input[name="channel_requirements"]`).locator('..').locator('.multiselect__tags').first().click();
    await completenessPage.page.getByRole('option', { name: 'channel3' }).locator('span').first().click();
    await expect(completenessPage.page.getByText('Completeness updated successfully Close').first()).toBeVisible();
  });
});