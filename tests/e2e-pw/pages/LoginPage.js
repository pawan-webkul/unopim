const { BasePage } = require('./BasePage');

/**
 * Page Object for the Admin Login page.
 * Path: /admin/login
 */
class LoginPage extends BasePage {
    async goto() {
        await this.page.goto('/admin/login');
        await this.page.waitForLoadState('networkidle');
    }

    async fillEmail(email) {
        const field = this.page.getByRole('textbox', { name: 'Email', exact: true });
        await field.click();
        await field.fill(email);
    }

    async fillPassword(password) {
        const field = this.page.getByRole('textbox', { name: 'Password', exact: true });
        await field.click();
        await field.fill(password);
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Sign In' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async login(email, password) {
        await this.goto();
        if (email !== undefined) await this.fillEmail(email);
        if (password !== undefined) await this.fillPassword(password);
        await this.submit();
    }

    async togglePasswordVisibility() {
        await this.page.locator('.icon-view').click();
    }

    async logout() {
        await this.page.locator('.icon-settings').click(); // Clicking on user avatar/settings icon
        await this.page.getByRole('link', { name: 'Logout' }).click();
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = { LoginPage };
