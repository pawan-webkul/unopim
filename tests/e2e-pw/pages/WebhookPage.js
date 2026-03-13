const { BasePage } = require('./BasePage');

/**
 * Page Object for Webhook management section.
 * Path: /admin/configuration/webhooks
 */
class WebhookPage extends BasePage {
    async goto() {
        await this.navigateToConfiguration();
        await this.page.getByRole('link', { name: 'Webhooks' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async gotoCreate() {
        await this.goto();
        await this.page.getByRole('link', { name: 'Create Webhook' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async fillName(name) {
        const field = this.page.getByRole('textbox', { name: 'Name' });
        await field.click();
        await field.fill(name);
    }

    async fillUrl(url) {
        const field = this.page.getByRole('textbox', { name: 'URL' });
        await field.click();
        await field.fill(url);
    }

    async save() {
        await this.page.getByRole('button', { name: 'Save Webhook' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async create({ name, url }) {
        await this.gotoCreate();
        if (name !== undefined) await this.fillName(name);
        if (url !== undefined) await this.fillUrl(url);
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

module.exports = { WebhookPage };
