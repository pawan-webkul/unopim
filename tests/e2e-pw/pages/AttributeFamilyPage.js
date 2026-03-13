const { BasePage } = require('./BasePage');

/**
 * Page Object for the Attribute Family management section.
 * Path: /admin/catalog/families
 */
class AttributeFamilyPage extends BasePage {
    async goto() {
        await this.navigateToCatalog();
        await this.page.getByRole('link', { name: 'Attribute Families' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async gotoCreate() {
        await this.goto();
        await this.page.getByRole('link', { name: 'Create Attribute Family' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async fillCode(code) {
        const field = this.page.getByRole('textbox', { name: 'Enter Code' });
        await field.click();
        await field.fill(code);
    }

    async fillName(name, locale = 'en_US') {
        const field = this.page.locator(`input[name="${locale}[name]"]`);
        await field.click();
        await field.fill(name);
    }

    async save() {
        await this.page.getByRole('button', { name: 'Save Attribute Family' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async create({ code, name, locale = 'en_US' }) {
        await this.gotoCreate();
        if (code !== undefined) await this.fillCode(code);
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

    async assignAttributeGroup(groupName) {
        await this.page.getByText('Assign Attribute Group').click();
        await this.page.getByRole('combobox').locator('div').filter({ hasText: 'Select option' }).click();
        await this.page.getByRole('option', { name: groupName }).locator('span').first().click();
        await this.page.getByRole('button', { name: 'Assign Attribute Group' }).click();
    }

    async dragAttributeToGroup(attributeCode, groupSelector = '#assigned-attribute-groups .group_node') {
        const dragHandle = this.page.locator(`#unassigned-attributes i.icon-drag:near(:text("${attributeCode}"))`).first();
        const dropTarget = this.page.locator(groupSelector).first();

        const dragBox = await dragHandle.boundingBox();
        const dropBox = await dropTarget.boundingBox();

        if (dragBox && dropBox) {
            await this.page.mouse.move(dragBox.x + dragBox.width / 2, dragBox.y + dragBox.height / 2);
            await this.page.mouse.down();
            await this.page.mouse.move(dropBox.x + dropBox.width / 2, dropBox.y + dropBox.height / 2, { steps: 10 });
            await this.page.mouse.up();
        }
    }
}

module.exports = { AttributeFamilyPage };
