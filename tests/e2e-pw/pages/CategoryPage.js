const { BasePage } = require('./BasePage');
const { clickSave, clickSaveAndExpect, searchInDataGrid, generateUid } = require('../utils/helpers');

class CategoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.addLink = () => page.getByRole('link', { name: 'Add Category' });
    this.codeInput = () => page.locator('input[name="code"]');
    this.nameInput = () => page.locator('#name');
    this.searchInput = () => page.getByRole('textbox', { name: 'Search', exact: true });
  }

  async openListing() {
    await this.navigateTo('categories');
    await this.waitForLoad();
  }

  async openCreateForm() {
    await this.openListing();
    await this.addLink().click();
    await this.page.waitForLoadState('networkidle');
    await this.codeInput().waitFor({ state: 'visible' });
    await this.page.waitForTimeout(1200);
  }

  async createCategory(code, name) {
    await this.openCreateForm();
    await this.codeInput().fill(code);
    await this.nameInput().fill(name);
    await clickSaveAndExpect(this.page, 'Save changes', /category created successfully/i);
  }

  async searchByCode(code) {
    await this.openListing();
    await searchInDataGrid(this.page, code);
  }

  async deleteByCode(code) {
    await this.searchByCode(code);
    const deleteBtn = this.page.locator('div', { hasText: code }).locator('span[title="Delete"]').first();
    if (await deleteBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await deleteBtn.click();
      await this.page.locator('.max-w-\\[400px\\]').getByRole('button', { name: 'Delete', exact: true }).click();
      await this.waitForLoad();
    }
  }
}

module.exports = { CategoryPage };
