const { BasePage } = require('./BasePage');

/**
 * Page Object for the Product management section.
 * Path: /admin/catalog/products
 */
class ProductPage extends BasePage {
    async goto() {
        await this.navigateToCatalog();
        await this.page.getByRole('link', { name: 'Products' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async openCreateDialog() {
        await this.navigateToCatalog();
        await this.page.getByRole('button', { name: 'Create Product' }).click();
    }

    async selectProductType(type) {
        await this.page
            .locator('input[name="type"]')
            .locator('..')
            .locator('.multiselect__placeholder')
            .click();
        await this.page.getByRole('option', { name: type }).locator('span').first().click();
    }

    async selectFamily(family) {
        await this.page
            .locator('input[name="attribute_family_id"]')
            .locator('..')
            .locator('.multiselect__placeholder')
            .click();
        if (family) {
            await this.page.getByRole('option', { name: family }).locator('span').first().click();
        } else {
            await this.page.getByRole('option').first().click();
        }
    }

    async fillSku(sku) {
        await this.page.locator('input[name="sku"]').fill(sku);
    }

    async saveProduct() {
        await this.page.getByRole('button', { name: 'Save Product' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Create a product. Returns the SKU used.
     * @param {{ type?: string, family?: string, sku: string }} options
     */
    async create({ type, family, sku }) {
        await this.openCreateDialog();
        if (type) await this.selectProductType(type);
        if (family !== undefined) await this.selectFamily(family);
        if (sku) await this.fillSku(sku);
        await this.saveProduct();
        return sku;
    }

    async delete(rowText) {
        await this.goto();
        await this.clickDeleteForRow(rowText);
        await this.confirmDelete();
    }
}

module.exports = { ProductPage };
