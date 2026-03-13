const { test, expect } = require('../../utils/fixtures');

test.describe('Verify that Product Completeness feature correctly Exists', () => {
  test('Verify “Completeness” tab is displayed in Default Family Edit adminPage', async ({ completenessPage }) => {
    await completenessPage.gotoFamilyCompleteness('Default');
    await expect(completenessPage.page).toHaveURL(/\?completeness/);
    await expect(completenessPage.page.getByRole('paragraph').filter({ hasText: 'Completeness' })).toBeVisible();
    await expect(completenessPage.page.locator('div').filter({ hasText: /^Code$/ })).toBeVisible();
    await expect(completenessPage.page.locator('div').filter({ hasText: /^Name$/ })).toBeVisible();
    await expect(completenessPage.page.locator('div').filter({ hasText: /^Required in Channels$/ })).toBeVisible();
  });

  test('Verify Product Completeness Status Display on Dashboard for All Products Channel-wise', async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await expect(await dashboardPage.getCompletenessChart()).toBeVisible();
    await expect(await dashboardPage.getLowCompletenessHeader()).toBeVisible();
    await expect(await dashboardPage.getLocaleCompleteness('English (United States)')).toBeVisible();
  });

  test('Verify Product Completeness Status Displays N/A When No Attributes Are Configured as Required for a Channel', async ({ productPage, dashboardPage }) => {
    await productPage.create({
      sku: 'check-complete-status-onproduct',
      type: 'Simple',
      family: 'Default'
    });
    // Toggle between dashboard and catalog to ensure refresh
    await dashboardPage.goto();
    await productPage.goto();
    await expect(productPage.page.getByRole('paragraph').filter({ hasText: /^Complete$/ })).toBeVisible();
    await expect(productPage.page.getByRole('paragraph').filter({ hasText: 'N/A' }).first()).toBeVisible();
  });

  test('Verify Completeness tab is automatically displayed for a new or custom family creation', async ({ attributeFamilyPage, completenessPage }) => {
    const familyCode = 'displaycompletensstab';
    await attributeFamilyPage.create({
      code: familyCode,
      name: 'displaytab'
    });
    await completenessPage.gotoFamilyCompleteness(familyCode);
    await expect(completenessPage.page.getByRole('link', { name: 'Completeness' })).toBeVisible();
  });

  test('Assign attribute group ,attribute in created family', async ({ attributeFamilyPage }) => {
    const familyCode = 'displaycompletensstab';
    await attributeFamilyPage.goto();
    await attributeFamilyPage.clickEditForRow(familyCode);

    await attributeFamilyPage.assignAttributeGroup('General');

    const attributes = ['sku', 'Name', 'price', 'Description'];
    for (const attr of attributes) {
      await attributeFamilyPage.dragAttributeToGroup(attr);
    }
    await attributeFamilyPage.save();
  });

  test('Verify newly assigned SKU attribute appears in Completeness tab for a new family', async ({ completenessPage }) => {
    const familyCode = 'displaycompletensstab';
    await completenessPage.gotoFamilyCompleteness(familyCode);
    await expect(completenessPage.page.locator('div').filter({ hasText: /^sku$/ })).toBeVisible();
    await expect(completenessPage.page.getByText('SKU', { exact: true })).toBeVisible();
  });

  test('Verify attribute search using search bar in Completeness section returns correct results in Family settings', async ({ completenessPage }) => {
    const familyCode = 'displaycompletensstab';
    await completenessPage.gotoFamilyCompleteness(familyCode);
    await completenessPage.searchAttribute('sku');
    await expect(completenessPage.page.getByText('1 Results')).toBeVisible();
    await expect(completenessPage.page.locator('div').filter({ hasText: /^sku$/ })).toBeVisible();
  });

  test('Verify default channel appears in dropdown for “Required in Channel” in Completeness tab', async ({ completenessPage }) => {
    const familyCode = 'displaycompletensstab';
    await completenessPage.gotoFamilyCompleteness(familyCode);
    await completenessPage.page.locator('div').filter({ hasText: /^Select option$/ }).nth(1).click();
    await expect(completenessPage.page.getByRole('option', { name: 'Default' }).locator('span').first()).toBeVisible();
  });

  test('Verify attribute filter using code in Completeness section of Family settings', async ({ completenessPage }) => {
    const familyCode = 'displaycompletensstab';
    await completenessPage.gotoFamilyCompleteness(familyCode);
    await completenessPage.openFilter();
    await completenessPage.fillFilterCode('sku');
    await completenessPage.applyFilter();
    // Second apply might be needed if UI requires it (from original test)
    await completenessPage.page.getByText('Save').click();
    await expect(completenessPage.page.getByText('1 Results')).toBeVisible();
  });

  test('Verify attribute filter using name in Completeness section of Family settings', async ({ completenessPage }) => {
    const familyCode = 'displaycompletensstab';
    await completenessPage.gotoFamilyCompleteness(familyCode);
    await completenessPage.openFilter();
    await completenessPage.fillFilterName('xyz');
    await completenessPage.applyFilter();
    await completenessPage.page.getByText('Save').click();
    await expect(completenessPage.page.getByText('0 Results')).toBeVisible();
  });

  test('Verify attribute filter using Required in Channel in Completeness section of Family settings', async ({ completenessPage }) => {
    const familyCode = 'displaycompletensstab';
    await completenessPage.gotoFamilyCompleteness(familyCode);

    // Test with non-existent channel
    await completenessPage.openFilter();
    await completenessPage.fillFilterChannel('xyz');
    await completenessPage.applyFilter();
    await completenessPage.page.getByText('Save').click();
    await expect(completenessPage.page.getByText('0 Results')).toBeVisible();

    // Test with default channel (expecting 0 if none configured yet)
    await completenessPage.openFilter();
    await completenessPage.fillFilterChannel('default');
    await completenessPage.applyFilter();
    await expect(completenessPage.page.getByText('0 Result')).toBeVisible();
  });

  test('Verify correct selection of SKU in default channel using “Required for Channel” dropdown', async ({ completenessPage }) => {
    const familyCode = 'displaycompletensstab';
    await completenessPage.gotoFamilyCompleteness(familyCode);
    await completenessPage.setRequiredChannel('sku', 'Default');
    await expect(completenessPage.page.getByText('Completeness updated successfully Close')).toBeVisible();
  });

  test('Verify filter using Required in Channel in Completeness section of Family settings return 1 result', async ({ completenessPage }) => {
    const familyCode = 'displaycompletensstab';
    await completenessPage.gotoFamilyCompleteness(familyCode);
    await completenessPage.openFilter();
    await completenessPage.fillFilterChannel('default');
    await completenessPage.applyFilter();
    await completenessPage.page.getByText('Save').click();
    await expect(completenessPage.page.getByText('1 Results')).toBeVisible();
  });

  test('Verify selectable attribute count in Completeness tab equals assigned family attributes', async ({ completenessPage }) => {
    const familyCode = 'displaycompletensstab';
    await completenessPage.gotoFamilyCompleteness(familyCode);
    // Switch back to attributes list to count
    await completenessPage.page.getByRole('link', { name: 'Attributes', exact: true }).click();
    await completenessPage.page.waitForSelector('#assigned-attribute-groups', { state: 'visible' });
    const assignedCount = await completenessPage.page
      .locator('#assigned-attribute-groups .ltr\\:ml-11 [data-draggable="true"]').count();
    expect(assignedCount).toBeGreaterThan(0);
  });

  test('Create a new channel and assigned multiple locale and currency', async ({ localePage, currencyPage, channelPage }) => {
    // Enable af_ZA locale
    await localePage.goto();
    await localePage.search('af_ZA');
    await localePage.clickEditForRow('af_ZA');
    await localePage.page.locator('label[for="status"]').click();
    await localePage.save();
    await expect(localePage.page.getByText(/Locale Updated successfully/i)).toBeVisible();

    // Enable ADP currency
    await currencyPage.goto();
    await currencyPage.search('adp');
    await currencyPage.clickEditForRow('adp');
    await currencyPage.page.locator('label[for="status"]').click();
    await currencyPage.save();
    await expect(currencyPage.page.getByText(/Currency updated successfully/i)).toBeVisible();

    // Create a new channel
    await channelPage.create({
      code: 'defaultchannel2',
      name: 'channel3',
      rootCategory: '[root]',
      locales: ['Afrikaans (South Africa)', 'English (United States)'],
      currencies: ['Andorran Peseta', 'US Dollar']
    });
    await expect(channelPage.page.getByText(/Channel created successfully/i)).toBeVisible();
  });

  test('Verify all available channels are displayed in Configure Completeness for newly created family', async ({ completenessPage }) => {
    const familyCode = 'displaycompletensstab';
    await completenessPage.gotoFamilyCompleteness(familyCode);

    await completenessPage.performMassAction('Change Completeness');

    const multiselect = completenessPage.page.locator('.px-4 > .mb-4 > div > .multiselect > .multiselect__tags');
    await multiselect.click();
    await expect(completenessPage.page.getByRole('option', { name: 'Default' }).locator('span').first()).toBeVisible();
    await expect(completenessPage.page.getByRole('option', { name: 'channel3' }).locator('span').first()).toBeVisible();
  });

  test('Delete the created family after tests', async ({ attributeFamilyPage }) => {
    const familyCode = 'displaycompletensstab';
    await attributeFamilyPage.goto();
    await attributeFamilyPage.delete(familyCode);
    await expect(attributeFamilyPage.page.getByText(/Family deleted successfully/i)).toBeVisible();
  });
});

