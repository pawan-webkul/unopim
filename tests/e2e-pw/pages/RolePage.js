const { BasePage } = require('./BasePage');

/**
 * Page Object for Role management section.
 * Path: /admin/settings/roles
 */
class RolePage extends BasePage {
    async goto() {
        await this.navigateToSettings();
        await this.page.getByRole('link', { name: 'Roles' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async gotoCreate() {
        await this.goto();
        await this.page.getByRole('link', { name: 'Create Role' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async selectPermissionType(type) {
        await this.page
            .getByRole('combobox')
            .locator('div')
            .filter({ hasText: 'Custom' })
            .click();
        await this.page.getByRole('option', { name: type }).locator('span').first().click();
    }

    async fillName(name) {
        const field = this.page.getByRole('textbox', { name: 'Name' });
        await field.click();
        await field.fill(name);
    }

    async fillDescription(description) {
        const field = this.page.getByRole('textbox', { name: 'Description' });
        await field.click();
        await field.fill(description);
    }

    async checkPermission(label) {
        await this.page.locator('label').filter({ hasText: label }).locator('span').click();
    }

    async save() {
        await this.page.getByRole('button', { name: 'Save Role' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async create({ permissionType, name, description }) {
        await this.gotoCreate();
        if (permissionType) await this.selectPermissionType(permissionType);
        if (name !== undefined) await this.fillName(name);
        if (description !== undefined) await this.fillDescription(description);
        await this.save();
    }

    async update({ rowText, description }) {
        await this.clickEditForRow(rowText);
        await this.fillDescription(description);
        await this.save();
    }

    async delete(rowText) {
        await this.clickDeleteForRow(rowText);
        await this.confirmDelete();
    }
}

module.exports = { RolePage };
