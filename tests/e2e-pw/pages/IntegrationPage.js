const { BasePage } = require('./BasePage');

/**
 * Page Object for Integration management section.
 * Path: /admin/configuration/integrations
 */
class IntegrationPage extends BasePage {
    async goto() {
        await this.navigateToConfiguration();
        await this.page.getByRole('link', { name: 'Integrations' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async gotoCreate() {
        await this.goto();
        await this.page.getByRole('link', { name: 'Create Integration' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async fillName(name) {
        const field = this.page.getByRole('textbox', { name: 'Name' });
        await field.click();
        await field.fill(name);
    }

    async save() {
        await this.page.getByRole('button', { name: 'Save Integration' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async create({ name }) {
        await this.gotoCreate();
        if (name !== undefined) await this.fillName(name);
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

module.exports = { IntegrationPage };
