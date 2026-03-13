const { BasePage } = require('./BasePage');

/**
 * Page Object for the Category Field management section.
 * Path: /admin/catalog/category-fields
 */
class CategoryFieldPage extends BasePage {
    async goto() {
        await this.navigateToCatalog();
        await this.page.getByRole('link', { name: 'Category Fields' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async gotoCreate() {
        await this.goto();
        await this.page.getByRole('link', { name: 'Create Category Field' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async fillCode(code) {
        const field = this.page.getByRole('textbox', { name: 'Code' });
        await field.click();
        await field.fill(code);
    }

    async selectType(typeName) {
        await this.page
            .locator('input[name="type"]')
            .locator('..')
            .locator('.multiselect__placeholder')
            .click();
        await this.page.getByRole('option', { name: typeName }).locator('span').first().click();
    }

    async fillName(name, locale = 'en_US') {
        const field = this.page.locator(`input[name="${locale}[name]"]`);
        await field.click();
        await field.fill(name);
    }

    async save() {
        await this.page.getByRole('button', { name: 'Save Category Field' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async create({ code, type, name, locale = 'en_US' }) {
        await this.gotoCreate();
        if (code !== undefined) await this.fillCode(code);
        if (type) await this.selectType(type);
        if (name) await this.fillName(name, locale);
        await this.save();
    }

    async update({ rowText, name, locale = 'en_US' }) {
        await this.clickEditForRow(rowText);
        await this.fillName(name, locale);
        await this.save();
    }

    async delete(rowText) {
        await this.clickDeleteForRow(rowText);
        await this.confirmDelete();
    }
}

module.exports = { CategoryFieldPage };
