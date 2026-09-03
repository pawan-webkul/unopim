const { BasePage } = require('./BasePage');

class UserPage extends BasePage {
  constructor(page) {
    super(page);
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.searchInput = page.getByPlaceholder('Search').first();
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
  }

  async openListing() {
    await this.navigateTo('users');
    await this.waitForLoad();
  }

  async openCreateForm() {
    await this.openListing();
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchByEmail(email) {
    await this.openListing();
    await this.searchInput.fill(email);
    await this.page.keyboard.press('Enter');
    await this.waitForLoad();
  }
}

module.exports = { UserPage };
