const { BasePage } = require('./BasePage');

/**
 * Page Object for the Category management section.
 * Path: /admin/catalog/categories
 */
class CategoryPage extends BasePage {
    async goto() {
        await this.navigateToCatalog();
        await this.page.getByRole('link', { name: 'Categories' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async gotoCreate() {
        await this.goto();
        await this.page.getByRole('link', { name: 'Create Category' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async fillCode(code) {
        const field = this.page.locator('input[name="code"]');
        await field.click();
        await field.fill(code);
    }

    async fillName(name) {
        const field = this.page.locator('#name');
        await field.click();
        await field.fill(name);
    }

    async save() {
        await this.page.getByRole('button', { name: 'Save Category' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async create({ code, name }) {
        await this.gotoCreate();
        if (code !== undefined) await this.fillCode(code);
        if (name !== undefined) await this.fillName(name);
        await this.save();
    }

    async update({ rowText, name }) {
        await this.search(rowText);
        await this.clickEditForRow(rowText);
        await this.fillName(name);
        await this.save();
    }

    async delete(rowText) {
        await this.clickDeleteForRow(rowText);
        await this.confirmDelete();
    }
}

module.exports = { CategoryPage };
