const { BasePage } = require('./BasePage');

/**
 * Page Object for the Completeness tab within Attribute Family Edit.
 * Also handles general completeness UI elements.
 */
class CompletenessPage extends BasePage {
    /** Navigates to the Completeness tab of a specific family. */
    async gotoFamilyCompleteness(familyCode) {
        await this.navigateToCatalog();
        await this.page.getByRole('link', { name: 'Attribute Families' }).click();
        await this.search(familyCode);
        await this.clickEditForRow(familyCode);
        await this.page.getByRole('link', { name: 'Completeness' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async searchAttribute(term) {
        const searchBox = this.page.getByRole('textbox', { name: 'Search', exact: true });
        await searchBox.click();
        await searchBox.fill(term);
        await searchBox.press('Enter');
        await this.page.waitForLoadState('networkidle');
    }

    async openFilter() {
        await this.page.locator('.relative.inline-flex').filter({ has: this.page.locator('.icon-filter') }).click();
    }

    async fillFilterCode(code) {
        await this.page.getByRole('textbox', { name: 'Code' }).fill(code);
    }

    async fillFilterName(name) {
        await this.page.getByRole('textbox', { name: 'Name' }).fill(name);
    }

    async fillFilterChannel(channel) {
        await this.page.getByRole('textbox', { name: 'Required in Channels' }).fill(channel);
    }

    async applyFilter() {
        await this.page.getByText('Save').click();
        await this.page.waitForLoadState('networkidle');
    }

    /** Sets the required channel for an attribute row in the completeness grid. */
    async setRequiredChannel(attributeCode, channelName) {
        const row = this.page.locator('div').filter({ hasText: new RegExp(`^${attributeCode}$`, 'i') }).locator('..');
        await row.locator('.multiselect__tags').click();
        await this.page.getByRole('option', { name: channelName }).locator('span').first().click();
        await this.page.waitForLoadState('networkidle');
    }

    async performMassAction(actionName) {
        await this.selectAllRecords();
        await this.page.getByRole('button', { name: 'Select Action' }).click();
        await this.page.getByRole('link', { name: actionName }).click();
    }
}

module.exports = { CompletenessPage };
