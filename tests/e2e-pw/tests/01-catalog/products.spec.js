/**
 * Products spec
 */
const { test, expect } = require('../../utils/fixtures');
const testData = require('../../config/test-data');

const { product: prod } = testData;

// ---------------------------------------------------------------------------
// Create Product — validation and creation
// ---------------------------------------------------------------------------
test.describe('UnoPim Create Product Test Cases', () => {
    test('with empty product type field', async ({ productPage }) => {
        await productPage.openCreateDialog();
        await productPage.selectFamily(prod.family);
        await productPage.fillSku(`acer456_${Date.now()}`);
        await productPage.saveProduct();
        await expect(
            productPage.page.locator('div.border-red-500 + p.text-red-600')
        ).toHaveText('The Type field is required');
    });

    test('create product with simple alphanumeric SKU (ABC123)', async ({ productPage }) => {
        const sku = `${prod.validSkus.alphanumeric}_${Date.now()}`;
        await productPage.create({ type: prod.simpleType, family: undefined, sku });
        await expect(productPage.page.getByText(sku)).toBeVisible();
    });

    test('create product with letters only SKU', async ({ productPage }) => {
        const sku = `${prod.validSkus.lettersOnly}_${Date.now()}`;
        await productPage.create({ type: prod.simpleType, family: undefined, sku });
        await expect(productPage.page.getByText(sku)).toBeVisible();
    });

    test('create product with hyphen separator (PROD-001)', async ({ productPage }) => {
        const sku = `${prod.validSkus.hyphenSeparator}_${Date.now()}`;
        await productPage.create({ type: prod.simpleType, family: undefined, sku });
        await expect(productPage.page.getByText(sku)).toBeVisible();
    });

    test('create product with multiple hyphens', async ({ productPage }) => {
        const sku = `${prod.validSkus.multipleHyphens}_${Date.now()}`;
        await productPage.create({ type: prod.simpleType, family: undefined, sku });
        await expect(productPage.page.getByText(sku)).toBeVisible();
    });

    test('create product with underscore separator', async ({ productPage }) => {
        const sku = `${prod.validSkus.underscoreSeparator}_${Date.now()}`;
        await productPage.create({ type: prod.simpleType, family: undefined, sku });
        await expect(productPage.page.getByText(sku)).toBeVisible();
    });

    test('create product with mixed separators', async ({ productPage }) => {
        const sku = `${prod.validSkus.mixedSeparators}_${Date.now()}`;
        await productPage.create({ type: prod.simpleType, family: undefined, sku });
        await expect(productPage.page.getByText(sku)).toBeVisible();
    });

    test('reject SKU starting with hyphen', async ({ productPage }) => {
        const sku = `${prod.invalidSkus.startsWithHyphen}_${Date.now()}`;
        await productPage.create({ type: prod.simpleType, family: undefined, sku });
        await expect(productPage.page.getByText(sku)).toHaveCount(0);
    });

    test('reject SKU starting with underscore', async ({ productPage }) => {
        const sku = `${prod.invalidSkus.startsWithUnderscore}_${Date.now()}`;
        await productPage.create({ type: prod.simpleType, family: undefined, sku });
        await expect(productPage.page.getByText(sku)).toHaveCount(0);
    });

    test('reject SKU with consecutive hyphens', async ({ productPage }) => {
        const sku = `${prod.invalidSkus.consecutiveHyphens}${Date.now()}`;
        await productPage.create({ type: prod.simpleType, family: undefined, sku });
        await expect(productPage.page.getByText(sku)).toHaveCount(0);
    });

    test('reject SKU with special characters', async ({ productPage }) => {
        const sku = `${prod.invalidSkus.specialChars}${Date.now()}`;
        await productPage.create({ type: prod.simpleType, family: undefined, sku });
        await expect(productPage.page.getByText(sku)).toHaveCount(0);
    });

    test('reject SKU with spaces', async ({ productPage }) => {
        const sku = `${prod.invalidSkus.spaces}${Date.now()}`;
        await productPage.create({ type: prod.simpleType, family: undefined, sku });
        await expect(productPage.page.getByText(sku)).toHaveCount(0);
    });

    test('with empty family field', async ({ productPage }) => {
        await productPage.openCreateDialog();
        await productPage.selectProductType(prod.simpleType);
        await productPage.fillSku(prod.simpleSku);
        await productPage.saveProduct();
        await expect(productPage.page.getByText('The Family field is required')).toBeVisible();
    });

    test('with empty sku field', async ({ productPage }) => {
        await productPage.openCreateDialog();
        await productPage.selectProductType(prod.simpleType);
        await productPage.selectFamily(prod.family);
        await productPage.saveProduct();
        await expect(
            productPage.page.locator('input[name="sku"] + p.text-red-600')
        ).toHaveText('The SKU field is required');
    });

    test('with empty product type and family field', async ({ productPage }) => {
        await productPage.openCreateDialog();
        await productPage.fillSku(prod.simpleSku);
        await productPage.saveProduct();
        await expect(productPage.page.getByText('The Type field is required')).toBeVisible();
        await expect(productPage.page.getByText('The Family field is required')).toBeVisible();
    });

    test('with empty product type and sku field', async ({ productPage }) => {
        await productPage.openCreateDialog();
        await productPage.selectFamily(prod.family);
        await productPage.saveProduct();
        await expect(
            productPage.page.locator('div.border-red-500 + p.text-red-600')
        ).toHaveText('The Type field is required');
        await expect(
            productPage.page.locator('input[name="sku"] + p.text-red-600')
        ).toHaveText('The SKU field is required');
    });

    test('with empty family and sku field', async ({ productPage }) => {
        await productPage.openCreateDialog();
        await productPage.selectProductType(prod.simpleType);
        await productPage.saveProduct();
        await expect(productPage.page.getByText('The Family field is required')).toBeVisible();
        await expect(
            productPage.page.locator('input[name="sku"] + p.text-red-600')
        ).toHaveText('The SKU field is required');
    });

    test('with all fields empty', async ({ productPage }) => {
        await productPage.openCreateDialog();
        await productPage.saveProduct();
        await expect(productPage.page.getByText('The Type field is required')).toBeVisible();
        await expect(productPage.page.getByText('The Family field is required')).toBeVisible();
        await expect(
            productPage.page.locator('input[name="sku"] + p.text-red-600')
        ).toHaveText('The SKU field is required');
    });

    test('Create Simple Product with all input', async ({ productPage }) => {
        await productPage.create({
            type: prod.simpleType,
            family: prod.family,
            sku: prod.simpleSku,
        });
        await expect(productPage.page.getByText(/Product created successfully/i)).toBeVisible();
    });

    test('Create Simple Product with same SKU', async ({ productPage }) => {
        await productPage.create({
            type: prod.simpleType,
            family: prod.family,
            sku: prod.simpleSku,
        });
        await expect(
            productPage.page.locator('input[name="sku"] + p.text-red-600')
        ).toHaveText('The sku has already been taken.');
    });

    test('should allow product search', async ({ productPage, adminPage }) => {
        await productPage.goto();
        await productPage.search('acer');
        await expect(adminPage.locator('text=1 Results')).toBeVisible();
        await expect(adminPage.locator(`text=${prod.simpleSku}`, { exact: true })).toBeVisible();
    });

    test('should open the filter menu when clicked', async ({ productPage }) => {
        await productPage.goto();
        await productPage.openFilter();
        await expect(productPage.page.getByText('Apply Filters')).toBeVisible();
    });

    test('should allow setting items per page', async ({ productPage }) => {
        await productPage.goto();
        await productPage.setItemsPerPage(20);
        await expect(productPage.page.getByRole('button', { name: '' })).toContainText('20');
    });

    test('should allow quick export', async ({ productPage }) => {
        await productPage.goto();
        await productPage.page.getByRole('button', { name: 'Quick Export' }).click();
        await expect(productPage.page.getByText('Download')).toBeVisible();
    });

    test('should perform actions on a product (Edit, Copy, Delete)', async ({
        productPage,
        adminPage,
    }) => {
        await productPage.goto();
        const itemRow = productPage.page.locator('div', { hasText: prod.simpleSku });
        await itemRow.locator('span[title="Edit"]').first().click();
        await expect(productPage.page).toHaveURL(/\/admin\/catalog\/products\/edit/);
        await productPage.goBack();
        await itemRow.locator('span[title="Copy"]').first().click();
        await expect(productPage.page.getByText('Are you sure?')).toBeVisible();
        await productPage.page.getByRole('button', { name: 'Agree', exact: true }).click();
        await expect(productPage.page.locator('text=Product copied successfully')).toBeVisible();
        await productPage.page.locator('a:has-text("Back")').click();
        const tempRow = productPage.page.locator('div', { hasText: 'temporary-sku' });
        await tempRow.locator('span[title="Delete"]').first().click();
        await productPage.confirmDelete();
        await expect(productPage.page.getByText(/Product deleted successfully/i)).toBeVisible();
        await itemRow.locator('span[title="Delete"]').first().click();
        await expect(
            productPage.page.locator('text=Are you sure you want to delete?')
        ).toBeVisible();
    });

    test('should allow selecting all products with the mass action checkbox', async ({
        productPage,
    }) => {
        await productPage.goto();
        await productPage.selectAllRecords();
        await expect(productPage.page.locator('#mass_action_select_all_records')).toBeChecked();
    });
});

