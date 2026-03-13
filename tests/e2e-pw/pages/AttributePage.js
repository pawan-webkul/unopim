const { BasePage } = require('./BasePage');

/**
 * Page Object for the Attribute management section.
 * Path: /admin/catalog/attributes
 */
class AttributePage extends BasePage {
    // ---------------------------------------------------------------------------
    // Navigation
    // ---------------------------------------------------------------------------

    async goto() {
        await this.navigateToCatalog();
        await this.page.getByRole('link', { name: 'Attributes' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async gotoCreate() {
        await this.goto();
        await this.page.getByRole('link', { name: 'Create Attribute' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    // ---------------------------------------------------------------------------
    // Form helpers
    // ---------------------------------------------------------------------------

    async fillCode(code) {
        const codeField = this.page.getByRole('textbox', { name: 'Code' });
        await codeField.click();
        await codeField.fill(code);
    }

    async selectType(typeName) {
        await this.page
            .locator('input[name="type"]')
            .locator('..')
            .locator('.multiselect__placeholder')
            .click();
        await this.page.getByRole('option', { name: typeName }).locator('span').first().click();
    }

    async searchAndSelectType(searchText, typeName) {
        await this.page
            .locator('input[name="type"]')
            .locator('..')
            .locator('.multiselect__placeholder')
            .click();
        await this.page.locator('input[name="type"][type="text"]').fill(searchText);
        await this.page.getByRole('option', { name: typeName }).locator('span').first().click();
    }

    async fillName(name, locale = 'en_US') {
        const nameField = this.page.locator(`input[name="${locale}[name]"]`);
        await nameField.click();
        await nameField.fill(name);
    }

    async save() {
        await this.page.getByRole('button', { name: 'Save Attribute' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    // ---------------------------------------------------------------------------
    // CRUD operations
    // ---------------------------------------------------------------------------

    /**
     * Create an attribute with the given code, type, and English name.
     */
    async create({ code, type, name, locale = 'en_US' }) {
        await this.gotoCreate();
        if (code !== undefined) await this.fillCode(code);
        if (type) await this.searchAndSelectType(type, type);
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

    // ---------------------------------------------------------------------------
    // Attribute Option helpers
    // ---------------------------------------------------------------------------

    async openAddOptionDialog() {
        await this.page.getByText('Add Row').click();
    }

    async fillOptionForm({ code, label, locale = 'en_US' }) {
        const optionForm = this.page.locator('form').filter({ hasText: 'Add Option' });
        await optionForm.getByPlaceholder('Code').click();
        await optionForm.getByPlaceholder('Code').fill(code);
        await this.page.locator(`input[name="locales.${locale}"]`).click();
        await this.page.locator(`input[name="locales.${locale}"]`).fill(label);
    }

    async saveOption() {
        await this.page.getByRole('button', { name: 'Save Option' }).click();
    }

    async closeOptionDialog() {
        await this.page.getByText('Close').click();
    }

    /** Add a single text option to an attribute that is already in edit mode. */
    async addTextOption({ code, label, locale = 'en_US' }) {
        await this.openAddOptionDialog();
        await this.fillOptionForm({ code, label: label || code, locale });
        await this.saveOption();
    }

    /** Add a color-swatch option. */
    async addColorSwatchOption({ code, color, label, locale = 'en_US' }) {
        await this.openAddOptionDialog();
        await this.page.getByPlaceholder('Color').click();
        await this.page.getByPlaceholder('Color').fill(color);
        const optionForm = this.page
            .locator('form')
            .filter({ hasText: 'Add Option Color Code English' });
        await optionForm.getByPlaceholder('Code').click();
        await optionForm.getByPlaceholder('Code').fill(code);
        await this.page.locator(`input[name="locales\\.${locale}"]`).click();
        await this.page.locator(`input[name="locales\\.${locale}"]`).fill(label);
        await this.saveOption();
    }
}

module.exports = { AttributePage };
