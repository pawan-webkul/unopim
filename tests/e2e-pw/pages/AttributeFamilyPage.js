const { BasePage } = require('./BasePage');
const { clickSave, generateUid } = require('../utils/helpers');

class AttributeFamilyPage extends BasePage {
  constructor(page) {
    super(page);
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.codeInput = page.locator('input[name="code"]');
    this.nameInput = page.locator('input[name="name"]');
    this.searchInput = page.getByPlaceholder('Search').first();
  }

  async openListing() {
    await this.navigateTo('attributeFamilies');
    await this.waitForLoad();
  }

  async openCreateForm() {
    await this.openListing();
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchByCode(code) {
    await this.openListing();
    await this.searchInput.fill(code);
    await this.page.keyboard.press('Enter');
    await this.waitForLoad();
  }
}

module.exports = { AttributeFamilyPage };
