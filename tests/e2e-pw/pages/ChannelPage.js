const { BasePage } = require('./BasePage');

/**
 * Page Object for the Channel management section.
 * Path: /admin/settings/channels
 */
class ChannelPage extends BasePage {
    async goto() {
        await this.navigateToSettings();
        await this.page.getByRole('link', { name: 'Channels' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async gotoCreate() {
        await this.goto();
        await this.page.getByRole('link', { name: 'Create Channel' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async fillCode(code) {
        const field = this.page.getByRole('textbox', { name: 'Code' });
        await field.click();
        await field.fill(code);
    }

    async selectRootCategory(categoryName) {
        await this.page
            .locator('#root_category_id')
            .getByRole('combobox')
            .locator('div')
            .filter({ hasText: 'Select Root Category' })
            .click();
        await this.page.getByRole('option', { name: categoryName }).locator('span').first().click();
    }

    async fillName(name, locale = 'en_US') {
        const field = this.page.locator(`input[name="${locale}[name]"]`);
        await field.click();
        await field.fill(name);
    }

    async selectLocale(localeName) {
        await this.page
            .locator('#locales')
            .getByRole('combobox')
            .locator('div')
            .filter({ hasText: 'Select Locales' })
            .click();
        await this.page.getByRole('option', { name: localeName }).locator('span').first().click();
    }

    async selectCurrency(currencyName) {
        await this.page
            .locator('#currencies')
            .getByRole('combobox')
            .locator('div')
            .filter({ hasText: 'Select currencies' })
            .click();
        await this.page.getByRole('option', { name: currencyName }).locator('span').first().click();
    }

    async save() {
        await this.page.getByRole('button', { name: 'Save Channel' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async create({ code, rootCategory, name, locale, currency }) {
        await this.gotoCreate();
        if (code !== undefined) await this.fillCode(code);
        if (rootCategory) await this.selectRootCategory(rootCategory);
        if (name) await this.fillName(name);
        if (locale) await this.selectLocale(locale);
        if (currency) await this.selectCurrency(currency);
        await this.save();
    }

    async update({ rowText, name }) {
        await this.clickEditForRow(rowText);
        await this.fillName(name);
        await this.save();
    }

    async delete(rowText) {
        await this.clickDeleteForRow(rowText);
        await this.confirmDelete();
    }
}

module.exports = { ChannelPage };
