const { BasePage } = require('./BasePage');
const { clickSave, searchInDataGrid, generateUid } = require('../utils/helpers');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.createButton = page.getByRole('button', { name: 'Create Product' });
    this.skuInput = page.locator('input[name="sku"]');
    this.typeInput = () => page.locator('input[name="type"]');
    this.familyInput = () => page.locator('input[name="attribute_family_id"]');
    this.variantStructureInput = () => page.locator('input[name="variant_structure_id"]');
    this.submitButton = () => page.locator('button[type="submit"]');
    this.searchInput = () => page.getByPlaceholder('Search').first();
  }

  async openListing() {
    await this.navigateTo('products');
    await this.waitForLoad();
  }

  async openCreateForm() {
    await this.openListing();
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectMultiselect(fieldName, optionLabel) {
    const wrapper = this.page.locator(`input[name="${fieldName}"]`).locator('..');
    await wrapper.locator('.multiselect__tags').click();
    await wrapper.locator('.multiselect__content-wrapper').first().waitFor({ state: 'visible', timeout: 5000 });
    if (optionLabel) {
      await wrapper.locator(`input[name="${fieldName}"][type="text"]`).fill(optionLabel).catch(() => {});
      await wrapper.locator('.multiselect__option', { hasText: optionLabel }).first().click();
    } else {
      await wrapper
        .locator('.multiselect__element:not(.multiselect__element--disabled) .multiselect__option:not(.multiselect__option--disabled)')
        .first()
        .click();
    }
    await this.page.keyboard.press('Escape');
  }

  async createSimpleProduct(sku) {
    await this.openListing();
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.selectMultiselect('type', 'Simple');
    await this.selectMultiselect('attribute_family_id');
    await this.skuInput.fill(sku);
    await clickSave(this.page, 'Save Product');
    await this.waitForURL(/\/admin\/catalog\/products\/edit\//, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.waitForLoad();
    return sku;
  }

  async searchBySku(sku) {
    await this.openListing();
    await searchInDataGrid(this.page, sku);
  }

  async deleteBySku(sku) {
    await this.searchBySku(sku);
    const deleteIcon = this.page.locator('span[title="Delete"]').first();
    const visible = await deleteIcon.isVisible({ timeout: 3000 }).catch(() => false);
    if (!visible) return;
    await deleteIcon.click();
    await this.page.getByRole('button', { name: 'Delete' }).click();
    await this.page.locator('#app').getByText(/Product deleted successfully/i).waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    await this.waitForLoad();
  }
}

module.exports = { ProductPage };