// ---------------------------------------------------------------------------
// Update & Delete Product
// ---------------------------------------------------------------------------
test.describe('UnoPim Update Product Test cases', () => {
    test('Update simple product', async ({ productPage, adminPage }) => {
        await productPage.goto();
        const itemRow = productPage.page.locator('div', { hasText: prod.simpleSku });
        await itemRow.locator('span[title="Edit"]').first().click();
        await adminPage.locator('input[name="values[common][product_number]"]').fill('456');
        await adminPage.locator('input[name="values[channel_locale_specific][default][en_US][name]"]').click();
        await adminPage.locator('input[name="values[channel_locale_specific][default][en_US][name]"]').type('Acer Laptop');
        await adminPage.locator('input[name="values[common][url_key]"]').click();
        await adminPage.locator('input[name="values[common][url_key]"]').type('laptop');
        await adminPage.locator('input[name="values[common][color]"]').locator('..').locator('.multiselect__placeholder').click();
        await adminPage.getByRole('option', { name: 'White' }).locator('span').first().click();
        const shortDescFrame = adminPage.frameLocator('#short_description_ifr');
        await shortDescFrame.locator('body').click();
        await shortDescFrame.locator('body').type('This laptop is best in the market');
        const mainDescFrame = adminPage.frameLocator('#description_ifr');
        await mainDescFrame.locator('body').click();
        await mainDescFrame.locator('body').type('This is the ACER Laptop with high functionality');
        await adminPage.locator('#meta_title').fill('thakubali');
        await adminPage.locator('#price').fill('40000');
        await productPage.saveProduct();
        await expect(productPage.page.getByText(/Product updated successfully/i)).toBeVisible();
    });

    test('Delete simple product', async ({ productPage }) => {
        await productPage.goto();
        await productPage.clickDeleteForRow(prod.simpleSku);
        await productPage.confirmDelete();
        await expect(productPage.page.getByText(/Product deleted successfully/i)).toBeVisible();
    });

    test('Create Configurable Product', async ({ productPage, adminPage }) => {
        await productPage.openCreateDialog();
        await adminPage.locator('div').filter({ hasText: /^Select option$/ }).first().click();
        await adminPage.getByRole('option', { name: prod.configurableType }).locator('span').first().click();
        await adminPage.getByRole('textbox', { name: 'attribute_family_id' }).locator('..').locator('.multiselect__placeholder').click();
        await adminPage.getByRole('option', { name: prod.family }).locator('span').first().click();
        await productPage.fillSku(prod.configurableSku);
        await productPage.saveProduct();
        await adminPage.getByRole('paragraph').filter({ hasText: 'Brand' }).locator('span').click();
        await productPage.saveProduct();
        await expect(productPage.page.getByText(/Product created successfully/i)).toBeVisible();
    });

    test('Update Configurable Product', async ({ productPage, adminPage }) => {
        await productPage.goto();
        await productPage.clickEditForRow(prod.configurableSku);
        await adminPage.locator('#product_number').type('12345');
        await adminPage.locator('#name').click();
        await adminPage.locator('#name').type(prod.configurableName);
        await adminPage.locator('#url_key').click();
        await adminPage.locator('#url_key').type('Mobile');
        const shortDescFrame = adminPage.frameLocator('#short_description_ifr');
        await shortDescFrame.locator('body').click();
        await shortDescFrame.locator('body').type('This smart phone is best in the market');
        const mainDescFrame = adminPage.frameLocator('#description_ifr');
        await mainDescFrame.locator('body').click();
        await mainDescFrame.locator('body').type('This is the Realme 7pro phone');
        await adminPage.locator('#meta_title').fill('best mobile');
        await adminPage.locator('#price').fill('25000');
        await productPage.saveProduct();
        await expect(productPage.page.getByText(/Product updated successfully/i)).toBeVisible();
    });

    test('Delete configurable product', async ({ productPage }) => {
        await productPage.goto();
        await productPage.clickDeleteForRow(prod.configurableSku);
        await productPage.confirmDelete();
        await expect(productPage.page.getByText(/Product deleted successfully/i)).toBeVisible();
    });
});

