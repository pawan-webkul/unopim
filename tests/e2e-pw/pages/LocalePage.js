const { BasePage } = require('./BasePage');

/**
 * Page Object for Locale management section.
 * Path: /admin/settings/locales
 */
class LocalePage extends BasePage {
    async goto() {
        await this.navigateToSettings();
        await this.page.getByRole('link', { name: 'Locales' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async gotoCreate() {
        await this.goto();
        await this.page.getByRole('link', { name: 'Create Locale' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async selectLocaleCode(localeCode) {
        await this.page.locator('#code').getByRole('combobox').locator('div').first().click();
        await this.page.getByRole('option', { name: localeCode }).locator('span').first().click();
    }

    async save() {
        await this.page.getByRole('button', { name: 'Save Locale' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async create({ code }) {
        await this.gotoCreate();
        if (code) await this.selectLocaleCode(code);
        await this.save();
    }

    async delete(rowText) {
        await this.clickDeleteForRow(rowText);
        await this.confirmDelete();
    }
}

module.exports = { LocalePage };
