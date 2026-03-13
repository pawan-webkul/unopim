/**
 * BasePage — shared helpers used by all Page Object classes.
 *
 * Convention:
 *   - All methods are `async` and return `this` where chaining is useful.
 *   - Use Playwright's built-in auto-waiting; avoid `waitForTimeout` wherever possible.
 *   - Navigation helpers always wait for `networkidle` so subsequent actions are safe.
 */
class BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    // ---------------------------------------------------------------------------
    // Navigation helpers
    // ---------------------------------------------------------------------------

    async navigateToCatalog() {
        await this.page.getByRole('link', { name: ' Catalog' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToSettings() {
        await this.page.getByRole('link', { name: ' Settings' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToConfiguration() {
        await this.page.getByRole('link', { name: ' Configuration' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToDataTransfer() {
        await this.page.getByRole('link', { name: ' Data Transfer' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToDashboard() {
        await this.page.goto('/admin/dashboard');
        await this.page.waitForLoadState('networkidle');
    }

    // ---------------------------------------------------------------------------
    // DataGrid helpers
    // ---------------------------------------------------------------------------

    /**
     * Search in the main datagrid search box and wait for results.
     * @param {string} term
     */
    async search(term) {
        const searchBox = this.page.getByRole('textbox', { name: 'Search' });
        await searchBox.click();
        await searchBox.fill(term);
        await this.page.keyboard.press('Enter');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click the Edit row-action for a row that contains `rowText`.
     * @param {string} rowText  Unique text visible in the row
     */
    async clickEditForRow(rowText) {
        const row = this.page.locator('div', { hasText: rowText });
        await row.locator('span[title="Edit"]').first().click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click the Delete row-action for a row that contains `rowText`.
     * @param {string} rowText
     */
    async clickDeleteForRow(rowText) {
        const row = this.page.locator('div', { hasText: rowText });
        await row.locator('span[title="Delete"]').first().click();
    }

    /**
     * Click the Copy row-action for a row that contains `rowText`.
     * @param {string} rowText
     */
    async clickCopyForRow(rowText) {
        const row = this.page.locator('div', { hasText: rowText });
        await row.locator('span[title="Copy"]').first().click();
    }

    /**
     * Confirm a delete dialog by clicking the "Delete" button.
     */
    async confirmDelete() {
        await this.page.getByRole('button', { name: 'Delete' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Change the datagrid "items per page" selector.
     * @param {number} count  e.g. 20
     */
    async setItemsPerPage(count) {
        await this.page.getByRole('button', { name: '' }).click();
        await this.page.getByText(String(count), { exact: true }).click();
    }

    /**
     * Open the Filter drawer.
     */
    async openFilter() {
        await this.page.getByText('Filter', { exact: true }).click();
    }

    /**
     * Select all records using the mass-action checkbox.
     */
    async selectAllRecords() {
        await this.page.click('label[for="mass_action_select_all_records"]');
    }

    // ---------------------------------------------------------------------------
    // Multiselect (Vue multiselect) helpers
    // ---------------------------------------------------------------------------

    /**
     * Open a Vue multiselect and pick an option by label.
     * @param {string} inputName  value of the `name` attribute on the hidden input
     * @param {string} optionLabel
     */
    async selectMultiselectOption(inputName, optionLabel) {
        const wrapper = this.page.locator(`input[name="${inputName}"]`).locator('..');
        const placeholder = wrapper.locator('.multiselect__placeholder');
        // If placeholder isn't visible (already has a value), open the open arrow
        if (await placeholder.isVisible()) {
            await placeholder.click();
        } else {
            await wrapper.locator('.multiselect__select').click();
        }
        await this.page.getByRole('option', { name: optionLabel }).locator('span').first().click();
    }

    /**
     * Type into a Vue multiselect's search box, then pick the option.
     * @param {string} inputName
     * @param {string} searchText
     * @param {string} optionLabel
     */
    async searchAndSelectMultiselect(inputName, searchText, optionLabel) {
        const wrapper = this.page.locator(`input[name="${inputName}"]`).locator('..');
        await wrapper.locator('.multiselect__placeholder').click();
        await this.page.locator(`input[name="${inputName}"][type="text"]`).fill(searchText);
        await this.page.getByRole('option', { name: optionLabel }).locator('span').first().click();
    }

    // ---------------------------------------------------------------------------
    // Misc
    // ---------------------------------------------------------------------------

    /** Go back one step in history. */
    async goBack() {
        await this.page.goBack();
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = { BasePage };