// ---------------------------------------------------------------------------
// Dynamic Column tests
// ---------------------------------------------------------------------------
test.describe('UnoPim Test cases dynamic column', () => {
    test('Dynamic Column should be clickable', async ({ productPage }) => {
        await productPage.goto();
        await expect(productPage.page.getByText(/Columns/)).toBeVisible();
        await productPage.page.getByText('Columns', { exact: true }).click();
        await expect(productPage.page.getByText('Manage columns')).toBeVisible();
    });

    test('Dynamic Column search bar should be visible and clickable', async ({ productPage }) => {
        await productPage.goto();
        await productPage.page.getByText('Columns', { exact: true }).click();
        const search = productPage.page
            .locator('form')
            .filter({ hasText: 'Columns Manage columns' })
            .getByPlaceholder('Search');
        await search.click();
        await expect(search).toBeEnabled();
    });

    test('Dynamic Column search the default fields', async ({ productPage }) => {
        await productPage.goto();
        await productPage.page.getByText('Columns', { exact: true }).click();
        const form = productPage.page.locator('form').filter({ hasText: 'Columns Manage columns' });
        await form.getByPlaceholder('Search').fill('parent');
        await productPage.page.keyboard.press('Enter');
        await expect(form).toHaveText(/Parent/);
    });

    test('Attributes should be visible', async ({ productPage }) => {
        await productPage.goto();
        await productPage.page.getByText('Columns', { exact: true }).click();
        const form = productPage.page.locator('form').filter({ hasText: 'Columns Manage columns' });
        await expect(productPage.page.getByText('Manage columns')).toBeVisible();
        await expect(productPage.page.getByText('Available Columns')).toBeVisible();
        await expect(productPage.page.getByText('Selected Columns')).toBeVisible();
        await expect(form).toHaveText(/Attribute Family/);
        await expect(form).toHaveText(/Meta Title/);
        await expect(form).toHaveText(/Name/);
    });

    test('check Is Filterable', async ({ productPage, adminPage }) => {
        await productPage.goto();
        await productPage.openFilter();
        await expect(productPage.page.getByText('Apply Filters')).toBeVisible();
        const filterDrawer = productPage.page.locator('div[class*="overflow-auto"]');
        await expect(filterDrawer.getByText('Image')).toHaveCount(0);
        await productPage.page.getByText('Save').click();
        await adminPage.getByRole('link', { name: 'Attributes' }).click();
        await productPage.search('Image');
        const itemRow = productPage.page.locator('div', { hasText: 'image' }).nth(1);
        await itemRow.locator('span[title="Edit"]').nth(1).click();
        await adminPage.getByText('Is Filterable').check();
        await expect(adminPage.getByText('Is Filterable')).toBeChecked();
        await adminPage.getByRole('button', { name: 'Save Attribute' }).click();
        await expect(adminPage.getByText(/Attribute Updated Successfully/)).toBeVisible();
        await adminPage.locator('a:has-text("Back")').click();
        await adminPage.getByRole('link', { name: 'Products' }).click();
        await productPage.openFilter();
        await expect(productPage.page.getByText('Apply Filters')).toBeVisible();
        await expect(filterDrawer.getByText('Image')).toBeVisible();
    });

    test('Add Column to the product data grid and verify', async ({ productPage }) => {
        await productPage.goto();
        await productPage.page.getByText('Columns', { exact: true }).click();
        const dragHandle = productPage.page.locator('div:has(span:text("Parent")) >> i.icon-drag').first();
        const dropTarget = productPage.page.locator('div:has-text("Selected Columns")').first();
        const dragBox = await dragHandle.boundingBox();
        const dropBox = await dropTarget.boundingBox();
        if (dragBox && dropBox) {
            await productPage.page.mouse.move(
                dragBox.x + dragBox.width / 2,
                dragBox.y + dragBox.height / 2
            );
            await productPage.page.mouse.down();
            await productPage.page.mouse.move(
                dropBox.x + dropBox.width / 2,
                dropBox.y + dropBox.height / 2,
                { steps: 50 }
            );
            await productPage.page.mouse.up();
        }
        await expect(
            productPage.page.locator('div:has-text("Selected Columns") >> text=Parent')
        ).toBeVisible();
        await productPage.page.getByRole('button', { name: 'Apply' }).click();
    });
});
