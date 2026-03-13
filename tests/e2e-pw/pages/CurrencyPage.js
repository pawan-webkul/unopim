const { BasePage } = require('./BasePage');

/**
 * Page Object for Currency management section.
 * Path: /admin/settings/currencies
 */
class CurrencyPage extends BasePage {
    async goto() {
        await this.navigateToSettings();
        await this.page.getByRole('link', { name: 'Currencies' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async gotoCreate() {
        await this.goto();
        await this.page.getByRole('link', { name: 'Create Currency' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async selectCurrencyCode(currencyCode) {
        await this.page.locator('#code').getByRole('combobox').locator('div').first().click();
        await this.page.getByRole('option', { name: currencyCode }).locator('span').first().click();
    }

    async save() {
        await this.page.getByRole('button', { name: 'Save Currency' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async create({ code }) {
        await this.gotoCreate();
        if (code) await this.selectCurrencyCode(code);
        await this.save();
    }

    async delete(rowText) {
        await this.clickDeleteForRow(rowText);
        await this.confirmDelete();
    }
}

module.exports = { CurrencyPage };
