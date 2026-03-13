const { BasePage } = require('./BasePage');

/**
 * Page Object for User management section.
 * Path: /admin/settings/users
 */
class UserPage extends BasePage {
    async goto() {
        await this.navigateToSettings();
        await this.page.getByRole('link', { name: 'Users' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async gotoCreate() {
        await this.goto();
        await this.page.getByRole('button', { name: 'Create User' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async fillName(name) {
        const field = this.page.getByRole('textbox', { name: 'Name' });
        await field.click();
        await field.fill(name);
    }

    async fillEmail(email) {
        const field = this.page.getByRole('textbox', { name: 'email@example.com' });
        await field.click();
        await field.fill(email);
    }

    async fillPassword(password) {
        const field = this.page.getByRole('textbox', { name: 'Password', exact: true });
        await field.click();
        await field.fill(password);
    }

    async fillConfirmPassword(password) {
        const field = this.page.getByRole('textbox', { name: 'Confirm Password' });
        await field.click();
        await field.fill(password);
    }

    async selectUiLocale(localeName) {
        await this.page
            .locator('#ui_locale_id')
            .getByRole('combobox')
            .locator('div')
            .filter({ hasText: 'UI Locale' })
            .click();
        await this.page.getByRole('option', { name: localeName }).locator('span').first().click();
    }

    async selectTimezone(timezoneSearch) {
        await this.page.locator('div').filter({ hasText: /^Timezone$/ }).nth(1).click();
        await this.page.getByRole('textbox', { name: 'timezone-searchbox' }).fill(timezoneSearch);
        await this.page.keyboard.press('Enter');
    }

    async selectRole(roleName) {
        await this.page.locator('div').filter({ hasText: /^Role$/ }).nth(1).click();
        await this.page.getByRole('option', { name: roleName }).locator('span').first().click();
    }

    async toggleStatus() {
        await this.page.locator('label[for="status"]').click();
    }

    async save() {
        await this.page.getByRole('button', { name: 'Save User' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Fill and submit the Create User form.
     * Pass `undefined` to skip a field (to test validation).
     */
    async create({ name, email, password, confirmPassword, uiLocale, timezoneSearch, role }) {
        await this.gotoCreate();
        if (name !== undefined) await this.fillName(name);
        if (email !== undefined) await this.fillEmail(email);
        if (password !== undefined) await this.fillPassword(password);
        if (confirmPassword !== undefined) await this.fillConfirmPassword(confirmPassword);
        if (uiLocale) await this.selectUiLocale(uiLocale);
        if (timezoneSearch) await this.selectTimezone(timezoneSearch);
        if (role) await this.selectRole(role);
        await this.toggleStatus();
        await this.save();
    }

    async update({ rowText }) {
        await this.clickEditForRow(rowText);
        await this.toggleStatus();
        await this.save();
    }

    async delete(rowText) {
        await this.clickDeleteForRow(rowText);
        await this.confirmDelete();
    }
}

module.exports = { UserPage };
