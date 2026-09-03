const { BasePage } = require('./BasePage');
const { clickSave, clickSaveAndExpect, searchInDataGrid, generateUid, fillLocalizedField } = require('../utils/helpers');

class AttributePage extends BasePage {
  constructor(page) {
    super(page);
    this.createButton = () => page.getByRole('button', { name: 'Create Attribute' });
    this.codeInput = () => page.getByRole('textbox', { name: 'Code' });
    this.typeInput = () => page.locator('input[name="type"]').locator('..');
    this.nameInput = () => page.locator('input[name$="[name]"]').first();
    this.searchInput = () => page.getByRole('textbox', { name: 'Search', exact: true });
  }

  async openListing() {
    await this.navigateTo('attributes');
    await this.waitForLoad();
  }

  async openCreateForm() {
    await this.openListing();
    await this.createButton().click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectType(type) {
    await this.typeInput().locator('.multiselect__placeholder').click();
    await this.page.locator('input[name="type"][type="text"]').fill(type);
    await this.page.getByRole('option', { name: type }).first().click();
  }

  async createAttribute(code, name, type = 'Text') {
    await this.openCreateForm();
    await this.codeInput().fill(code);
    await this.selectType(type);
    await fillLocalizedField(this.page, name);
    await Promise.all([
      this.waitForURL(/\/attributes\/edit\//, { timeout: 20000 }),
      clickSave(this.page, 'Save Attribute'),
    ]);
    await this.page.locator('#app').getByText('Edit Attribute').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
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

module.exports = { AttributePage };
