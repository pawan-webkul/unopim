const { BasePage } = require('./BasePage');

/**
 * Page Object for the Admin Dashboard.
 */
class DashboardPage extends BasePage {
    async goto() {
        await this.page.getByRole('link', { name: 'Dashboard' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async getCompletenessChart() {
        return this.page.locator('circle').first();
    }

    async getLowCompletenessHeader() {
        return this.page.locator('header').filter({ hasText: 'Low completeness' });
    }

    async getLocaleCompleteness(localeName) {
        return this.page.getByText(new RegExp(`${localeName}\\d+%`, 'i'));
    }
}

module.exports = { DashboardPage };
