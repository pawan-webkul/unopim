const { BasePage } = require('./BasePage');

class WebhookPage extends BasePage {
  constructor(page) {
    super(page);
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.searchInput = page.getByPlaceholder('Search').first();
  }

  async openListing() {
    await this.navigateTo('webhook');
    await this.waitForLoad();
  }

  async openCreateForm() {
    await this.openListing();
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchByName(name) {
    await this.openListing();
    await this.searchInput.fill(name);
    await this.page.keyboard.press('Enter');
    await this.waitForLoad();
  }
}

module.exports = { WebhookPage };
